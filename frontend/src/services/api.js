/**
 * API Service for LeafLens
 * Handles FastAPI predict requests, multi-candidate health ping checks, and client-side image optimization
 */

// Generate candidate origins to test in order of likelihood
const getCandidateOrigins = () => {
  const candidates = [];

  // 1. Env origin if set
  if (process.env.REACT_APP_API_URL) {
    try {
      const parsed = new URL(process.env.REACT_APP_API_URL);
      candidates.push(parsed.origin);
    } catch (e) {}
  }

  // 2. Current window location hostname on port 8000 (allows phones on Wi-Fi to connect)
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const hostOrigin = `http://${window.location.hostname}:8000`;
    if (!candidates.includes(hostOrigin)) {
      candidates.push(hostOrigin);
    }
  }

  // 3. Localhost and loopback fallbacks
  if (!candidates.includes("http://localhost:8000")) {
    candidates.push("http://localhost:8000");
  }
  if (!candidates.includes("http://127.0.0.1:8000")) {
    candidates.push("http://127.0.0.1:8000");
  }

  return candidates;
};

// Cached working origin
let activeWorkingOrigin = null;

/**
 * Check backend status via /ping across candidate origins
 */
export async function checkBackendHealth() {
  const origins = getCandidateOrigins();

  for (const origin of origins) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      const res = await fetch(`${origin}/ping`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        activeWorkingOrigin = origin;
        return true;
      }
    } catch (err) {
      clearTimeout(timeoutId);
    }
  }

  return false;
}

/**
 * Get active predict base URL
 */
export function getPredictBaseUrl() {
  const origin = activeWorkingOrigin || getCandidateOrigins()[0] || "http://localhost:8000";
  return `${origin}/predict`;
}

/**
 * Client-side image optimization:
 * - Downscale high-resolution phone photos (max dimension ~1600px)
 * - Compress to JPEG quality ~0.85
 * - Return a standard File object ready for upload
 */
export async function optimizeImageForUpload(file, maxDimension = 1600) {
  return new Promise((resolve) => {
    // If not an image or SVG/GIF, pass through
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // If smaller than maxDimension, no downscaling needed
        if (width <= maxDimension && height <= maxDimension) {
          resolve(file);
          return;
        }

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const optimizedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          "image/jpeg",
          0.85
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Send image to model prediction endpoint with 30s timeout and automatic endpoint fallback
 */
export async function predictCropDisease(modelId, imageFile) {
  // Ensure we have a confirmed active origin or check now
  if (!activeWorkingOrigin) {
    await checkBackendHealth();
  }

  const predictBase = getPredictBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    // Optimize image client-side first
    const fileToSend = await optimizeImageForUpload(imageFile);

    const formData = new FormData();
    formData.append("file", fileToSend);

    const endpoint = `${predictBase}/${modelId}`;
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = "Failed to process image.";
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        if (response.status === 404) {
          errorMessage = `Model '${modelId}' was not found on the backend.`;
        } else if (response.status === 400) {
          errorMessage = "Uploaded file could not be recognized as a valid crop leaf.";
        } else if (response.status >= 500) {
          errorMessage = "The server encountered an error while analyzing the image.";
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      class: data.class,
      confidence: parseFloat(data.confidence) || 0,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Analysis timed out after 30 seconds. Please check backend connection and retry.");
    }
    if (err.message && err.message.includes("Failed to fetch")) {
      throw new Error("Cannot connect to backend server. Make sure the FastAPI server is running on port 8000.");
    }
    throw err;
  }
}
