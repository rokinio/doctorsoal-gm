FROM node:18-alpine

WORKDIR /app

# کپی فایل‌های package.json
COPY package*.json ./
RUN npm install

# کپی بقیه فایل‌ها
COPY . .

# ساخت پروژه
RUN export NODE_OPTIONS="--max-old-space-size=4096" && node ace build --production --ignore-ts-errors

# سپس اجرای مهاجرت‌های دیتابیس (migrations)
RUN chmod +x ./start-server.sh

EXPOSE 3333

# اجرای اسکریپت راه‌اندازی
CMD ["./start-server.sh"]