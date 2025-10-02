import os
import json
import cv2
import numpy as np
import torch
import time
from ultralytics import YOLO


# ======= Настройки ускорения =======
DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"
USE_HALF = torch.cuda.is_available()  # half только на CUDA
if torch.cuda.is_available():
    torch.backends.cudnn.benchmark = True  # быстрее при фиксированном размере

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ML", "best_weights.pt")
MEDIA_DIR = os.path.join(BASE_DIR, "media")


os.makedirs(MEDIA_DIR, exist_ok=True)

model = None


CLASS_NAMES = None


def _get_model():
    """Ленивая загрузка модели"""
    global model, CLASS_NAMES
    if model is None:
        model = YOLO(MODEL_PATH)
        model.to(DEVICE)
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
    device=DEVICE
):
    if output_file is None:
        output_file = os.path.join(MEDIA_DIR, "predictions.json")
    if vis_output is None:
        vis_output = os.path.join(MEDIA_DIR, "vis_result.jpg")

    if isinstance(image_input, str):
        source = image_input
    elif isinstance(image_input, np.ndarray):
        source = image_input
    else:
        raise TypeError("image_input должен быть str или np.ndarray")

    current_model = _get_model()

    # замер времени инференса
    t0 = time.perf_counter()
    results = current_model.predict(
        source=source,
        imgsz=imgsz,
        conf=model_conf,
        iou=iou,
        max_det=max_det,
        device=device,
        half=USE_HALF,
        verbose=False
    )
    dt = (time.perf_counter() - t0) * 1000

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

