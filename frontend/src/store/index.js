import { writable } from "svelte/store";

// وضعیت نمایش loading
export const isLoading = writable(false);

// وضعیت خطاها
export const error = writable(null);

// وضعیت کاربر جاری
export const currentUser = writable(null);

// تنظیمات برنامه
export const appSettings = writable({
  general: {
    siteName: "سامانه سوالات پزشکی",
    adminEmail: "admin@example.com",
    itemsPerPage: 10,
    defaultLanguage: "fa",
  },
  api: {
    n8nUrl: "https://n8n.example.com/webhook",
    enableLogging: true,
  },
  notification: {
    enableEmailNotifications: true,
    enablePushNotifications: false,
  },
});

// سوالات خام
export const rawQuestions = writable([]);

// سوالات پردازش شده
export const processedQuestions = writable([]);

// سوالات منتشر شده
export const publishedQuestions = writable([]);

// آمار داشبورد
export const dashboardStats = writable({
  rawCount: 0,
  processedCount: 0,
  publishedCount: 0,
  totalViews: 0,
});

// توابع کمکی برای مدیریت وضعیت

// شروع loading
export function startLoading() {
  isLoading.set(true);
}

// پایان loading
export function stopLoading() {
  isLoading.set(false);
}

// تنظیم خطا
export function setError(errorMessage) {
  error.set(errorMessage);

  // پاکسازی خودکار پیام خطا بعد از 5 ثانیه
  setTimeout(() => {
    error.set(null);
  }, 5000);
}

// پاکسازی خطا
export function clearError() {
  error.set(null);
}

// دریافت داده‌های داشبورد
export async function fetchDashboardData() {
  try {
    startLoading();

    // در حالت واقعی اینجا از API داده دریافت می‌شود
    // اینجا از داده‌های نمونه استفاده می‌کنیم

    // شبیه‌سازی تاخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 500));

    // داده‌های نمونه
    dashboardStats.set({
      rawCount: 124,
      processedCount: 85,
      publishedCount: 67,
      totalViews: 12453,
    });
  } catch (err) {
    setError("خطا در دریافت اطلاعات داشبورد");
    console.error(err);
  } finally {
    stopLoading();
  }
}

// دریافت سوالات خام
export async function fetchRawQuestions() {
  try {
    startLoading();

    // شبیه‌سازی تاخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 500));

    // داده‌های نمونه
    const data = [
      {
        id: 1,
        trackingCode: "QS-12345",
        subject: "مشکل پوستی و جوش صورت",
        category: "پوست",
        site: "سایت دکتر سلام",
        department: "پوست و مو",
      },
      {
        id: 2,
        trackingCode: "QS-12346",
        subject: "سردرد مزمن و مشکلات خواب",
        category: "مغز و اعصاب",
        site: "کلینیک آنلاین",
        department: "مغز و اعصاب",
      },
      {
        id: 3,
        trackingCode: "QS-12347",
        subject: "آلرژی فصلی و آبریزش بینی",
        category: "آلرژی",
        site: "سایت دکتر سلام",
        department: "آلرژی",
      },
      {
        id: 4,
        trackingCode: "QS-12348",
        subject: "درد مفاصل زانو",
        category: "ارتوپدی",
        site: "کلینیک آنلاین",
        department: "ارتوپدی",
      },
      {
        id: 5,
        trackingCode: "QS-12349",
        subject: "مشکل گوارشی و نفخ شکم",
        category: "گوارش",
        site: "سایت دکتر سلام",
        department: "گوارش",
      },
      {
        id: 6,
        trackingCode: "QS-12350",
        subject: "درد ناحیه قفسه سینه",
        category: "قلب",
        site: "کلینیک آنلاین",
        department: "قلب و عروق",
      },
      {
        id: 7,
        trackingCode: "QS-12351",
        subject: "ریزش مو و خارش پوست سر",
        category: "پوست",
        site: "سایت دکتر سلام",
        department: "پوست و مو",
      },
      {
        id: 8,
        trackingCode: "QS-12352",
        subject: "اضطراب و استرس مزمن",
        category: "روانپزشکی",
        site: "کلینیک آنلاین",
        department: "روانپزشکی",
      },
      {
        id: 9,
        trackingCode: "QS-12353",
        subject: "سرفه خشک و مداوم",
        category: "ریه",
        site: "سایت دکتر سلام",
        department: "ریه",
      },
      {
        id: 10,
        trackingCode: "QS-12354",
        subject: "کاهش ناگهانی وزن",
        category: "تغذیه",
        site: "کلینیک آنلاین",
        department: "تغذیه",
      },
    ];

    rawQuestions.set(data);
  } catch (err) {
    setError("خطا در دریافت سوالات خام");
    console.error(err);
  } finally {
    stopLoading();
  }
}

// دریافت سوالات پردازش شده
import { get } from "../utils/http.js";

export async function fetchProcessedQuestions() {
  try {
    startLoading();

    const { data } = await get("/processed-questions");

    processedQuestions.set(data);
  } catch (err) {
    setError("خطا در دریافت سوالات پردازش شده");
    console.error(err);
  } finally {
    stopLoading();
  }
}

