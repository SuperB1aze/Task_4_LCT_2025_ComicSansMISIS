// Используем localStorage для хранения значения confidence
const CONFIDENCE_STORAGE_KEY = 'model_confidence'

export interface ConfidenceResponse {
  success: boolean
  confidence: number
  message?: string
}

export const confidenceService = {
  // Получить текущее значение уверенности модели
  async getConfidence(): Promise<number> {
    try {
      console.log('🔍 Получаем значение уверенности из localStorage')
      const storedConfidence = localStorage.getItem(CONFIDENCE_STORAGE_KEY)
      
      if (storedConfidence) {
        const confidence = parseFloat(storedConfidence)
        console.log(`📊 Значение уверенности из localStorage: ${confidence} (${confidence * 100}%)`)
        return confidence
      } else {
        console.log('📊 Значение уверенности не найдено, используем значение по умолчанию: 0.5')
        return 0.5 // Значение по умолчанию
      }
    } catch (error) {
      console.error('Ошибка при получении уверенности:', error)
      return 0.5 // Возвращаем значение по умолчанию при ошибке
    }
  },

  // Установить новое значение уверенности модели
  async setConfidence(confidence: number): Promise<ConfidenceResponse> {
    try {
      console.log(`🔄 Устанавливаем новое значение уверенности: ${confidence} (${confidence * 100}%)`)
      
      // Валидация на фронтенде
      if (confidence <= 0 || confidence >= 1) {
        throw new Error('Значение уверенности должно быть от 0 до 1 (не включая границы 0 и 1)')
      }

      // Сохраняем в localStorage
      localStorage.setItem(CONFIDENCE_STORAGE_KEY, confidence.toString())
      console.log('✅ Значение уверенности сохранено в localStorage')
      
      // Симулируем задержку для реалистичности
      await new Promise(resolve => setTimeout(resolve, 100))

      const response: ConfidenceResponse = {
        success: true,
        confidence: confidence,
        message: `Значение уверенности успешно обновлено на ${confidence}`
      }

      console.log('📤 Возвращаем успешный ответ:', response)
      return response
    } catch (error) {
      console.error('Ошибка при установке уверенности:', error)
      throw new Error('Не удалось установить значение уверенности')
    }
  }
}
