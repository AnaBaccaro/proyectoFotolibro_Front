const trimSlash = (s) => (s || "").replace(/\/+$/, "");

export const API_URL = trimSlash(import.meta.env.VITE_API_URL) || "http://localhost:3001";
export const IMG_BASE_URL = trimSlash(import.meta.env.VITE_IMG_BASE_URL) || "https://img.proyectofotolibro.com";

export const PLACEHOLDER = `${IMG_BASE_URL}/placeholder.png`;