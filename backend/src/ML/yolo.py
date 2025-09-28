import os
import json
import cv2
import numpy as np
from ultralytics import YOLO

# 1. Загрузка модели
model = YOLO("/Users/glebovmaksim/ЛЦТ/best.pt")   # путь к весам

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


def run_inference(image_path, thresholds=None, output_file="predictions.json", vis_output="vis_result.jpg"):
    if thresholds is None:
        thresholds = class_thresholds

    # инференс
    results = model.predict(image_path, imgsz=640, conf=0.01, verbose=False)

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

            # записываем ТОЛЬКО числовой id
            predictions.append(int(cls_id))

        # === визуализация ===
        res_plotted = r.plot()  # numpy-массив BGR с предсказаниями
        cv2.imwrite(vis_output, res_plotted)

    # сохраняем в JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(predictions, f, indent=2, ensure_ascii=False)

    return output_file, vis_output


# ====== Пример использования ======
if __name__ == "__main__":
    custom_thresholds = {
        "Отвертка «-»": 0.4,
        "Пассатижи": 0.7,
        "Шэрница": 0.6,
        # остальные классы берут дефолт 0.5
    }

    path_to_image = "/Users/glebovmaksim/ЛЦТ/DSCN4981.JPG"  # картинка для теста
    out_json, out_img = run_inference(path_to_image, thresholds=custom_thresholds)
    print(f"Предсказания сохранены в {out_json}")
    print(f"Визуализация сохранена в {out_img}")