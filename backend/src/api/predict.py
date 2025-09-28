import zipfile
import io
import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List


from src.services.predict_service import PredictService
from src.schemas.predict import PredictResponse, BatchPredictResponse
from src.utils.dependencies import get_db_session
from src.utils.unzip import extract_images_from_zip


router = APIRouter(prefix="/predict", tags=["predict"])



@router.post("/", response_model=PredictResponse)
async def predict_toolkit(
    image: UploadFile = File(...),
    toolkit_id: int = Form(...),
    confidence:float = Form(0.5),
    session: AsyncSession = Depends(get_db_session)
):
    """
    Эндпоинт для предикта инструментов на изображении
    """
    predict_service = PredictService(session)
    result = await predict_service.predict(image, toolkit_id,confidence)
    return result


@router.post("/batch", response_model=BatchPredictResponse)
async def predict_toolkit_batch(
    images: List[UploadFile] = File(...),
    toolkit_id: int = Form(...),
    confidence: float = Form(0.5),
    session: AsyncSession = Depends(get_db_session)
):
    """
    Анализ нескольких изображений
    """
    predict_service = PredictService(session)
    result = await predict_service.predict_batch(images, toolkit_id, confidence)
    return result


@router.post("/zip", response_model=BatchPredictResponse)
async def predict_toolkit_from_zip(
    zip_file: UploadFile = File(...),
    toolkit_id: int = Form(...),
    confidence: float = Form(0.5),
    session: AsyncSession = Depends(get_db_session)
):
    """
    Анализ изображений из зип файла
    """
    if not zip_file.filename or not zip_file.filename.lower().endswith('.zip'):
        raise HTTPException(status_code=400, detail="Файл должен быть ZIP-архивом")
    
    images = extract_images_from_zip(zip_file) # метод находится в утилках
    
    if not images:
        raise HTTPException(status_code=400, detail="В ZIP-архиве не найдено изображений")
    
    predict_service = PredictService(session)
    result = await predict_service.predict_batch(images, toolkit_id, confidence)
    return result
