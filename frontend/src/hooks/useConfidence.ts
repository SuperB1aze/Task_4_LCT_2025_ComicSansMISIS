import { useState, useEffect } from 'react'
import { confidenceService } from '../services/confidenceService'

export const useConfidence = () => {
  const [confidence, setConfidence] = useState<number>(0.5)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Загружаем текущее значение уверенности при инициализации
  useEffect(() => {
    loadConfidence()
  }, [])

  const loadConfidence = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const currentConfidence = await confidenceService.getConfidence()
      setConfidence(currentConfidence)
    } catch (err) {
      setError('Не удалось загрузить значение уверенности')
      console.error('Ошибка загрузки уверенности:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfidence = async (newConfidence: number): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Валидация на фронтенде
      if (newConfidence <= 0 || newConfidence >= 1) {
        throw new Error('Значение уверенности должно быть от 0 до 1 (не включая границы 0 и 1)')
      }

      const response = await confidenceService.setConfidence(newConfidence)
      
      if (response.success) {
        setConfidence(newConfidence)
      } else {
        throw new Error(response.message || 'Не удалось обновить значение уверенности')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(errorMessage)
      throw err // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setIsLoading(false)
    }
  }

  return {
    confidence,
    isLoading,
    error,
    updateConfidence,
    loadConfidence
  }
}
