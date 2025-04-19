FROM node:18-alpine

WORKDIR /app

# کپی فایل‌های package.json
COPY package*.json ./
RUN npm install

# کپی بقیه فایل‌ها
COPY . .

# ساخت پروژه
RUN export NODE_OPTIONS="--max-old-space-size=4096" && node ace build --production --ignore-ts-errors

# ---- این دو خط رو کامنت یا حذف کنید ----
# RUN echo '#!/bin/sh\ncd /app\nnode build/server.js' > /app/start-server.sh
# RUN chmod +x /app/start-server.sh

# (اختیاری) می‌تونید این خط رو برای دیباگ اضافه کنید تا مطمئن بشید فایل build شده وجود داره
# RUN ls -l build/

EXPOSE 3333

# ---- CMD رو به این صورت تغییر بدید ----
CMD ["node", "build/server.js"]
