#!/bin/bash

# Скрипт запуска приложения с миграциями
set -e

echo "Ожидание доступности базы данных..."
# Ждем, пока база данных станет доступной
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME; do
  echo "База данных недоступна, ждем..."
  sleep 2
done

echo "База данных доступна, выполняем миграции..."
alembic upgrade head

echo "Миграции выполнены, запускаем приложение..."
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
