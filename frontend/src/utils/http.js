// frontend/src/utils/http.js
import { API_BASE_URL } from "../config.js";

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
 * تابع ارسال درخواست به API با احراز هویت
 * @param {string} endpoint نقطه پایانی API
 * @param {Object} options تنظیمات درخواست
 * @returns {Promise<Object>} پاسخ درخواست
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint.replace(/^\//, "")}`;

  // اضافه کردن هدرهای احراز هویت
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...getAuthHeaders(),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // اگر خطای 401 (عدم احراز هویت) دریافت شد، کاربر را به صفحه لاگین هدایت کنید
    if (response.status === 401) {
      // پاکسازی اطلاعات احراز هویت محلی
      localStorage.removeItem("auth_token");
      localStorage.removeItem("username");

      // ذخیره مسیر فعلی برای بازگشت پس از لاگین
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath
      )}`;
      throw new Error("خطای احراز هویت: لطفاً دوباره وارد شوید");
    }

    // تلاش برای پارس کردن پاسخ به عنوان JSON
    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      // اگر پاسخ JSON نباشد، خطا را نادیده می‌گیریم و data را null قرار می‌دهیم
      console.warn("پاسخ JSON نیست:", e);
    }

    return { data, status: response.status, ok: response.ok };
  } catch (error) {
    console.error(`خطا در درخواست به ${endpoint}:`, error);
    throw error;
  }
}

/**
 * تابع دریافت اطلاعات از API
 * @param {string} endpoint نقطه پایانی API
 * @param {Object} options تنظیمات درخواست
 * @returns {Promise<Object>} پاسخ درخواست
 */
export function get(endpoint, options = {}) {
  return apiRequest(endpoint, { ...options, method: "GET" });
}

/**
 * تابع ارسال اطلاعات به API
 * @param {string} endpoint نقطه پایانی API
 * @param {Object} data داده‌های ارسالی
 * @param {Object} options تنظیمات درخواست
 * @returns {Promise<Object>} پاسخ درخواست
 */
export function post(endpoint, data, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * تابع به‌روزرسانی اطلاعات در API
 * @param {string} endpoint نقطه پایانی API
 * @param {Object} data داده‌های ارسالی
 * @param {Object} options تنظیمات درخواست
 * @returns {Promise<Object>} پاسخ درخواست
 */
export function put(endpoint, data, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * تابع حذف اطلاعات از API
 * @param {string} endpoint نقطه پایانی API
 * @param {Object} options تنظیمات درخواست
 * @returns {Promise<Object>} پاسخ درخواست
 */
export function del(endpoint, options = {}) {
  return apiRequest(endpoint, { ...options, method: "DELETE" });
}
