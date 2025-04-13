# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

# نصب پکیج‌های مورد نیاز
RUN apk add --no-cache git python3 make g++

# کپی فایل‌های پکیج
COPY package.json yarn.lock ./

# نصب وابستگی‌ها
RUN yarn install

# کپی بقیه فایل‌ها
COPY . .

# بیلد پروژه
RUN yarn build

# مرحله نهایی
FROM nginx:alpine

# کپی فایل‌های بیلد شده
COPY --from=builder /app/dist /usr/share/nginx/html

# کپی تنظیمات nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]