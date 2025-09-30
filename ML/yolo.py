import os
import json
import cv2
import numpy as np
from ultralytics import YOLO


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "best.pt")
MEDIA_DIR = os.path.join(os.path.dirname(BASE_DIR), "media")

# Если media директория не существует, создаем в корне
if not os.path.exists(os.path.dirname(MEDIA_DIR)):
    MEDIA_DIR = os.path.join(os.path.dirname(BASE_DIR), "backend-repo", "backend", "media")


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


def _download_model():
    """Скачивает модель если она отсутствует"""
    if os.path.exists(MODEL_PATH):
        return True
    
    print(f"⚠️ Модель не найдена: {MODEL_PATH}")
    print(f"🔄 Используем стандартную модель YOLO...")
    
    try:
        # Создаем директорию если не существует
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        
        # Используем встроенную модель YOLO (загружается автоматически)
        from ultralytics import YOLO
        model = YOLO('yolov8n.pt')  # Автоматически скачивается
        model.save(MODEL_PATH)  # Сохраняем локально
        print(f"✅ Модель скачана: {MODEL_PATH}")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка загрузки модели: {e}")
        return False

def _get_model():
    """Ленивая загрузка модели"""
    global model
    if model is None:
        # Сначала пытаемся скачать модель если её нет
        if not os.path.exists(MODEL_PATH):
            if not _download_model():
                print(f"⚠️ Не удалось загрузить модель")
                return None
        
        try:
            model = YOLO(MODEL_PATH)
            print(f"✅ Модель загружена: {MODEL_PATH}")
        except Exception as e:
            print(f"❌ Ошибка загрузки модели: {e}")
            return None
    return model


def run_inference(image_path, thresholds=None, output_file=None, vis_output=None):
    if thresholds is None:
        thresholds = class_thresholds
    
    if output_file is None:
        output_file = os.path.join(MEDIA_DIR, "predictions.json")
    if vis_output is None:
        vis_output = os.path.join(MEDIA_DIR, "vis_result.jpg")

    current_model = _get_model()
    
    if current_model is None:
        print("⚠️ Модель недоступна, возвращаем пустые результаты")
        # Создаем пустой JSON файл
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        
        # Создаем копию исходного изображения как визуализацию
        if vis_output and os.path.exists(image_path):
            import shutil
            shutil.copy2(image_path, vis_output)
        
        return output_file, vis_output

    # инференс
    results = current_model.predict(image_path, imgsz=640, conf=0.01, verbose=False)

    predictions = []
    for r in results:
        boxes = r.boxes.xyxy.cpu().numpy()
        scores = r.boxes.conf.cpu().numpy()
        classes = r.boxes.cls.cpu().numpy().astype(int)
        masks = r.masks.data.cpu().numpy() if r.masks is not None else None

        # Собираем все детекции с применением порога
        valid_detections = []
        for i, cls_id in enumerate(classes):
            cls_name = CLASS_NAMES[cls_id]
            score = float(scores[i])

            # кастомный порог на класс
            if score < thresholds.get(cls_name, 0.5):
                continue

            valid_detections.append({
                'class_id': int(cls_id),
                'score': score,
                'box': boxes[i]
            })

        # Сортируем по уверенности (score) в убывающем порядке
        valid_detections.sort(key=lambda x: x['score'], reverse=True)

        # Простая дедупликация: берем только первую (самую уверенную) детекцию каждого класса
        seen_classes = set()
        for det in valid_detections:
            if det['class_id'] not in seen_classes:
                predictions.append(det['class_id'])
                seen_classes.add(det['class_id'])

        # === визуализация ===
        res_plotted = r.plot()  # numpy-массив BGR с предсказаниями
        cv2.imwrite(vis_output, res_plotted)

    # сохраняем в JSON
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(predictions, f, indent=2, ensure_ascii=False)

    return output_file, vis_output

