FROM node:18-alpine

WORKDIR /app

# کپی فایل‌های package.json
COPY package*.json ./
RUN npm install

# کپی بقیه فایل‌ها
COPY . .

# ساخت پروژه و کپی فایل‌های ساخته شده به مسیر اصلی
RUN export NODE_OPTIONS="--max-old-space-size=4096" && node ace build --production --ignore-ts-errors
RUN cp -r build/* .

EXPOSE 3333

# اجرای برنامه با استفاده از صریح از مسیر فایل server.js
CMD ["node", "server.js"]