#!/usr/bin/env python3
"""
Упрощенный backend для тестирования распознавания инструментов
Работает без базы данных и Redis
"""

import os
import sys
import uuid
import json
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Добавляем путь к модулям
sys.path.append(str(Path(__file__).parent / "backend-repo" / "backend" / "src"))
sys.path.append(str(Path(__file__).parent))  # Добавляем текущую директорию

try:
    from ML.yolo import CLASS_NAMES, run_inference
    print("✅ ML модуль успешно импортирован")
except ImportError as e:
    print(f"Ошибка импорта YOLO: {e}")
    print(f"Текущая директория: {Path(__file__).parent}")
    print(f"Содержимое директории: {list(Path(__file__).parent.iterdir())}")
    # Попробуем альтернативный путь
    alt_path = Path(__file__).parent / "backend-repo" / "backend" / "src"
    print(f"Альтернативный путь: {alt_path}")
    print(f"Содержимое альтернативного пути: {list(alt_path.iterdir()) if alt_path.exists() else 'Не существует'}")
    
    # Попробуем скачать модель автоматически
    try:
        from download_model import download_model
        print("🔄 Пытаемся скачать модель...")
        if download_model():
            print("✅ Модель скачана, перезапускаем импорт...")
            from ML.yolo import CLASS_NAMES, run_inference
            print("✅ ML модуль успешно импортирован после скачивания модели")
        else:
            sys.exit(1)
    except Exception as download_error:
        print(f"❌ Не удалось скачать модель: {download_error}")
        sys.exit(1)

app = FastAPI(title="Tool Recognition API", version="1.0.0")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001", 
        "http://localhost:5173", 
        "http://localhost:3000", 
        "http://localhost:3002", 
        "http://localhost:3003",
        "https://task-4-lct-2025-comic-sans-misis.vercel.app",
        "*"  # Временно разрешаем все origins для тестирования
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Создаем директорию для медиа файлов
MEDIA_DIR = Path("backend-repo/backend/media")
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

@app.get("/")
async def root():
    return {"message": "Tool Recognition API is running!", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict/")
async def predict_tools(
    image: UploadFile = File(...),
    toolkit_id: int = Form(1),
    confidence: float = Form(0.1)
):
    """
    Распознавание инструментов на изображении
    """
    try:
        # Для демонстрации возвращаем mock данные
        # В реальном проекте здесь был бы вызов ML модели
        print(f"🔍 Получен запрос на распознавание с порогом уверенности: {confidence}")
        
        # Mock данные для демонстрации
        mock_tools = [
            {
                "id": 1,
                "name": "Отвертка крестовая",
                "serial_number": "SN001",
                "category": "hand_tools"
            },
            {
                "id": 2,
                "name": "Плоскогубцы",
                "serial_number": "SN002", 
                "category": "hand_tools"
            },
            {
                "id": 3,
                "name": "Ключ гаечный",
                "serial_number": "SN003",
                "category": "hand_tools"
            },
            {
                "id": 4,
                "name": "Молоток",
                "serial_number": "SN004",
                "category": "hand_tools"
            },
            {
                "id": 5,
                "name": "Ножницы",
                "serial_number": "SN005",
                "category": "hand_tools"
            }
        ]
        
        # Определяем нужна ли ручная проверка
        hand_check = len(mock_tools) < 5
        
        return JSONResponse(content={
            "found_tools": mock_tools,
            "hand_check": hand_check,
            "processed_image_url": None,
            "ml_predictions": [0, 1, 2, 3, 4]  # Mock predictions
        })
        
    except Exception as e:
        print(f"Ошибка при распознавании: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка распознавания: {str(e)}")

@app.get("/media/{filename}")
async def get_media(filename: str):
    """Получение обработанного изображения"""
    file_path = MEDIA_DIR / filename
    if file_path.exists():
        from fastapi.responses import FileResponse
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="Файл не найден")

if __name__ == "__main__":
    import os
    
    # Получаем порт из переменной окружения (для Heroku/Railway)
    port = int(os.environ.get("PORT", 8000))
    
    print("🚀 Запуск упрощенного backend'а...")
    
    # Проверяем наличие модели в разных местах
    model_paths = [
        "ML/best.pt",
        "backend-repo/backend/src/ML/best.pt"
    ]
    
    model_path = None
    for path in model_paths:
        if Path(path).exists():
            model_path = path
            break
    
    if model_path:
        print("📁 Модель:", model_path)
    else:
        print("⚠️ Модель не найдена!")
    
    print(f"🌐 API будет доступен на порту: {port}")
    print(f"📖 Документация: http://localhost:{port}/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=port)
