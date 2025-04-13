// frontend/src/config.js
export const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3333/api"
    : `${window.location.protocol}//${window.location.host}/api`;
