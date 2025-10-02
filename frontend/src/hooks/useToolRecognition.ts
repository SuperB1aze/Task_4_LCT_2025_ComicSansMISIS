import { useState, useCallback } from 'react'
import { DetectedTool, RecognitionResult } from '../types'
import { mlService } from '../services/mlService'

export const useToolRecognition = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [detectedTools, setDetectedTools] = useState<DetectedTool[]>([])

  const recognizeTools = useCallback(async (imageFile: File): Promise<DetectedTool[]> => {
    setIsProcessing(true)
    setError(null)
    setRecognitionResult(null)

    try {
      const result = await mlService.recognizeTools(imageFile)
      setRecognitionResult(result)
      setDetectedTools(result.tools)
      return result.tools
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка распознавания инструментов'
      setError(errorMessage)
      console.error('Recognition error:', err)
      return []
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const updateTool = useCallback((toolId: string, updates: Partial<DetectedTool>) => {
    setDetectedTools(prevTools => 
      prevTools.map(tool => 
        tool.id === toolId ? { ...tool, ...updates } : tool
      )
    )
  }, [])

  const removeTool = useCallback((toolId: string) => {
    setDetectedTools(prevTools => 
      prevTools.filter(tool => tool.id !== toolId)
    )
  }, [])

  const addTool = useCallback((tool: Omit<DetectedTool, 'id'>) => {
    const newTool: DetectedTool = {
      ...tool,
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    setDetectedTools(prevTools => [...prevTools, newTool])
  }, [])

  const clearResults = useCallback(() => {
    setRecognitionResult(null)
    setDetectedTools([])
    setError(null)
  }, [])

  const confirmTools = useCallback((tools: DetectedTool[]) => {
    setDetectedTools(tools)
    // Здесь можно добавить логику сохранения в базу данных
    console.log('Подтвержденные инструменты:', tools)
  }, [])

  return {
    // State
    isProcessing,
    recognitionResult,
    error,
    detectedTools,
    
    // Actions
    recognizeTools,
    updateTool,
    removeTool,
    addTool,
    clearResults,
    confirmTools,
    
    // Computed
    hasResults: recognitionResult !== null,
    hasError: error !== null,
    totalTools: detectedTools.length
  }
}
