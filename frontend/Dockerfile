FROM node:18-alpine AS builder

WORKDIR /app

# نصب پکیج‌های مورد نیاز
COPY package*.json ./
RUN npm install

# کپی همه فایل‌های پروژه
COPY . .

# ساخت پروژه
RUN npm run build

# مرحله دوم
FROM node:18-alpine AS runner

WORKDIR /app

# کپی فایل‌های ساخته شده
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# اضافه کردن اسکریپت start به package.json
RUN npm pkg set scripts.start="vite preview --host 0.0.0.0 --port 3000"

# نصب فقط پکیج‌های مورد نیاز تولید
RUN npm ci --only=production

EXPOSE 3000

# اجرای برنامه
CMD ["npm", "run", "start"]