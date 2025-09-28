#!/bin/bash

set -e

echo "Проверка подключения к базе данных"

while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME; do
  echo "База данных недоступна, ожидайте"
  sleep 2
done

echo "База данных доступна, выполнение актуальной миграции"
alembic upgrade head

echo "Миграции выполнены, запуск сервиса"
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
