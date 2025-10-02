import { DetectedTool, RecognitionResult, ModelConfig, MLDetection } from '../types'

class MLService {
  // @ts-ignore
  private _model: any = null
  private config: ModelConfig = {
    modelPath: '/models/tool-recognition-model.json',
    confidenceThreshold: 0.5,
    maxDetections: 20,
    inputSize: { width: 640, height: 640 }
  }

  private apiBaseUrl = this.getApiBaseUrl() // URL упрощенного backend'а

  private isModelLoaded = false
  private loadingPromise: Promise<void> | null = null

  /**
   * Определение базового URL для API в зависимости от окружения
   */
  private getApiBaseUrl(): string {
    // Проверяем, находимся ли мы в браузере
    if (typeof window === 'undefined') {
      return 'http://localhost:8000' // fallback для SSR
    }

    // В production (не localhost) - нужно будет заменить на ваш deployed backend URL
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // TODO: Замените на URL вашего deployed backend
      // Например: 'https://your-backend-url.herokuapp.com'
      // Или используйте переменную окружения VITE_API_BASE_URL
      const envUrl = (import.meta as any).env?.VITE_API_BASE_URL
      if (envUrl) {
        return envUrl
      }
      
      // Production backend URL
      console.log('🌐 Используется production backend')
      return 'https://task-4-lct-2025-comicsansmisis.onrender.com'
    }
    
