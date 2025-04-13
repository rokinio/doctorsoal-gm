#!/bin/bash
# /opt/setup_doctorsoal.sh

# ایجاد دایرکتوری پروژه
mkdir -p /opt/doctorsoal
cd /opt/doctorsoal

# ایجاد فایل .env.production
cat > .env.production << EOL
APP_KEY=rH552sQ6DDyRt7c2_Qd1Rr9HII4Km3MQ
DB_USER=doctorsoal_user
DB_PASSWORD=doctorsoal_strong_password
DB_NAME=doctorsoal_db
N8N_WEBHOOK_URL=https://n8n.hamyar.ai/webhook/f360f7e9-2fc3-4ecc-9e35-4e5bd371752c
EOL

# ایجاد فایل docker-compose.prod.yml
cat > docker-compose.prod.yml << 'EOL'
version: "3"

services:
  doctorsoal_frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://panel.doctorsoal.com/api
    image: doctorsoal_frontend:latest
    container_name: doctorsoal_frontend
    ports:
      - "3200:80"
    restart: unless-stopped
    networks:
      - hamyar_default

  doctorsoal_backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: doctorsoal_backend:latest
    container_name: doctorsoal_backend
    ports:
      - "3201:3333"
    restart: unless-stopped
    depends_on:
      - redis
    networks:
      - hamyar_default
      - mysql_default
    env_file:
      - ./.env.production
    environment:
      - REDIS_HOST=doctorsoal_redis
      - REDIS_PORT=6379
      - HOST=0.0.0.0
      - PORT=3333
      - DB_CONNECTION=pg
      - PG_HOST=mysql-mysql-1
      - PG_PORT=3306
      - PG_USER=${DB_USER}
      - PG_PASSWORD=${DB_PASSWORD}
      - PG_DB_NAME=${DB_NAME}
      - N8N_WEBHOOK_URL=${N8N_WEBHOOK_URL}
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/stats:/app/stats

  redis:
    image: redis:7
    container_name: doctorsoal_redis
    restart: unless-stopped
    networks:
      - hamyar_default

networks:
  hamyar_default:
    external: true
  mysql_default:
    external: true
EOL

# ایجاد اسکریپت دیپلوی
cat > deploy.sh << 'EOL'
#!/bin/bash

# مسیر پروژه
APP_DIR="/opt/doctorsoal"
GIT_REPO="https://github.com/rokinio/doctorsoal-gm"  # آدرس مخزن گیت خود را تغییر دهید

# ایجاد پوشه اگر وجود نداشته باشد
mkdir -p $APP_DIR
cd $APP_DIR

# بک‌آپ گرفتن از فایل آمار اگر وجود داشت
if [ -f "backend/stats/stats.json" ]; then
  echo "Taking backup of stats file..."
  cp backend/stats/stats.json /tmp/stats.json.backup
fi

# کلون یا آپدیت کردن مخزن
if [ ! -d ".git" ]; then
  git clone $GIT_REPO .
else
  git fetch origin main
  git reset --hard origin/main
fi

# ایجاد پوشه‌های مورد نیاز
mkdir -p backend/stats
mkdir -p backend/uploads
chmod -R 777 backend/stats
chmod -R 777 backend/uploads

# ایجاد nginx.conf اگر وجود نداشت
if [ ! -f "frontend/nginx.conf" ]; then
  cat > frontend/nginx.conf << 'EOLNGINX'
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # فعال کردن gzip
    gzip on;
    gzip_types text/plain application/javascript application/x-javascript text/javascript text/xml text/css;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOLNGINX
fi

# برگرداندن فایل آمار اگر قبلاً بک‌آپ گرفته شده بود
if [ -f "/tmp/stats.json.backup" ]; then
  echo "Restoring stats file..."
  cp /tmp/stats.json.backup backend/stats/stats.json
  rm /tmp/stats.json.backup
fi

# توقف و حذف کانتینرهای قبلی
echo "Stopping all related containers"
docker stop doctorsoal_frontend doctorsoal_backend doctorsoal_redis || true
docker rm doctorsoal_frontend doctorsoal_backend doctorsoal_redis || true

# بیلد و اجرای کانتینرها
echo "Building and starting docker containers"
docker-compose -f docker-compose.prod.yml up --build -d

# بررسی وضعیت کانتینرها
echo "Checking container status"
docker ps | grep doctorsoal

echo "Deployment completed!"
EOL

chmod +x deploy.sh

# ایجاد پوشه‌های مورد نیاز
mkdir -p frontend backend
mkdir -p backend/stats backend/uploads
chmod -R 777 backend/stats backend/uploads

echo "Setup completed! Now you can copy your project files or run the deploy script."