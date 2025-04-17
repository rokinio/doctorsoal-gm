import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  preview: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    allowedHosts: "all", // به جای لیست دامنه‌ها، همه را مجاز می‌کنیم
  },
});
