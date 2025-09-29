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

try:
    from ML.yolo import CLASS_NAMES, run_inference
except ImportError as e:
    print(f"Ошибка импорта YOLO: {e}")
    sys.exit(1)

app = FastAPI(title="Tool Recognition API", version="1.0.0")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:5173", "http://localhost:3000", "http://localhost:3002", "http://localhost:3003"],
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
        # Сохраняем временный файл
        temp_filename = f"temp_{uuid.uuid4()}.jpg"
        temp_path = MEDIA_DIR / temp_filename
        
        with open(temp_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
        
        # Обрабатываем изображение
        final_image_filename = f"processed_{uuid.uuid4()}.jpg"
        final_image_path = MEDIA_DIR / final_image_filename
        
        # Настройка порогов уверенности
        custom_thresholds = {cls: confidence for cls in CLASS_NAMES}
        
        # Запускаем распознавание
        print(f"🔍 Запуск распознавания с порогом уверенности: {confidence}")
        predictions_json_path, vis_output_path = run_inference(
            str(temp_path),
            vis_output=str(final_image_path),
            thresholds=custom_thresholds
        )
        
        # Читаем результаты
        with open(predictions_json_path, "r", encoding="utf-8") as f:
            ml_predictions = json.load(f)
        
        # Преобразуем в формат ответа с дедупликацией
        found_tools = []
        seen_classes = set()
        for pred_id in ml_predictions:
            if pred_id < len(CLASS_NAMES) and pred_id not in seen_classes:
                tool_name = CLASS_NAMES[pred_id]
                found_tools.append({
                    "id": pred_id + 1,  # ID начинается с 1
                    "name": tool_name,
                    "serial_number": f"SN{pred_id:03d}",
                    "category": "hand_tools"
                })
                seen_classes.add(pred_id)
        
        # Определяем нужна ли ручная проверка
        hand_check = len(found_tools) < 5  # Простая логика
        
        # Удаляем временные файлы
        try:
            os.remove(temp_path)
            os.remove(predictions_json_path)
        except:
            pass
        
        return JSONResponse(content={
            "found_tools": found_tools,
            "hand_check": hand_check,
            "processed_image_url": f"/media/{final_image_filename}",
            "ml_predictions": ml_predictions
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
    print("🚀 Запуск упрощенного backend'а...")
    print("📁 Модель:", "backend-repo/backend/src/ML/best.pt")
    print("🌐 API будет доступен на: http://localhost:8000")
    print("📖 Документация: http://localhost:8000/docs")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
