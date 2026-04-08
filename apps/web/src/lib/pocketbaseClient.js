import Pocketbase from 'pocketbase';

function getPocketBaseApiUrl() {
  const envUrl = import.meta.env.VITE_POCKETBASE_URL?.trim();

  if (envUrl) {
    return envUrl;
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
