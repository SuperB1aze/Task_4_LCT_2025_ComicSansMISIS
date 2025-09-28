import os
import json
import cv2
import numpy as np
from ultralytics import YOLO


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ML", "best.pt")
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

# 3. Backend может передать конфиденсы на каждый класс
class_thresholds = {cls: 0.5 for cls in CLASS_NAMES}  # дефолт = 0.5


def _get_model():
    """Ленивая загрузка модели"""
    global model
    if model is None:
        model = YOLO(MODEL_PATH)
    return model


def run_inference(image_path, thresholds=None, output_file=None, vis_output=None):
    if thresholds is None:
        thresholds = class_thresholds
    
    if output_file is None:
        output_file = os.path.join(MEDIA_DIR, "predictions.json")
    if vis_output is None:
        vis_output = os.path.join(MEDIA_DIR, "vis_result.jpg")

    current_model = _get_model()

    # инференс
    results = current_model.predict(image_path, imgsz=640, conf=0.01, verbose=False)

    predictions = []
    for r in results:
        boxes = r.boxes.xyxy.cpu().numpy()
        scores = r.boxes.conf.cpu().numpy()
        classes = r.boxes.cls.cpu().numpy().astype(int)
        masks = r.masks.data.cpu().numpy() if r.masks is not None else None

        for i, cls_id in enumerate(classes):
            cls_name = CLASS_NAMES[cls_id]
            score = float(scores[i])

            # кастомный порог на класс
            if score < thresholds.get(cls_name, 0.5):
                continue

            predictions.append(int(cls_id))

        # === визуализация ===
        res_plotted = r.plot()  # numpy-массив BGR с предсказаниями
        cv2.imwrite(vis_output, res_plotted)

    # сохраняем в JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(predictions, f, indent=2, ensure_ascii=False)

    return output_file, vis_output

