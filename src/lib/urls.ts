export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
export const DJANGO_API = process.env.NEXT_PUBLIC_DJANGO_API || 'http://localhost:8000';

export function getApiUrl(path: string) {
  return `${APP_URL}${path}`;
}

export function getDjangoApiUrl(path: string) {
  return `${DJANGO_API}${path}`;
}