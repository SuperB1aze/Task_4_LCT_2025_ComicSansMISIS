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
MODEL_PATH = os.path.join(BASE_DIR, "ML", "best-5.pt")
MEDIA_DIR = os.path.join(BASE_DIR, "media")


os.makedirs(MEDIA_DIR, exist_ok=True)

model = None

# 2. Классы модели (в том порядке, в каком они в data.yaml)
CLASS_NAMES = [
    "Отвертка «-»",                     # '1'
    "Ключ рожковый/накидной 3⁄4",       # '10'
    "Бокорезы",                         # '11'
    "Отвертка «+»",                     # '2'
    "Отвертка на смещенный крест",      # '3'
    "Коловорот",                        # '4'
    "Пассатижи контровочные",           # '5'
    "Пассатижи",                        # '6'
    "Шэрница",                          # '7'
    "Разводной ключ",                   # '8'
    "Открывашка для банок с маслом"     # '9'
]

# 3) Пороги по классам
class_thresholds = {cls: 0.766 for cls in CLASS_NAMES}


def _get_model():
    """Ленивая загрузка модели"""
    global model
    if model is None:
        model = YOLO(MODEL_PATH)
        model.to(DEVICE)
        try:
            model.fuse()
        except Exception:
            pass
    return model


def run_inference(
    image_input,
    thresholds=None,
    output_file=None,
    vis_output=None,
    model_conf=0.766,
    iou=0.7,
    imgsz=832,
    max_det=200,
    device=DEVICE
):
    if thresholds is None:
        thresholds = class_thresholds
    
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

        xyxy = boxes.xyxy
        scores = boxes.conf
        classes = boxes.cls

        if hasattr(xyxy, "cpu"):
            xyxy = xyxy.cpu().numpy()
            scores = scores.cpu().numpy()
            classes = classes.cpu().numpy().astype(int)

        for i, cls_id in enumerate(classes):
            if cls_id < 0 or cls_id >= len(CLASS_NAMES):
                continue
            cls_name = CLASS_NAMES[cls_id]
            score = float(scores[i])
            if score < thresholds.get(cls_name, 0.3):
                continue
            predictions.append(int(cls_id))

        if vis_output:
            res_plotted = r.plot()
            cv2.imwrite(vis_output, res_plotted)

    # сохраняем в JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(predictions, f, indent=2, ensure_ascii=False)

    return output_file, vis_output, dt

