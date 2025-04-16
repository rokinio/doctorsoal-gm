FROM node:18-alpine

WORKDIR /app

# نصب پکیج‌های مورد نیاز
COPY package*.json ./
RUN npm install

# کپی همه فایل‌های پروژه
COPY . .

# بیلد پروژه با تنظیمات خاص برای رفع خطاها
RUN export NODE_OPTIONS="--max-old-space-size=4096" && node ace build --production --ignore-ts-errors

# در محیط تولید فایل‌های اضافی را پاک می‌کنیم
RUN if [ "$NODE_ENV" = "production" ]; then \
      rm -rf src tmp tests \
    ; fi

EXPOSE 3333

# دستور راه‌اندازی برنامه
CMD ["node", "server.js"]