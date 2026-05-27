// ============================================================
// Widget API Service
// ============================================================
// Reads config from window.QBotConfig.
// Connects to the existing backend API endpoints.
// No auth tokens, no admin logic — pure public widget chat API.
// ============================================================

import axios, { AxiosInstance } from 'axios';
import { ChatResponse } from '../types';

// Create a widget-specific axios instance
// (no auth interceptors from the main app)
let _apiInstance: AxiosInstance | null = null;

function getApi(baseUrl: string): AxiosInstance {
  if (!_apiInstance) {
    _apiInstance = axios.create({
      baseURL: baseUrl.endsWith('/api') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api`,
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
  }
  return _apiInstance;
}

export function resetApiInstance() {
  _apiInstance = null;
}

// ---- Types ----

export interface SendMessagePayload {
  query: string;
  tenant_id: string;
  conversation_id?: string | null;
  user_identifier?: string;
}

// ---- API calls ----

/**
 * Send a message to the existing backend /api/chat endpoint
 */
export async function sendMessage(
  payload: SendMessagePayload,
  apiBaseUrl: string,
  apiKey?: string
): Promise<ChatResponse> {
  const api = getApi(apiBaseUrl);

  const headers: Record<string, string> = {};
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }

  const response = await api.post<ChatResponse>('/chat', payload, { headers });
  return response.data;
}

/**
 * Health check ping to the backend (optional, used for initial connection test)
 */
export async function pingBackend(apiBaseUrl: string): Promise<boolean> {
  try {
    const api = getApi(apiBaseUrl);
    await api.get('/health', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
