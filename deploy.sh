#!/bin/bash
# /opt/doctorsoal/deploy.sh

# مسیر پروژه
APP_DIR="/opt/doctorsoal"
cd $APP_DIR

# ایجاد پوشه‌های مورد نیاز
mkdir -p backend/uploads
chmod -R 777 backend/uploads

# توقف و حذف کانتینرهای قبلی
echo "Stopping all related containers"
docker stop doctorsoal_frontend doctorsoal_backend doctorsoal_redis || true
docker rm doctorsoal_frontend doctorsoal_backend doctorsoal_redis || true

# بیلد و اجرای کانتینرها
echo "Building and starting docker containers"
docker-compose -f docker-compose.yml up --build -d

# بررسی وضعیت کانتینرها
echo "Checking container status"
docker ps | grep doctorsoal

echo "Deployment completed!"