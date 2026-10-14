const axios = require('axios');
const FormData = require('form-data');

const MODEL_BY_CROP = { tomato: 'model1', potato: 'model2', grape: 'model3', corn: 'model4' };

async function requestPrediction(cropId, file) {
  const modelId = MODEL_BY_CROP[cropId];
  if (!modelId) {
    const error = new Error('Unsupported crop. Choose tomato, potato, grape, or corn.');
    error.status = 400;
    throw error;
  }
  const form = new FormData();
  form.append('file', file.buffer, { filename: file.originalname, contentType: file.mimetype });
  try {
    const response = await axios.post(
      `${(process.env.FASTAPI_URL || 'http://localhost:8000').replace(/\/$/, '')}/predict/${modelId}`,
      form,
      { headers: form.getHeaders(), timeout: 30000, maxBodyLength: 8 * 1024 * 1024 }
    );
    return { class: response.data.class, confidence: Number(response.data.confidence) };
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      const unavailable = new Error('The FastAPI inference service is unavailable. Start it on port 8000 and verify the model paths in backend/.env.');
      unavailable.status = 503;
      throw unavailable;
    }
    if (error.code === 'ECONNABORTED') {
      const timeout = new Error('Image analysis timed out after 30 seconds.');
      timeout.status = 504;
      throw timeout;
    }
    if (error.response) {
      const status = error.response.status;
      const detail = error.response.data && error.response.data.detail;
      let message = detail || 'FastAPI could not analyze this image.';
      if (status === 400) message = detail || 'Image rejected. Ensure it is a valid image of the selected crop.';
      else if (status === 404) message = `FastAPI model '${modelId}' was not loaded. Check the model path in backend/.env.`;
      else if (status >= 500) message = 'FastAPI encountered an inference error. Check its logs and model configuration.';
      const upstream = new Error(message);
      upstream.status = status === 400 ? 400 : status === 404 ? 503 : status >= 500 ? 502 : 502;
      throw upstream;
    }
    throw error;
  }
}

module.exports = { requestPrediction, MODEL_BY_CROP };
