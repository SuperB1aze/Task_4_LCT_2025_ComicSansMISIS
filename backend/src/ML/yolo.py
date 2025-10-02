import os
import json
import cv2
import numpy as np
import torch
import time
from ultralytics import YOLO


# ======= Автовыбор бэкенда =======
USE_CUDA = torch.cuda.is_available()
DEVICE = "cuda:0" if USE_CUDA else "cpu"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ONNX_PATH = os.path.join(BASE_DIR, "ML", "best.onnx")    # ONNX CPU
PT_PATH = os.path.join(BASE_DIR, "ML", "best.pt")        # fallback PyTorch
MEDIA_DIR = os.path.join(BASE_DIR, "media")

# Автовыбор модели
if not USE_CUDA and os.path.isfile(ONNX_PATH):
    MODEL_PATH = ONNX_PATH
    print("Использую ONNX (CPU):", MODEL_PATH)
else:
    MODEL_PATH = PT_PATH
    print("Фолбэк на PyTorch .pt:", MODEL_PATH)


os.makedirs(MEDIA_DIR, exist_ok=True)

model = None


CLASS_NAMES = None


def _get_model():
    """Ленивая загрузка модели"""
    global model, CLASS_NAMES
    if model is None:
        model = YOLO(MODEL_PATH, task="detect")
        
        # Только для .pt имеет смысл .to()/.fuse()
        if MODEL_PATH.endswith(".pt"):
            model.to(DEVICE)
            if USE_CUDA:
                torch.backends.cudnn.benchmark = True  # ускорение для .pt
            try:
                model.fuse()
            except Exception:
                pass
        
        CLASS_NAMES = model.names
    return model


def run_inference(
    image_input,
    output_file=None,
    vis_output=None,
    model_conf=0.67,
    iou=0.6,
    imgsz=640,
    max_det=150,
):
    if output_file is None:
        output_file = os.path.join(MEDIA_DIR, "predictions.json")
    if vis_output is None:
        vis_output = os.path.join(MEDIA_DIR, "vis_result.jpg")

    # source
    if isinstance(image_input, (str, np.ndarray)):
        source = image_input
    else:
        raise TypeError("image_input должен быть str или np.ndarray")

    current_model = _get_model()
    
    use_half = USE_CUDA and MODEL_PATH.endswith(".pt")

    # замер времени (без I/O синхронизируем CUDA)
    _t0 = time.perf_counter()
    results = current_model.predict(
        source=source,
        imgsz=imgsz,
        conf=model_conf,
        iou=iou,
        max_det=max_det,
        device=DEVICE,
        half=use_half,
        verbose=False
    )
    if USE_CUDA:
        torch.cuda.synchronize()
    dt = (time.perf_counter() - _t0) * 1000.0

    predictions = []
    for r in results:
        boxes = r.boxes
        if boxes is None or len(boxes) == 0:
            continue

        classes = boxes.cls.cpu().numpy().astype(int)

        for cls_id in classes:
            if 0 <= cls_id < len(CLASS_NAMES):
                predictions.append(int(CLASS_NAMES[cls_id]))

        if vis_output:
            res_plotted = r.plot()
            cv2.imwrite(vis_output, res_plotted)

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(predictions, f, indent=2, ensure_ascii=False)

    return output_file, vis_output, dt

