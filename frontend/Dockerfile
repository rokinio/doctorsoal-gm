FROM node:18-alpine AS builder

WORKDIR /app

# نصب پکیج‌های مورد نیاز
COPY package*.json ./
RUN npm install

# کپی همه فایل‌های پروژه
COPY . .

# ساخت پروژه
RUN npm run build

# مرحله دوم - از nginx برای سرو کردن فایل‌های استاتیک استفاده می‌کنیم
FROM nginx:alpine AS runner

# کپی فایل‌های ساخته شده به مسیر مناسب nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# کپی فایل پیکربندی nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# اجرای nginx
CMD ["nginx", "-g", "daemon off;"]