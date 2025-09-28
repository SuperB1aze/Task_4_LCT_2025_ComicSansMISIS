from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from src.services.predict_service import PredictService
from src.schemas.predict import PredictResponse
from src.utils.dependencies import get_db_session

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
