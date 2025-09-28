import os
import uuid
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from src.ML.yolo import CLASS_NAMES, run_inference
from src.repo.predict_repos import ToolRepo, ToolKitRepo, ToolKitItemRepo
from src.schemas.predict import PredictResponse, ToolInfo
from typing import List


class PredictService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.tool_repo = ToolRepo(session)
        self.toolkit_repo = ToolKitRepo(session)
        self.toolkit_item_repo = ToolKitItemRepo(session)

    async def predict(self, image: UploadFile, toolkit_id: int,confidence: float = 0.5) -> PredictResponse:
        """
        Основной метод предикта
        """
        temp_image_path = await self._save_temp_image(image)
        
        try:
            final_image_filename = f"processed_{uuid.uuid4()}.jpg"
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            media_dir = os.path.join(base_dir, "media")
            final_image_path = os.path.join(media_dir, final_image_filename)

            custom_tresholds = {cls: confidence for cls in CLASS_NAMES}

            predictions_json_path, _ = run_inference(
                temp_image_path, 
                vis_output=final_image_path,
                thresholds=custom_tresholds
            )
            

            ml_predictions = await self._read_ml_predictions(predictions_json_path)
            

            toolkit_items = await self.toolkit_item_repo.get_items_by_toolkit_id(toolkit_id)
            

            found_tools, hand_check = await self._compare_predictions_with_toolkit(
                ml_predictions, toolkit_items
            )
            
            return PredictResponse(
                found_tools=found_tools,
                hand_check=hand_check,
                processed_image_url=f"/media/{final_image_filename}",
                ml_predictions=ml_predictions
            )
            
        finally:

            await self._cleanup_temp_files(temp_image_path, predictions_json_path)

    async def _save_temp_image(self, image: UploadFile) -> str:
        """Сохраняет изображение во временную папку"""

        file_extension = os.path.splitext(image.filename)[1] if image.filename else '.jpg'
        temp_filename = f"temp_{uuid.uuid4()}{file_extension}"
        

        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        media_dir = os.path.join(base_dir, "media")
        os.makedirs(media_dir, exist_ok=True)
        
        temp_path = os.path.join(media_dir, temp_filename)
        

        with open(temp_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
            
        return temp_path

    async def _read_ml_predictions(self, predictions_json_path: str) -> List[int]:
        """Читает предсказания из JSON файла"""
        import json
        
        with open(predictions_json_path, "r", encoding="utf-8") as f:
            predictions = json.load(f)
            
        return predictions

    async def _compare_predictions_with_toolkit(
        self, 
        ml_predictions: List[int], 
        toolkit_items: List
    ) -> tuple[List[ToolInfo], bool]:
        """
        Сравнивает найденные ML инструменты с ожидаемыми в наборе
        """

        expected_tool_ids = [item.tool.id for item in toolkit_items]
        

        found_tool_ids = [tool_id for tool_id in ml_predictions if tool_id in expected_tool_ids]
        

        found_tools = []
        if found_tool_ids:
            tools = await self.tool_repo.get_tools_by_ids(found_tool_ids)
            found_tools = [
                ToolInfo(
                    id=tool.id,
                    name=tool.name,
                    serial_number=tool.serial_number,
                    category=tool.category
                )
                for tool in tools
            ]
        
        # Определяем нужна ли ручная проверка

        hand_check = len(found_tool_ids) < len(expected_tool_ids)
        
        return found_tools, hand_check


    async def _cleanup_temp_files(self, *file_paths: str):
        """Удаляет временные файлы"""
        for file_path in file_paths:
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except OSError:
                    pass  