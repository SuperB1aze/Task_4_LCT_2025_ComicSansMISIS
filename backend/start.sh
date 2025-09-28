set -e

echo "Проверка подключения к БД"

while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME; do
  echo "База данных недоступна, ожидайте или перезапустите сервис"
  sleep 2
done

echo "База данных доступна, выполняются миграции"
alembic upgrade head

echo "Миграции выполнены, запуск приложения"
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
