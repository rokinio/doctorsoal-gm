# مرحله ساخت
FROM node:18-alpine AS builder

WORKDIR /app

# افزودن متغیر محیطی برای رفع مشکل crypto
ENV NODE_OPTIONS=--openssl-legacy-provider

# نصب پکیج‌های مورد نیاز
COPY package*.json ./
RUN npm install

# کپی همه فایل‌های پروژه
COPY . .

# دریافت متغیرهای محیطی در زمان ساخت
ARG NODE_ENV
ARG API_URL
ENV NODE_ENV=${NODE_ENV}
ENV API_URL=${API_URL}

# بیلد پروژه
RUN npm run build

# مرحله اجرا
FROM node:18-alpine AS runner

WORKDIR /app

# کپی فایل‌های ساخته شده از مرحله قبل
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# نصب فقط پکیج‌های مورد نیاز تولید
RUN npm ci --only=production

# تنظیم متغیرهای محیطی برای زمان اجرا
ENV NODE_ENV=${NODE_ENV}
ENV API_URL=${API_URL}

EXPOSE 3000

# دستور راه‌اندازی برنامه
CMD ["npm", "run", "start"]