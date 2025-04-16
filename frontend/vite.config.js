import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],

  // بخش 'server' برای 'vite dev' (توسعه لوکال روی مک‌بوک)
  // اینجا چیزی اضافه نمی‌کنیم تا از پیش‌فرض‌ها استفاده کنه و مثل قبل روی localhost کار کنه.
  // server: {
  //   host: 'localhost', // رفتار پیش‌فرض
  //   port: 5173       // پورت پیش‌فرض ویت (مگر اینکه تغییرش داده باشی)
  // },

  // بخش 'preview' برای 'vite preview' (دستوری که در داکر اجرا می‌شود)
  preview: {
    host: "0.0.0.0", // مهم: باعث میشه در کانتینر داکر روی همه IP ها گوش بده
    port: 3000, // پورتی که در داکر و Nginx استفاده کردی
    strictPort: true, // اختیاری: مطمئن میشه همین پورت استفاده میشه
    allowedHosts: [
      "panel.doctorsoal.com", // دامنه اصلی شما که باید در داکر کار کنه
      // 'localhost',        // اگر می‌خوای 'vite preview' رو لوکال اجرا کنی و با localhost باز کنی، اینم اضافه کن
      // '127.0.0.1'         // مثل بالایی
    ], // فقط هاست‌های مجاز رو اینجا لیست کن
  },
});