    // Для development используем localhost
    return 'http://localhost:8000'
  }

  /**
   * Инициализация модели машинного обучения
   */
  async initializeModel(): Promise<void> {
    if (this.isModelLoaded) return
    if (this.loadingPromise) return this.loadingPromise

    this.loadingPromise = this.loadModel()
    await this.loadingPromise
  }

  private async loadModel(): Promise<void> {
    try {
      // Здесь должна быть логика загрузки вашей обученной модели
      // Это может быть TensorFlow.js, ONNX.js, или другой формат
      
      // Для демонстрации создаем заглушку
      console.log('Загружаем модель распознавания инструментов...')
      
      // В реальном проекте здесь будет:
      // this.model = await tf.loadLayersModel(this.config.modelPath)
      // или
      // this.model = await ort.InferenceSession.create(this.config.modelPath)
      
      // Заглушка для демонстрации
      this._model = {
        predict: this.mockPrediction.bind(this)
      }
      
      this.isModelLoaded = true
      console.log('Модель успешно загружена')
    } catch (error) {
      console.error('Ошибка загрузки модели:', error)
      throw new Error('Не удалось загрузить модель распознавания')
    }
  }

  /**
   * Предобработка изображения для модели
   */
  // @ts-ignore
  private _preprocessImage(imageFile: File): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Не удалось получить контекст canvas'))
        return
      }

      img.onload = () => {
        // Изменяем размер изображения под требования модели
        canvas.width = this.config.inputSize.width
        canvas.height = this.config.inputSize.height

        // Рисуем изображение с измененным размером
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas)
      }

      img.onerror = () => reject(new Error('Ошибка загрузки изображения'))
      img.src = URL.createObjectURL(imageFile)
    })
  }

  /**
   * Распознавание инструментов на изображении
   */
  async recognizeTools(imageFile: File, toolkitId: number = 1, confidence: number = 0.1): Promise<RecognitionResult> {
    const startTime = performance.now()
    
    try {
      // Отправляем изображение на backend для распознавания
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('toolkit_id', toolkitId.toString())
      formData.append('confidence', confidence.toString())
      
      const response = await fetch(`${this.apiBaseUrl}/predict/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const data = await response.json()
      
      // Преобразуем ответ от backend в наш формат
      const tools = this.transformBackendResponse(data)
      
      const processingTime = performance.now() - startTime
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        tools,
        processingTime,
        imageId,
        timestamp: new Date(),
        totalDetections: tools.length,
        processedImageUrl: data.processed_image_url,
        handCheck: data.hand_check
      }
    } catch (error) {
      console.error('Ошибка распознавания:', error)
      throw new Error('Не удалось распознать инструменты на изображении')
    }
  }

  /**
   * Преобразование ответа от backend в наш формат
   */
  private transformBackendResponse(data: any): DetectedTool[] {
    // Преобразуем ответ от вашего FastAPI backend'а
    if (data.found_tools && Array.isArray(data.found_tools)) {
      return data.found_tools.map((tool: any, index: number) => ({
        id: `tool_${tool.id}_${index}`,
        name: tool.name,
        confidence: 0.8, // Поскольку backend не возвращает confidence, используем дефолтное значение
        quantity: 1,
        category: tool.category,
        serialNumber: tool.serial_number
      }))
    }
    
    // Fallback для других форматов ответа
    return []
  }

  /**
   * Постобработка результатов детекции (для локальной модели)
   */
  // @ts-ignore
  private _postprocessDetections(detections: MLDetection[]): DetectedTool[] {
    return detections
      .filter(detection => detection.confidence >= this.config.confidenceThreshold)
      .slice(0, this.config.maxDetections)
      .map((detection, index) => ({
        id: `tool_${Date.now()}_${index}`,
        name: this.getToolName(detection.category),
        confidence: Math.round(detection.confidence * 100) / 100,
        quantity: 1, // По умолчанию 1, можно улучшить логику подсчета
        boundingBox: detection.boundingBox,
        category: detection.category,
        condition: detection.condition
      }))
  }

  /**
   * Получение читаемого названия инструмента по категории
   */
  private getToolName(category: string): string {
    const toolNames: Record<string, string> = {
      'screwdriver_cross': 'Отвертка крестовая',
      'screwdriver_flat': 'Отвертка плоская',
      'pliers': 'Плоскогубцы',
      'hammer': 'Молоток',
      'wrench': 'Ключ гаечный',
      'cutters': 'Клещи',
      'tape_measure': 'Рулетка',
      'level': 'Уровень',
      'saw': 'Ножовка',
      'drill': 'Дрель',
      'screwdriver_electric': 'Шуруповерт',
      'vice_grips': 'Пассатижи',
      'adjustable_wrench': 'Разводной ключ',
      'socket_wrench': 'Головка',
      'torque_wrench': 'Динамический ключ',
      'allen_key': 'Шестигранный ключ',
      'chisel': 'Стамеска',
      'file': 'Напильник',
      'clamp': 'Струбцина',
      'spatula': 'Шпатель'
    }

    return toolNames[category] || category
  }

  /**
   * Заглушка для демонстрации (замените на реальную модель)
   */
  private async mockPrediction(_canvas: HTMLCanvasElement): Promise<MLDetection[]> {
    // Имитация времени обработки
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Генерируем случайные детекции для демонстрации
    const mockDetections: MLDetection[] = []
    const toolCategories = [
      'screwdriver_cross', 'pliers', 'hammer', 'wrench', 
      'cutters', 'tape_measure', 'level', 'saw'
    ]

    const numDetections = Math.floor(Math.random() * 5) + 1

    for (let i = 0; i < numDetections; i++) {
      const category = toolCategories[Math.floor(Math.random() * toolCategories.length)]
      const confidence = 0.6 + Math.random() * 0.4 // 0.6-1.0
      
      mockDetections.push({
        toolId: `mock_${i}`,
        confidence,
        boundingBox: {
          x: Math.random() * 0.7,
          y: Math.random() * 0.7,
          width: 0.1 + Math.random() * 0.2,
          height: 0.1 + Math.random() * 0.2
        },
        category,
        condition: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)] as any
      })
    }

    return mockDetections
  }

  /**
   * Обновление конфигурации модели
   */
  updateConfig(newConfig: Partial<ModelConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Получение текущей конфигурации
   */
  getConfig(): ModelConfig {
    return { ...this.config }
  }

  /**
   * Проверка статуса загрузки модели
   */
  isReady(): boolean {
    return this.isModelLoaded
  }
}

// Экспортируем singleton instance
export const mlService = new MLService()
export default mlService
