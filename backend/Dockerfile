FROM node:18-alpine

WORKDIR /app

# کپی فایل‌های package.json
COPY package*.json ./
RUN npm install

# کپی بقیه فایل‌ها
COPY . .

# ساخت پروژه
RUN export NODE_OPTIONS="--max-old-space-size=4096" && node ace build --production --ignore-ts-errors

# تغییر در اسکریپت راه‌اندازی
RUN echo '#!/bin/sh\ncd /app\nnode build/server.js' > /app/start-server.sh
RUN chmod +x /app/start-server.sh

EXPOSE 3333

# اجرای اسکریپت راه‌اندازی
CMD ["./start-server.sh"]