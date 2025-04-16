FROM node:18-alpine

WORKDIR /app

# کپی فایل‌های package.json
COPY package*.json ./
RUN npm install

# کپی بقیه فایل‌ها
COPY . .

# ساخت پروژه
RUN export NODE_OPTIONS="--max-old-space-size=4096" && node ace build --production --ignore-ts-errors

# تغییر دایرکتوری کاری به پوشه build
WORKDIR /app/build

EXPOSE 3333

# اجرای برنامه با استفاده از server.js در پوشه build
CMD ["node", "server.js"]

