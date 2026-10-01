/**
 * LocalStorage Service for Scan History & Action Checklists
 */

const HISTORY_KEY = "leaflens_scan_history_v1";
const CHECKLIST_PREFIX = "leaflens_checklist_";

/**
 * Generate a clean thumbnail data URL from a File or Image
 */
export async function createThumbnail(file, maxDimension = 300) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
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
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => resolve(null);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

/**
 * Save a new scan item to history
 */
export function saveScanToHistory(scanRecord) {
  try {
    const existing = getScanHistory();
    const newRecord = {
      id: scanRecord.id || `scan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: scanRecord.timestamp || new Date().toISOString(),
      cropId: scanRecord.cropId,
      cropName: scanRecord.cropName,
      rawLabel: scanRecord.rawLabel,
      friendlyName: scanRecord.friendlyName,
      confidence: scanRecord.confidence,
      isHealthy: Boolean(scanRecord.isHealthy),
      thumbnail: scanRecord.thumbnail || null,
      notes: scanRecord.notes || "",
    };

    // Prepend new record to top of history
    const updated = [newRecord, ...existing.filter((item) => item.id !== newRecord.id)].slice(0, 60); // Cap at 60 items
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (err) {
    console.error("Failed to save scan to history", err);
    return null;
  }
}

/**
 * Get all history records
 */
export function getScanHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read scan history", err);
    return [];
  }
}

/**
 * Get a single scan by ID
 */
export function getScanById(id) {
  const history = getScanHistory();
  return history.find((item) => item.id === id) || null;
}

/**
 * Delete a single scan by ID
 */
export function deleteScanById(id) {
  try {
    const existing = getScanHistory();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    localStorage.removeItem(`${CHECKLIST_PREFIX}${id}`);
    return true;
  } catch (err) {
    console.error("Failed to delete scan", err);
    return false;
  }
}

/**
 * Clear all history
 */
export function clearAllHistory() {
  try {
    const existing = getScanHistory();
    existing.forEach((item) => {
      localStorage.removeItem(`${CHECKLIST_PREFIX}${item.id}`);
    });
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (err) {
    console.error("Failed to clear history", err);
    return false;
  }
}

/**
 * Action Checklist Persistence
 */
export function getChecklistProgress(resultId) {
  if (!resultId) return {};
  try {
    const raw = localStorage.getItem(`${CHECKLIST_PREFIX}${resultId}`);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveChecklistProgress(resultId, checklistState) {
  if (!resultId) return;
  try {
    localStorage.setItem(`${CHECKLIST_PREFIX}${resultId}`, JSON.stringify(checklistState));
  } catch (e) {
    console.error("Failed to save checklist progress", e);
  }
}

/**
 * Compute summary statistics for the history dashboard
 */
export function getHistoryMetrics() {
  const history = getScanHistory();
  if (history.length === 0) {
    return {
      total: 0,
      healthyCount: 0,
      diseasedCount: 0,
      healthyPercent: 0,
      mostCommonDisease: "None yet",
      topCrop: "None yet",
    };
  }

  const total = history.length;
  const healthyCount = history.filter((h) => h.isHealthy).length;
  const diseasedCount = total - healthyCount;
  const healthyPercent = Math.round((healthyCount / total) * 100);

  // Frequency count for diseases (excluding healthy)
  const diseaseCounts = {};
  const cropCounts = {};

  history.forEach((h) => {
    cropCounts[h.cropName] = (cropCounts[h.cropName] || 0) + 1;
    if (!h.isHealthy) {
      diseaseCounts[h.friendlyName] = (diseaseCounts[h.friendlyName] || 0) + 1;
    }
  });

  // Find most frequent disease
  let mostCommonDisease = "All Healthy";
  let maxDCount = 0;
  Object.entries(diseaseCounts).forEach(([name, count]) => {
    if (count > maxDCount) {
      maxDCount = count;
      mostCommonDisease = `${name} (${count})`;
    }
  });

  // Find most scanned crop
  let topCrop = "None";
  let maxCCount = 0;
  Object.entries(cropCounts).forEach(([crop, count]) => {
    if (count > maxCCount) {
      maxCCount = count;
      topCrop = crop;
    }
  });

  return {
    total,
    healthyCount,
    diseasedCount,
    healthyPercent,
    mostCommonDisease,
    topCrop,
  };
}
