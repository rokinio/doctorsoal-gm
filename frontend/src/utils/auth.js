// frontend/src/utils/auth.js
import { API_BASE_URL } from "../config.js";
import { writable } from "svelte/store";

// ذخیره وضعیت احراز هویت کاربر
export const isAuthenticated = writable(false);

// ذخیره اطلاعات کاربر
export const user = writable(null);

/**
 * تابع ورود به سیستم
 * @param {string} username نام کاربری
 * @param {string} password رمز عبور
 * @returns {Promise<Object>} نتیجه عملیات
 */
export async function login(username, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // ذخیره اطلاعات احراز هویت در localStorage
      const credentials = btoa(`${username}:${password}`);
      localStorage.setItem("auth_token", credentials);
      localStorage.setItem("username", username);

      // به‌روزرسانی وضعیت احراز هویت
      isAuthenticated.set(true);
      user.set({ username });

      return { success: true, message: data.message };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("خطا در ورود به سیستم:", error);
    return { success: false, message: "خطا در ارتباط با سرور" };
  }
}

/**
 * تابع خروج از سیستم
 */
export function logout() {
  // حذف اطلاعات احراز هویت از localStorage
  localStorage.removeItem("auth_token");
  localStorage.removeItem("username");

  // به‌روزرسانی وضعیت احراز هویت
  isAuthenticated.set(false);
  user.set(null);
}

/**
 * تابع بررسی وضعیت احراز هویت
 * @returns {boolean} وضعیت احراز هویت
 */
export function checkAuth() {
  const token = localStorage.getItem("auth_token");
  const username = localStorage.getItem("username");

  if (token && username) {
    isAuthenticated.set(true);
    user.set({ username });
    return true;
  }

  return false;
}

/**
 * تابع دریافت هدرهای احراز هویت
 * @returns {Object} هدرهای احراز هویت
 */
export function getAuthHeaders() {
  const token = localStorage.getItem("auth_token");

  if (token) {
    return {
      Authorization: `Basic ${token}`,
    };
  }

  return {};
}

/**
 * تابع ارسال درخواست با احراز هویت
 * @param {string} url آدرس API
 * @param {Object} options تنظیمات درخواست
 * @returns {Promise<Response>} پاسخ درخواست
 */
export async function fetchWithAuth(url, options = {}) {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
