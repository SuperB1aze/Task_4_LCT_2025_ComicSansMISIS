import os
import json
import cv2
import numpy as np
import glob
import time
from ultralytics import YOLO


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ML", "best.pt")
MEDIA_DIR = os.path.join(BASE_DIR, "media")

def cleanup_old_files():
    """Очищает старые временные файлы (старше 1 часа)"""
    try:
        current_time = time.time()
        for pattern in ["predictions_*.json", "vis_result_*.jpg", "temp_*.*"]:
            for file_path in glob.glob(os.path.join(MEDIA_DIR, pattern)):
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > 3600:  # 1 час
                    try:
                        os.remove(file_path)
                        print(f"🗑️ Удален старый файл: {file_path}")
                    except:
                        pass
    except Exception as e:
        print(f"⚠️ Ошибка при очистке старых файлов: {e}")

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
        try:
            # Сначала пытаемся загрузить кастомную модель
            if os.path.exists(MODEL_PATH):
                model = YOLO(MODEL_PATH)
                print(f"✅ Загружена кастомная модель: {MODEL_PATH}")
            else:
                # Если кастомная модель не найдена, используем стандартную YOLO
                print(f"⚠️ Кастомная модель не найдена: {MODEL_PATH}")
                print(f"🔄 Используем стандартную модель YOLO...")
                model = YOLO('yolov8n.pt')  # Автоматически скачивается
                print(f"✅ Загружена стандартная модель YOLO")
                
                # Попытка сохранить стандартную модель как кастомную для будущего использования
                try:
                    model.save(MODEL_PATH)
                    print(f"💾 Стандартная модель сохранена как: {MODEL_PATH}")
                except Exception as save_error:
                    print(f"⚠️ Не удалось сохранить модель: {save_error}")
                    
        except Exception as e:
            print(f"❌ Ошибка загрузки модели: {e}")
            return None
    return model


def run_inference(image_path, thresholds=None, output_file=None, vis_output=None):
    if thresholds is None:
        thresholds = class_thresholds
    
    # Очищаем старые файлы перед обработкой
    cleanup_old_files()
    
    # Генерируем уникальные имена файлов для каждого запроса
    import uuid
    unique_id = str(uuid.uuid4())
    
    if output_file is None:
        output_file = os.path.join(MEDIA_DIR, f"predictions_{unique_id}.json")
    if vis_output is None:
        vis_output = os.path.join(MEDIA_DIR, f"vis_result_{unique_id}.jpg")

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
            # Получаем имя класса из модели или используем наш список
            if cls_id < len(CLASS_NAMES):
                cls_name = CLASS_NAMES[cls_id]
            else:
                # Если используется стандартная модель YOLO, используем её классы
                cls_name = f"class_{cls_id}"
            
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

