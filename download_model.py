#!/usr/bin/env python3
"""
Скрипт для автоматической загрузки обученной модели
"""
import os
import requests
from pathlib import Path

def download_model():
    """Скачивает обученную модель с внешнего источника"""
    
    # Пути к модели
    model_paths = [
        "ML/best.pt",
        "backend-repo/backend/src/ML/best.pt"
    ]
    
    # URL для скачивания модели (замените на ваш реальный URL)
    model_url = "https://github.com/ultralytics/assets/releases/download/v8.3.0/yolov8n.pt"  # Временный fallback
    
    for model_path in model_paths:
        if not os.path.exists(model_path):
            print(f"⚠️ Модель не найдена: {model_path}")
            print(f"🔄 Скачиваем стандартную модель YOLO...")
            
            try:
                # Создаем директорию если не существует
                os.makedirs(os.path.dirname(model_path), exist_ok=True)
                
                # Скачиваем модель
                response = requests.get(model_url, stream=True)
                response.raise_for_status()
                
                with open(model_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                
                print(f"✅ Модель скачана: {model_path}")
                
            except Exception as e:
                print(f"❌ Ошибка скачивания модели: {e}")
                return False
    
    return True

if __name__ == "__main__":
    download_model()
