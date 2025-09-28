from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter(prefix="/media", tags=["media"])


@router.get("/{filename}")
async def get_image(filename: str):
    """
    Эндпоинт для получения изображений из папки medi
    """
    base_dir = Path(__file__).parent.parent.parent
    media_dir = base_dir / "src" / "media"
    file_path = media_dir / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Изображение не найдено")
    
    try:
        file_path.resolve().relative_to(media_dir.resolve())
    except ValueError:
        raise HTTPException(status_code=403, detail="Доступ запрещен")
    
    mime_type = "image/jpeg"
    if filename.lower().endswith('.png'):
        mime_type = "image/png"
    elif filename.lower().endswith('.gif'):
        mime_type = "image/gif"
    elif filename.lower().endswith('.webp'):
        mime_type = "image/webp"
    
    return FileResponse(
        path=file_path,
        media_type=mime_type,
        filename=filename,
        headers={"Content-Disposition": "inline"}
    )
