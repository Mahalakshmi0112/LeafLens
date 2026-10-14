import apiClient from "./http";

export async function checkBackendHealth() {
  try {
    const { data } = await apiClient.get("/health", { timeout: 4000 });
    return data.express === "online" && data.mongodb === "online" && data.fastapi === "online";
  } catch (error) {
    return false;
  }
}

export function getPredictBaseUrl() {
  return `${apiClient.defaults.baseURL}/predict`;
}

export async function optimizeImageForUpload(file, maxDimension = 1600) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return resolve(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        let { width, height } = image;
        if (width <= maxDimension && height <= maxDimension) return resolve(file);
        const scale = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(image, 0, 0, width, height);
        canvas.toBlob((blob) => blob ? resolve(new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), { type: "image/jpeg", lastModified: Date.now() })) : resolve(file), "image/jpeg", 0.85);
      };
      image.onerror = () => resolve(file);
      image.src = event.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function createSmallThumbnail(file, maxBytes = 40 * 1024) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) return resolve(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 180 / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        let quality = 0.55;
        const render = () => {
          const dataUrl = canvas.toDataURL("image/jpeg", quality);
          const bytes = Math.ceil((dataUrl.split(",")[1].length * 3) / 4);
          if (bytes <= maxBytes || quality <= 0.2) return resolve(bytes <= maxBytes ? dataUrl : null);
          quality -= 0.1;
          render();
        };
        render();
      };
      image.onerror = () => resolve(null);
      image.src = event.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export async function predictCropDisease(cropId, imageFile) {
  const fileToSend = await optimizeImageForUpload(imageFile);
  const thumbnail = await createSmallThumbnail(imageFile);
  const formData = new FormData();
  formData.append("file", fileToSend);
  if (thumbnail) formData.append("thumbnail", thumbnail);
  try {
    const { data } = await apiClient.post(`/predict/${cropId}`, formData, { timeout: 30000 });
    return { class: data.class, confidence: Number(data.confidence) || 0 };
  } catch (error) {
    if (error.code === "ECONNABORTED") throw new Error("Analysis timed out after 30 seconds. Please check the inference service and retry.");
    if (!error.response) throw new Error("Cannot connect to Express API. Make sure it is running on port 5001.");
    throw new Error(error.response.data?.message || "The image could not be analyzed.");
  }
}
