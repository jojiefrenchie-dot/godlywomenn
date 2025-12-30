function buildAbsoluteUrl(base: string, path: string) {
  if (!path) return '';
  // If already absolute, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  const b = String(base || '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return b + p;
}

const base = 'http://127.0.0.1:8000';
const path = 'marketplace/1WF-SUNDRESS-6-FLORAL-67-BLU-OS_2__77876.1683341597-544184084.jpg';

console.log(buildAbsoluteUrl(base, path));