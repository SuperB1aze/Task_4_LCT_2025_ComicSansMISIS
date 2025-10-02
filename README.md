# Task_4_LCT_2025_ComicSansMISIS
Решение команды Comic Sans MISIS задания 4 от Аэрофлота "Сервис для автоматизации приёма и выдачи инструментов авиаинженерам на базе машинного обучения и компьютерного зрения" (хакатон ЛЦТ-2025).

## Документация

- [Backend документация](./backend/README.md) - Подробная документация по backend сервису
- [ML исходный код](./backend/src/ML/ml-base/) - Jupyter notebooks с обучением и инференсом YOLO модели




## Структура сервисов

- **frontend** - React приложение на nginx (порт 3000)
- **backend** - FastAPI приложение (порт 8000)
- **db** - PostgreSQL база данных (порт 54321)
- **redis** - Redis кэш (порт 6380)

## Запуск

1. Убедитесь, что у вас есть файл `.env` в папке `backend/` с необходимыми переменными окружения.

2. Запустите все сервисы:
```bash
docker-compose up --build
```

3. Для запуска в фоновом режиме:
```bash
docker-compose up -d --build
```

## Доступ к приложению

- Фронтенд: http://localhost:3000
- Бекенд API: http://localhost:8000
- PostgreSQL: localhost:54321
- Redis: localhost:6380

## Остановка

```bash
docker-compose down
```

Для полной очистки (включая тома):
```bash
docker-compose down -v
```

## Переменные окружения

Убедитесь, что в файле `backend/.env` настроены следующие переменные:

```env
DB_NAME=your_db_name
DB_HOST=db
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

## Особенности

- Фронтенд собирается в продакшн режиме и обслуживается через nginx
- Бекенд запускается с hot reload для разработки
- База данных и Redis используют постоянные тома для сохранения данных
- Все сервисы подключены к единой сети `app-network`
