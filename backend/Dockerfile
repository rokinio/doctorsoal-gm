FROM node:16-alpine

WORKDIR /app

# نصب پکیج‌های مورد نیاز
COPY package*.json ./
RUN npm install

# کپی همه فایل‌های پروژه
COPY . .

# بیلد پروژه
RUN node ace build --production

# در محیط تولید فایل‌های اضافی را پاک می‌کنیم
RUN if [ "$NODE_ENV" = "production" ]; then \
      rm -rf src tmp tests \
    ; fi

EXPOSE 3333

# دستور راه‌اندازی برنامه
CMD ["node", "server.js"]