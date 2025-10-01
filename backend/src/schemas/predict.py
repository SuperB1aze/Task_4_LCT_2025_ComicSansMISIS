from pydantic import BaseModel
from typing import List


class ToolInfo(BaseModel):
    """Информация об инструменте"""
    id: int
    name: str
    serial_number: str
    category: str


class PredictResponse(BaseModel):
    """Ответ сервиса предикта"""
    found_tools: List[ToolInfo]
    hand_check: bool
    processed_image_url: str  
    ml_predictions: List[int]
    inference_time_ms: float 


class PredictRequest(BaseModel):
    """Запрос на предикт"""
    toolkit_id: int
    confidence: float = 0.5


class BatchImageResult(BaseModel):
    """Результат обработки одного изображения в пакете"""
    filename: str
    success: bool
    found_tools: List[ToolInfo]
    hand_check: bool
    processed_image_url: str | None = None
    ml_predictions: List[int] | None = None
    inference_time_ms: float | None = None
    error_message: str | None = None


class BatchPredictResponse(BaseModel):
    """Ответ сервиса пакетного предикта"""
    successful_images: int
    failed_images: int
    results: List[BatchImageResult]
