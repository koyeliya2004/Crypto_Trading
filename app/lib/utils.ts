export interface ApiError extends Error {
  status?: number;
  code?: string;
  data?: any;
  body?: string;
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = new Error('API request failed') as ApiError;
    error.status = response.status;
    try {
      error.data = await response.json();
    } catch {
      // Try to read as text if JSON parse fails
      try {
        error.body = await response.text();
      } catch {
        // Ignore errors reading response body
      }
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
    });
}

/**
 * Retry configuration for API requests
 */
export interface RetryConfig {
  maxRetries?: number;  // Maximum number of retry attempts (default: 3)
  timeout?: number;     // Request timeout in milliseconds (default: 10000)
  shouldRetry?: (error: ApiError | Error, attempt: number) => boolean;  // Custom retry logic
}

/**
 * Creates an API request with automatic retry logic and exponential backoff.
 * 
 * Retry behavior:
 * - 429 (Rate Limited): Respects Retry-After header if present, otherwise uses exponential backoff
 * - 5xx errors: Retries with exponential backoff (2^attempt * 1000ms)
 * - 4xx errors (except 429): No retry, fails immediately
 * - Network errors: Retries with exponential backoff
 * 
 * @param url - The URL to fetch
 * @param options - Fetch options (headers, method, etc.)
 * @param retryConfig - Retry configuration
 * @returns Promise<Response> - The response from the API
 * @throws ApiError - If all retries fail or a non-retryable error occurs
 */
export async function createApiRequestWithRetries(
  url: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = {}
): Promise<Response> {
  const maxRetries = retryConfig.maxRetries ?? 3;
  const timeout = retryConfig.timeout ?? 10000;
  
  let attempt = 0;
  let lastError: ApiError | Error | null = null;

  while (attempt <= maxRetries) {
    try {
      const controller = new AbortController();
      const fetchOptions: RequestInit = {
        ...options,
        signal: controller.signal,
      };

      const timeoutId = setTimeout(() => {
        try {
          controller.abort();
        } catch {
          // ignore
        }
      }, timeout);

      const response = await fetch(url, fetchOptions)
        .finally(() => {
          clearTimeout(timeoutId);
        });

      // Success or client error (4xx except 429) - return immediately
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response;
      }

      // Handle 429 (Rate Limited)
      if (response.status === 429) {
        if (attempt >= maxRetries) {
          return response; // Return the 429 response after max retries
        }

        // Respect Retry-After header if present
        const retryAfter = response.headers.get('retry-after');
        let waitMs: number;
        if (retryAfter) {
          // Retry-After can be in seconds or a date
          const retryAfterNum = parseInt(retryAfter, 10);
          waitMs = isNaN(retryAfterNum) ? 1000 : retryAfterNum * 1000;
        } else {
          // Exponential backoff if no Retry-After header
          waitMs = Math.pow(2, attempt) * 1000;
        }
        
        await new Promise(resolve => setTimeout(resolve, waitMs));
        attempt++;
        continue;
      }

      // Handle 5xx errors with exponential backoff
      if (response.status >= 500) {
        if (attempt >= maxRetries) {
          return response; // Return the 5xx response after max retries
        }
        
        const waitMs = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitMs));
        attempt++;
        continue;
      }

      // For other status codes, return the response
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Check if we should retry using custom logic
      if (retryConfig.shouldRetry && !retryConfig.shouldRetry(lastError as ApiError, attempt)) {
        throw lastError;
      }
      
      // Network errors or timeouts - retry with exponential backoff
      if (attempt >= maxRetries) {
        throw lastError;
      }
      
      const waitMs = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitMs));
      attempt++;
    }
  }

  // This should never be reached, but TypeScript requires it
  throw lastError || new Error('Request failed after retries');
}