import io
from typing import List
import zipfile
import os
from fastapi import  UploadFile, HTTPException

def extract_images_from_zip(zip_file: UploadFile) -> List[UploadFile]:
    """
    Извлечение изображения из zip
    """
    try:
        zip_content = zip_file.file.read()
        zip_file.file.seek(0)  
        
        zip_buffer = io.BytesIO(zip_content)
        
        images = []
        supported_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
        
        with zipfile.ZipFile(zip_buffer, 'r') as zip_ref:
            for file_info in zip_ref.filelist:
                if not file_info.is_dir():
                    file_ext = os.path.splitext(file_info.filename)[1].lower()
                    if file_ext in supported_extensions:
                        file_content = zip_ref.read(file_info.filename)
                        
                        image_file = UploadFile(
                            filename=os.path.basename(file_info.filename),
                            file=io.BytesIO(file_content)
                        )
                        images.append(image_file)
        
        return images
        
    except zipfile.BadZipFile:
        raise HTTPException(status_code=400, detail="Некорректный ZIP-архив")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке ZIP-архива: {str(e)}")