// frontend/src/config.js
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://panel.doctorsoal.com/api"
    : "http://localhost:3333/api";
