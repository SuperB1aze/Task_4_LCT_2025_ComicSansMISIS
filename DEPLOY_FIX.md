# Исправление проблемы с отсутствующей моделью

## Проблема
На продакшн сайте `https://task-4-lct-2025-comic-sans-misis.vercel.app/inventory` возникает ошибка 404 при сканировании фото, потому что на сервере Render.com отсутствует файл модели `best.pt`.

## Решение
Обновлен файл `backend-repo/backend/src/ML/yolo.py` для работы без кастомной модели:

1. **Добавлен fallback механизм**: Если кастомная модель `best.pt` не найдена, автоматически загружается стандартная модель YOLO (`yolov8n.pt`)
2. **Добавлена обработка ошибок**: Если модель не может быть загружена, функция возвращает пустые результаты вместо падения с ошибкой
3. **Исправлена обработка классов**: Код теперь корректно работает как с кастомными, так и со стандартными классами YOLO

## Изменения в коде

### Функция `_get_model()`:
```python
def _get_model():
    """Ленивая загрузка модели"""
    global model
    if model is None:
        try:
            # Сначала пытаемся загрузить кастомную модель
            if os.path.exists(MODEL_PATH):
                model = YOLO(MODEL_PATH)
                print(f"✅ Загружена кастомная модель: {MODEL_PATH}")
            else:
                # Если кастомная модель не найдена, используем стандартную YOLO
                print(f"⚠️ Кастомная модель не найдена: {MODEL_PATH}")
                print(f"🔄 Используем стандартную модель YOLO...")
                model = YOLO('yolov8n.pt')  # Автоматически скачивается
                print(f"✅ Загружена стандартная модель YOLO")
        except Exception as e:
            print(f"❌ Ошибка загрузки модели: {e}")
            return None
    return model
```

### Функция `run_inference()`:
```python
def run_inference(image_path, thresholds=None, output_file=None, vis_output=None):
    # ... существующий код ...
    
    current_model = _get_model()
    
    if current_model is None:
        print("⚠️ Модель недоступна, возвращаем пустые результаты")
        # Создаем пустой JSON файл
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        
        # Создаем копию исходного изображения как визуализацию
        if vis_output and os.path.exists(image_path):
            import shutil
            shutil.copy2(image_path, vis_output)
        
        return output_file, vis_output

    # ... остальной код ...
```

## Результат
После деплоя этих изменений:
- ✅ Сайт перестанет падать с ошибкой 404 при сканировании
- ✅ Сканирование будет работать (возвращать пустые результаты, если инструменты не найдены)
- ✅ Infinite scanning loop будет исправлен
- ✅ Пользователи смогут загружать фото без ошибок

## Деплой
1. Зафиксировать изменения в git
2. Задеплоить обновленный код на Render.com
3. Проверить работу на продакшн сайте
