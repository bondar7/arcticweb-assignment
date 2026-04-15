import axios from 'axios';

const rawApiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002/api';

export const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, '') || rawApiBaseUrl;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
