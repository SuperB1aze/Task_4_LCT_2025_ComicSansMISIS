#!/usr/bin/env python3
"""
Тестовый API сервер для проверки компонента уверенности модели
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any
import uvicorn
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Test Confidence API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Хранение значения уверенности
confidence_value: float = 0.5

class ConfidenceRequest(BaseModel):
    confidence: float = Field(..., gt=0, le=1, description="Значение уверенности от 0 до 1")

class ConfidenceResponse(BaseModel):
    success: bool
    confidence: float
    message: str

@app.get("/api/confidence/", response_model=Dict[str, Any])
async def get_confidence():
    """Получить текущее значение уверенности модели"""
    logger.info(f"GET /api/confidence/ - текущее значение: {confidence_value}")
    return {
        "confidence": confidence_value,
        "message": "Текущее значение уверенности модели"
    }

@app.post("/api/confidence/", response_model=ConfidenceResponse)
async def set_confidence(request: ConfidenceRequest):
    """Установить новое значение уверенности модели"""
    global confidence_value
    
    logger.info(f"POST /api/confidence/ - новое значение: {request.confidence}")
    
    if request.confidence <= 0 or request.confidence > 1:
        raise HTTPException(
            status_code=400,
            detail="Значение уверенности должно быть от 0 до 1 (не включая 0)"
        )
    
    old_value = confidence_value
    confidence_value = request.confidence
    
    logger.info(f"Значение уверенности обновлено: {old_value} → {confidence_value}")
    
    return ConfidenceResponse(
        success=True,
        confidence=confidence_value,
        message=f"Значение уверенности успешно обновлено на {confidence_value}"
    )

@app.get("/health")
async def health_check():
    """Проверка здоровья API"""
    return {"status": "healthy", "confidence": confidence_value}

if __name__ == "__main__":
    print("🚀 Запуск тестового API сервера для уверенности модели")
    print("📡 API доступен по адресу: http://localhost:8000")
    print("📋 Endpoints:")
    print("  GET  /api/confidence/  - получить значение уверенности")
    print("  POST /api/confidence/  - установить значение уверенности")
    print("  GET  /health          - проверка здоровья")
    print("🛑 Для остановки нажмите Ctrl+C")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
