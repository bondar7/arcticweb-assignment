import axios from 'axios';

export type ApiErrorBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export type NormalizedApiError = {
  message: string;
  messages: string[];
  statusCode: number | null;
  error: string | null;
  isNetworkError: boolean;
  isAbortError: boolean;
  raw: unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isHtmlLikeString(value: string): boolean {
  const trimmed = value.trim().toLowerCase();

  return (
    trimmed.startsWith('<!doctype') ||
    trimmed.startsWith('<html') ||
    trimmed.includes('<body') ||
    trimmed.includes('</html>')
  );
}

function toMessageArray(value: unknown): string[] {
  if (typeof value === 'string') {
    const cleaned = value.trim();
    return cleaned && !isHtmlLikeString(cleaned) ? [cleaned] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) =>
      typeof entry === 'string' ? [entry.trim()] : [],
    ).filter(Boolean);
  }

  return [];
}

function extractMessages(data: unknown): string[] {
  if (typeof data === 'string') {
    return toMessageArray(data);
  }

  if (!isPlainObject(data)) {
    return [];
  }

  const messages = toMessageArray(data.message);
  if (messages.length > 0) {
    return messages;
  }

  const fallback = toMessageArray(data.error);
  if (fallback.length > 0) {
    return fallback;
  }

  return [];
}

function fallbackMessage(statusCode: number | null): string {
  if (statusCode === 404) {
    return 'The requested record was not found.';
  }

  if (statusCode === 429) {
    return 'Too many requests. Try again soon.';
  }

  if (statusCode && statusCode >= 500) {
    return 'The server returned an unexpected error.';
  }

  return 'The request could not be completed.';
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status ?? null;
    const rawData = error.response?.data;
    const messages = extractMessages(rawData);
    const fallback =
      typeof rawData === 'string' && !isHtmlLikeString(rawData)
        ? rawData.trim()
        : '';
    const message = messages[0] ?? (fallback || fallbackMessage(statusCode));

    return {
      message,
      messages: messages.length > 0 ? messages : [message],
      statusCode,
      error: isPlainObject(rawData) && typeof rawData.error === 'string'
        ? rawData.error
        : null,
      isNetworkError: !error.response,
      isAbortError: error.code === 'ERR_CANCELED',
      raw: rawData ?? error,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || 'The request could not be completed.',
      messages: [error.message || 'The request could not be completed.'],
      statusCode: null,
      error: error.name || null,
      isNetworkError: false,
      isAbortError: error.name === 'CanceledError',
      raw: error,
    };
  }

  const message = 'The request could not be completed.';

  return {
    message,
    messages: [message],
    statusCode: null,
    error: null,
    isNetworkError: false,
    isAbortError: false,
    raw: error,
  };
}

export function getApiErrorMessage(error: unknown): string {
  return normalizeApiError(error).message;
}

export function getFriendlyErrorMessage(
  error: unknown,
  fallbackMessage = 'The request could not be completed.',
): string {
  const normalized = normalizeApiError(error);
  return normalized.message || fallbackMessage;
}

export function isNotFoundError(error: unknown): boolean {
  return normalizeApiError(error).statusCode === 404;
}
