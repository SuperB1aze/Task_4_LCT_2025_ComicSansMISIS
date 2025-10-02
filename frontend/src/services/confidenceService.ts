const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000'

export interface ConfidenceResponse {
  success: boolean
  confidence: number
  message?: string
}

export const confidenceService = {
  // Получить текущее значение уверенности модели
  async getConfidence(): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/confidence`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.confidence || 0.5 // По умолчанию 0.5
    } catch (error) {
      console.error('Ошибка при получении уверенности:', error)
      return 0.5 // Возвращаем значение по умолчанию при ошибке
    }
  },

  // Установить новое значение уверенности модели
  async setConfidence(confidence: number): Promise<ConfidenceResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/confidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confidence: confidence
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Ошибка при установке уверенности:', error)
      throw new Error('Не удалось установить значение уверенности')
    }
  }
}
