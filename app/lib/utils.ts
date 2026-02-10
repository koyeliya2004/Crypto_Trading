export interface ApiError extends Error {
  status?: number;
  code?: string;
  data?: any;
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = new Error('API request failed') as ApiError;
    error.status = response.status;
    try {
      error.data = await response.json();
    } catch {
      // Ignore JSON parse error for non-JSON error responses
    }
    throw error;
  }

  try {
    const data = await response.json();
    if (!data) {
      throw new Error('Empty response from API');
    }
    return data as T;
  } catch (error) {
    const apiError = new Error('Failed to parse API response') as ApiError;
    apiError.status = response.status;
    throw apiError;
  }
}

export function createApiRequest(url: string, options: RequestInit = {}): Promise<Response> {
  const timeout = 10000; // 10 seconds timeout
  const controller = new AbortController();
  const fetchOptions: RequestInit = {
    ...options,
    signal: controller.signal,
  };

  // Store original TLS env var and temporarily disable strict TLS in dev
  const originalValue = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const timeoutId = setTimeout(() => {
    try {
      controller.abort();
    } catch {
      // ignore
    }
  }, timeout);

  return fetch(url, fetchOptions)
    .finally(() => {
      clearTimeout(timeoutId);
      if (originalValue === undefined) {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      } else {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalValue;
      }
    });
}