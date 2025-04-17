// vite.config.js
export default defineConfig({
  plugins: [svelte()],

  preview: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: [
      "panel.doctorsoal.com",
      "doctorsoal_frontend", // اضافه کردن نام کانتینر
      "localhost",
      "127.0.0.1",
    ],
  },
});
