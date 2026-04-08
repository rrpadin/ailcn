import Pocketbase from 'pocketbase';

function normalizePocketBaseUrl(url) {
  if (!url) {
    return url;
  }

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  if (url.startsWith('//')) {
    return `https:${url}`;
  }

  return `https://${url}`;
}

function getPocketBaseApiUrl() {
  const envUrl = import.meta.env.VITE_POCKETBASE_URL?.trim();

  if (envUrl) {
    return normalizePocketBaseUrl(envUrl);
  }

  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:8090`;
    }
  }

  return '/hcgi/platform';
}

const POCKETBASE_API_URL = getPocketBaseApiUrl();

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