// دریافت سوالات منتشر شده
export async function fetchPublishedQuestions() {
  try {
    startLoading();

    // شبیه‌سازی تاخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 500));

    // داده‌های نمونه
    const data = [
      {
        id: 1,
        trackingCode: "QS-12345",
        subject: "مشکل پوستی و جوش صورت",
        category: "پوست",
        site: "سایت دکتر سلام",
        department: "پوست و مو",
        views: 324,
        publishDate: "۱۴۰۲/۰۲/۲۵",
      },
      {
        id: 2,
        trackingCode: "QS-12346",
        subject: "سردرد مزمن و مشکلات خواب",
        category: "مغز و اعصاب",
        site: "کلینیک آنلاین",
        department: "مغز و اعصاب",
        views: 189,
        publishDate: "۱۴۰۲/۰۲/۲۴",
      },
      {
        id: 3,
        trackingCode: "QS-12347",
        subject: "آلرژی فصلی و آبریزش بینی",
        category: "آلرژی",
        site: "سایت دکتر سلام",
        department: "آلرژی",
        views: 531,
        publishDate: "۱۴۰۲/۰۲/۲۳",
      },
      {
        id: 4,
        trackingCode: "QS-12348",
        subject: "درد مفاصل زانو",
        category: "ارتوپدی",
        site: "کلینیک آنلاین",
        department: "ارتوپدی",
        views: 420,
        publishDate: "۱۴۰۲/۰۲/۲۲",
      },
      {
        id: 5,
        trackingCode: "QS-12349",
        subject: "مشکل گوارشی و نفخ شکم",
        category: "گوارش",
        site: "سایت دکتر سلام",
        department: "گوارش",
        views: 275,
        publishDate: "۱۴۰۲/۰۲/۲۱",
      },
    ];

    publishedQuestions.set(data);
  } catch (err) {
    setError("خطا در دریافت سوالات منتشر شده");
    console.error(err);
  } finally {
    stopLoading();
  }
}

// دریافت اطلاعات یک سوال با ID
export async function fetchQuestionById(id) {
  try {
    startLoading();

    // شبیه‌سازی تاخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 500));

    // در حالت واقعی اینجا درخواست API انجام می‌شود
    // برای نمونه یک داده ثابت برمی‌گردانیم

    const questionData = {
      id: id,
      trackingCode: `QS-${12345 + parseInt(id)}`,
      subject: "مشکل پوستی و جوش صورت",
      category: "پوست",
      site: "سایت دکتر سلام",
      department: "پوست و مو",
      source: "یسشیبیسبیس",
      viewer: 513,
      date: {
        unix: 1392034667,
        formatted: "2014-02-10 15:47:47",
      },
      conversation: [
        {
          sender: "user",
          message:
            "با سلام و خسته نباشید خدمت آقای دکتر ،نزدیک به یک ساله روی گونم لکه قهوه ای ظاهر شده با توجه زیاد میشه دیدش ولی من به پوستم خیلی اهمیت میدم از صابون زد قارچ استفاده کردم ولی هیچ بهتر نشده ممنون میشم کمکم کنید",
        },
        {
          sender: "doctor",
          message:
            "سلام سامره جان\nبهتره معاینه بشی\nلک های قهوه ای علل متعددی دارد که مهمترین اقدام شناسایی علت زمینه ای آن است.\nممکنه با کرم موضعی یا لیزر اوضاع بهتر بشه\nعلی الحساب ضد آفتاب فراموشت نشه\nموفق",
        },
      ],
    };

    return questionData;
  } catch (err) {
    setError(`خطا در دریافت اطلاعات سوال با شناسه ${id}`);
    console.error(err);
    return null;
  } finally {
    stopLoading();
  }
}

// ارسال سوال به n8n
export async function sendToN8n(id) {
  try {
    startLoading();

    // شبیه‌سازی تاخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // در حالت واقعی اینجا درخواست API انجام می‌شود
    console.log(`سوال با شناسه ${id} به n8n ارسال شد`);

    return true;
  } catch (err) {
    setError(`خطا در ارسال سوال با شناسه ${id} به n8n`);
    console.error(err);
    return false;
  } finally {
    stopLoading();
  }
}

// ذخیره تنظیمات
export async function saveSettings(settings) {
  try {
    startLoading();

    // شبیه‌سازی تاخیر شبکه
    await new Promise((resolve) => setTimeout(resolve, 800));

    // ذخیره تنظیمات در استور
    appSettings.set(settings);

    return true;
  } catch (err) {
    setError("خطا در ذخیره تنظیمات");
    console.error(err);
    return false;
  } finally {
    stopLoading();
  }
}
// ارسال سوال به n8n
export async function sendToN8n(id) {
  try {
    startLoading();

    // ارسال درخواست به API
    const response = await fetch(
      `${API_BASE_URL}/raw-questions/${id}/send-to-n8n`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`خطا در ارسال سوال به n8n: ${response.status}`);
    }

    const result = await response.json();

    // نمایش پیام موفقیت
    console.log("سوال با موفقیت به n8n ارسال شد:", result);
    return true;
  } catch (err) {
    setError(`خطا در ارسال سوال با شناسه ${id} به n8n: ${err.message}`);
    console.error(err);
    return false;
  } finally {
    stopLoading();
  }
}
