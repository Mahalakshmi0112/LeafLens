import apiClient from './http';
import { checkBackendHealth } from './api';

jest.mock('./http', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

describe('checkBackendHealth', () => {
  beforeEach(() => {
    apiClient.get.mockReset();
  });

  test('uses the health endpoint and requires all services to be online', async () => {
    apiClient.get.mockResolvedValue({
      data: { express: 'online', mongodb: 'online', fastapi: 'online', status: 'ok' },
    });

    await expect(checkBackendHealth()).resolves.toBe(true);
    expect(apiClient.get).toHaveBeenCalledWith('/health', { timeout: 4000 });
  });

  test('reports services offline when FastAPI is missing or offline', async () => {
    apiClient.get.mockResolvedValue({
      data: { express: 'online', mongodb: 'online', status: 'ok' },
    });
    await expect(checkBackendHealth()).resolves.toBe(false);

    apiClient.get.mockResolvedValue({
      data: { express: 'online', mongodb: 'online', fastapi: 'offline', status: 'degraded' },
    });
    await expect(checkBackendHealth()).resolves.toBe(false);
  });

  test('reports services offline when the health request fails', async () => {
    apiClient.get.mockRejectedValue(new Error('request failed'));

    await expect(checkBackendHealth()).resolves.toBe(false);
  });
});