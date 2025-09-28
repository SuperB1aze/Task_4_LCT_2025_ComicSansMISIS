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


class PredictRequest(BaseModel):
    """Запрос на предикт"""
    toolkit_id: int
    confidence: float = 0.5
