import apiClient from "./http";

const HISTORY_KEY = "leaflens_scan_history_v1";
const CHECKLIST_PREFIX = "leaflens_checklist_";
const isLoggedIn = () => Boolean(localStorage.getItem("leaflens_token"));

export async function createThumbnail(file, maxDimension = 180) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) return resolve(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        let quality = 0.5;
        let output = canvas.toDataURL("image/jpeg", quality);
        while (Math.ceil((output.split(",")[1].length * 3) / 4) > 40 * 1024 && quality > 0.2) {
          quality -= 0.1;
          output = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(Math.ceil((output.split(",")[1].length * 3) / 4) <= 40 * 1024 ? output : null);
      };
      image.onerror = () => resolve(null);
      image.src = event.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export function getGuestScanHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch (error) { return []; }
}

export function clearGuestHistory() {
  try {
    getGuestScanHistory().forEach((item) => localStorage.removeItem(`${CHECKLIST_PREFIX}${item.id}`));
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) { /* Storage may be disabled. */ }
}

export async function saveScanToHistory(scanRecord) {
  if (isLoggedIn()) {
    const { data } = await apiClient.post("/scans/import", { scans: [scanRecord] });
    return data.scans[0] || null;
  }
  try {
    const existing = getGuestScanHistory();
    const record = {
      ...scanRecord,
      id: scanRecord.id || `scan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: scanRecord.timestamp || new Date().toISOString(),
      notes: scanRecord.notes || "",
      checklistProgress: scanRecord.checklistProgress || {},
    };
    const updated = [record, ...existing.filter((item) => item.id !== record.id)].slice(0, 60);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return record;
  } catch (error) {
    console.error("Failed to save scan history", error);
    return null;
  }
}

export async function getScanHistory() {
  if (isLoggedIn()) {
    const { data } = await apiClient.get("/scans", { params: { limit: 100 } });
    return data.scans || [];
  }
  return getGuestScanHistory();
}

export async function getScanById(id) {
  if (isLoggedIn()) {
    const { data } = await apiClient.get(`/scans/${id}`);
    return data.scan;
  }
  return getGuestScanHistory().find((item) => item.id === id) || null;
}

export async function deleteScanById(id) {
  if (isLoggedIn()) {
    await apiClient.delete(`/scans/${id}`);
    return true;
  }
  try {
    const filtered = getGuestScanHistory().filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    localStorage.removeItem(`${CHECKLIST_PREFIX}${id}`);
    return true;
  } catch (error) { return false; }
}

export async function clearAllHistory() {
  if (isLoggedIn()) {
    await apiClient.delete("/scans");
    return true;
  }
  clearGuestHistory();
  return true;
}

export async function getChecklistProgress(resultId) {
  if (!resultId) return {};
  if (isLoggedIn() && /^[a-f\d]{24}$/i.test(resultId)) {
    try { return (await apiClient.get(`/scans/${resultId}`)).data.scan.checklistProgress || {}; } catch (error) { return {}; }
  }
  try { return JSON.parse(localStorage.getItem(`${CHECKLIST_PREFIX}${resultId}`) || "{}"); } catch (error) { return {}; }
}

export async function saveChecklistProgress(resultId, checklistState) {
  if (!resultId) return;
  if (isLoggedIn() && /^[a-f\d]{24}$/i.test(resultId)) {
    await apiClient.patch(`/scans/${resultId}`, { checklistProgress: checklistState });
    return;
  }
  try { localStorage.setItem(`${CHECKLIST_PREFIX}${resultId}`, JSON.stringify(checklistState)); } catch (error) { console.error("Failed to save checklist progress", error); }
}

export function getHistoryMetrics(history) {
  const list = Array.isArray(history) ? history : [];
  if (!list.length) return { total: 0, healthyCount: 0, diseasedCount: 0, healthyPercent: 0, mostCommonDisease: "None yet", topCrop: "None yet" };
  const healthyCount = list.filter((item) => item.isHealthy).length;
  const diseases = {};
  const crops = {};
  list.forEach((item) => {
    crops[item.cropName] = (crops[item.cropName] || 0) + 1;
    if (!item.isHealthy) diseases[item.friendlyName] = (diseases[item.friendlyName] || 0) + 1;
  });
  const [topDisease, diseaseCount] = Object.entries(diseases).sort((a, b) => b[1] - a[1])[0] || ["All Healthy", 0];
  const [topCrop] = Object.entries(crops).sort((a, b) => b[1] - a[1])[0] || ["None"];
  return { total: list.length, healthyCount, diseasedCount: list.length - healthyCount, healthyPercent: Math.round(healthyCount / list.length * 100), mostCommonDisease: diseaseCount ? `${topDisease} (${diseaseCount})` : topDisease, topCrop };
}
