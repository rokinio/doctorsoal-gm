# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# نصب پکیج‌های مورد نیاز
RUN apk add --no-cache git python3 make g++

# کپی فایل‌های پکیج
COPY package*.json ./

# نصب وابستگی‌ها
RUN npm install

# کپی بقیه فایل‌ها
COPY . .

# بیلد پروژه
RUN node ace build --production

# کپی فایل‌های مورد نیاز
RUN cp .env.example build/.env

# ایجاد پوشه‌های مورد نیاز
RUN mkdir -p uploads
RUN chmod -R 777 uploads

EXPOSE 3333

CMD ["node", "build/server.js"]