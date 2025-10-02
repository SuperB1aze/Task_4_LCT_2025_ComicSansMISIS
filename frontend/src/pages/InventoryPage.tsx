import React, { useState, useRef } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { ImageUploadWithRecognition, ImageUploadWithRecognitionRef } from '../components/ImageUploadWithRecognition'
import { AddToolModal } from '../components/AddToolModal'
import { IssuanceResultsDialog } from '../components/IssuanceResultsDialog'
import { ConfidenceBlock } from '../components/ConfidenceBlock'
import { DetectedTool } from '../types'
import { useToolRecognition } from '../hooks/useToolRecognition'
import { useConfidence } from '../hooks/useConfidence'
import { useIssuanceStore } from '../store/issuanceStore'
import { issuanceService, IssuanceResult } from '../services/issuanceService'

// Компонент круговой диаграммы
const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 50
  const strokeWidth = 10
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-24 h-24">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Прогресс круг с градиентом */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0046E2" />
          </linearGradient>
        </defs>
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="drop-shadow-lg"
        />
      </svg>
      {/* Процент в центре */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-lg font-bold text-[#262626] leading-none ml-2.5 mt-1"
          style={{ 
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  )
}

export const InventoryPage = () => {
  const [searchCode, setSearchCode] = useState('')
  const [detectedTools, setDetectedTools] = useState<DetectedTool[]>([])
  const [matchPercentage, setMatchPercentage] = useState(0) // Начальное значение 0%
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, fileName: string}>>([])
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false)
  const [issuanceResult, setIssuanceResult] = useState<IssuanceResult | null>(null)
  const [showIssuanceDialog, setShowIssuanceDialog] = useState(false)
  const [imageMLResults, setImageMLResults] = useState<Array<{fileName: string, result: IssuanceResult}>>([])
  const imageUploadRef = useRef<ImageUploadWithRecognitionRef>(null)

  const {
    recognizeTools
  } = useToolRecognition()

  const { confidence, updateConfidence } = useConfidence()

  const { showResultsDialog, setShowResultsDialog } = useIssuanceStore()

  // Принудительная очистка при загрузке страницы
  React.useEffect(() => {
    console.log('🔄 Страница выдачи загружена, очищаем все данные...')
    setDetectedTools([])
    setMatchPercentage(0)
    setScanComplete(false)
    setIsScanning(false)
    setUploadedImages([])
    setIssuanceResult(null) // Очищаем результат ML обработки
    setShowIssuanceDialog(false) // Скрываем диалог результатов
    setShowResultsDialog(false) // Сбрасываем флаг показа диалога
    setImageMLResults([]) // Очищаем результаты ML для каждого изображения
  }, [])

  // Обновляем процент совпадения на основе найденных инструментов
  const updateMatchPercentage = (tools: DetectedTool[]) => {
    if (tools.length === 0) {
      setMatchPercentage(0)
    } else {
      // Простая логика: чем больше инструментов найдено, тем выше процент
      const basePercentage = Math.min(70 + (tools.length * 5), 98)
      setMatchPercentage(basePercentage)
    }
  }

  // Обработка завершения сканирования
  // Обработка завершения сканирования (только показывает диалог)
  const handleScanComplete = async () => {
    if (uploadedImages.length === 0) {
      console.log('❌ Нет загруженных изображений')
      return
    }
    
    console.log('🚀 Завершаем сканирование и показываем результаты...')
    
    try {
      // Создаем IssuanceResult из уже собранных данных ML
      const allFoundTools = imageMLResults.flatMap(img => img.result.found_tools)
      const lastProcessedImageUrl = imageMLResults.length > 0 ? imageMLResults[imageMLResults.length - 1].result.processed_image_url : undefined
      
      const issuanceResult: IssuanceResult = {
        found_tools: allFoundTools,
        hand_check: allFoundTools.length !== 11,
        processed_image_url: lastProcessedImageUrl,
        ml_predictions: allFoundTools.map(() => Math.random())
      }
      
      console.log('🔍 DEBUG: Созданный IssuanceResult:', issuanceResult);
      console.log('🔍 DEBUG: Найденные инструменты с ID:', issuanceResult.found_tools.map(t => ({ id: t.id, name: t.name })));
      
      setIssuanceResult(issuanceResult)
      
      // Показываем диалог результатов
      setShowIssuanceDialog(true)
      setShowResultsDialog(true)
      
    } catch (error) {
      console.error('❌ Ошибка при завершении сканирования:', error)
    }
  }

  // Обработка начала сканирования
  const handleStartScan = () => {
    setIsScanning(true)
    setScanComplete(false)
    console.log('Начато сканирование...')
  }

  // Обработка добавления инструмента вручную
  const handleAddManual = () => {
    console.log('Добавление инструмента вручную...')
    setIsAddToolModalOpen(true)
  }

  // Обработка добавления инструмента из модального окна
  const handleAddTool = (toolName: string, quantity: number) => {
    console.log('Добавляем инструмент:', toolName, 'количество:', quantity)
    
    // Создаем новый инструмент
    const newTool: DetectedTool = {
      id: `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: toolName,
      confidence: 1.0, // 100% уверенность для ручного добавления
      quantity: quantity,
      category: toolName,
      condition: 'good' // По умолчанию хорошее состояние
    }
    
    // Добавляем к существующим инструментам
    setDetectedTools(prev => [...prev, newTool])
    updateMatchPercentage([...detectedTools, newTool]) // Обновляем процент совпадения
    setScanComplete(true) // Помечаем как завершенное сканирование
  }

  // Обработка удаления фотографии
  const handleFileRemoved = () => {
    console.log('🗑️ Фото удалено, сбрасываем состояние...')
    setDetectedTools([]) // Обнуляем список инструментов
    setMatchPercentage(0) // Сбрасываем процент совпадения
    setScanComplete(false) // Сбрасываем статус завершения сканирования
    setIsScanning(false) // Сбрасываем статус сканирования
    setUploadedImages([]) // Очищаем список загруженных изображений
    setIssuanceResult(null) // Очищаем результат ML обработки
    setShowIssuanceDialog(false) // Скрываем диалог результатов
    setShowResultsDialog(false) // Сбрасываем флаг показа диалога
    setImageMLResults([]) // Очищаем результаты ML для каждого изображения
  }

  // Обработка добавления изображения
  const handleImageAdded = async (imageUrl: string, fileName: string) => {
    console.log('📸 Добавлено изображение:', fileName)
    setUploadedImages(prev => [...prev, { url: imageUrl, fileName }])
    
    // Скрываем диалог при добавлении нового изображения
    setShowIssuanceDialog(false)
    setShowResultsDialog(false)
    
    // Сразу запускаем ML анализ для нового изображения
    try {
      console.log(`🔍 Запускаем мгновенный ML анализ для: ${fileName}`)
      
      // Создаем File объект из URL
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const file = new File([blob], fileName, { type: blob.type })
      
      // Используем ML сервис для распознавания
      const mlResult = await issuanceService.recognizeTools(file, 1, 0.5)
      console.log(`✅ Мгновенный ML результат для ${fileName}:`, mlResult)
      
      // Обновляем результаты ML для изображений
      setImageMLResults(prev => [...prev, {
        fileName: fileName,
        result: mlResult
      }])
      
      // Преобразуем найденные инструменты в формат DetectedTool
      const newDetectedTools = mlResult.found_tools.map(tool => ({
        id: `instant_${tool.id}_${Date.now()}`,
        name: tool.name,
        confidence: 0.95,
        quantity: 1,
        category: tool.category,
        condition: 'good' as const,
        serialNumber: tool.serial_number
      }))
      
      // Обновляем список инструментов и процент совпадения
      setDetectedTools(prev => {
        const updatedTools = [...prev, ...newDetectedTools]
        updateMatchPercentage(updatedTools)
        return updatedTools
      })
      
      // Помечаем как завершенное сканирование
      setScanComplete(true)
      
      console.log(`🎯 Добавлено ${newDetectedTools.length} инструментов из ${fileName}`)
      
    } catch (error) {
      console.error(`❌ Ошибка при мгновенном ML анализе для ${fileName}:`, error)
    }
  }

  // Обработка удаления изображения
  const handleImageRemove = (index: number) => {
    console.log('🗑️ Удаляем изображение:', index)
    console.log('📊 Текущий список изображений:', uploadedImages)
    
    const imageToRemove = uploadedImages[index]
    
    setUploadedImages(prev => {
      const newList = prev.filter((_, i) => i !== index)
      console.log('📊 Новый список изображений:', newList)
      
      // Если удалили все изображения, сбрасываем состояние сканирования
      if (newList.length === 0) {
        setDetectedTools([])
        setMatchPercentage(0)
        setScanComplete(false)
        setIsScanning(false)
        setIssuanceResult(null) // Очищаем результат ML обработки
        setShowIssuanceDialog(false) // Скрываем диалог результатов
        setShowResultsDialog(false) // Сбрасываем флаг показа диалога
        setImageMLResults([]) // Очищаем результаты ML для каждого изображения
      } else {
        // Если удалили одно изображение, обновляем результаты ML
        setImageMLResults(prev => {
          const newImageResults = prev.filter(img => img.fileName !== imageToRemove.fileName)
          
          // Пересчитываем общий список инструментов
          const remainingFoundTools = newImageResults.flatMap(img => img.result.found_tools)
          const remainingDetectedTools = remainingFoundTools.map((tool, toolIndex) => ({
            id: `remaining_${tool.id}_${toolIndex}`,
            name: tool.name,
            confidence: 0.95,
            quantity: 1,
            category: tool.category,
            condition: 'good' as const,
            serialNumber: tool.serial_number
          }))
          
          // Обновляем состояние
          setDetectedTools(remainingDetectedTools)
          updateMatchPercentage(remainingDetectedTools)
          
          // Обновляем IssuanceResult
          if (remainingFoundTools.length > 0) {
            const updatedIssuanceResult: IssuanceResult = {
              found_tools: remainingFoundTools,
              hand_check: remainingFoundTools.length !== 11,
              processed_image_url: newImageResults.length > 0 ? newImageResults[newImageResults.length - 1].result.processed_image_url : undefined,
              ml_predictions: remainingFoundTools.map(() => Math.random())
            }
            setIssuanceResult(updatedIssuanceResult)
          } else {
            setIssuanceResult(null)
            setScanComplete(false)
          }
          
          return newImageResults
        })
      }
      
      return newList
    })
  }

  // Обработка удаления инструмента из списка
  const handleToolRemove = (toolId: string) => {
    console.log('🗑️ Удаляем инструмент:', toolId)
    setDetectedTools(prev => {
      const newList = prev.filter(tool => tool.id !== toolId)
      console.log('📊 Новый список инструментов:', newList)
      
      // Если удалили все инструменты, сбрасываем состояние сканирования
      if (newList.length === 0) {
        setMatchPercentage(0)
        setScanComplete(false)
      } else {
        // Обновляем процент совпадения
        updateMatchPercentage(newList)
      }
      
      return newList
    })
  }

  // Обработка закрытия диалога результатов
  const handleIssuanceDialogClose = () => {
    setShowIssuanceDialog(false)
    setShowResultsDialog(false)
  }

  // Обработка подтверждения выдачи
  const handleIssuanceConfirm = () => {
    console.log('✅ Подтверждена выдача инструментов')
    setShowIssuanceDialog(false)
    setShowResultsDialog(false)
    // Здесь можно добавить логику сохранения результатов в базу данных
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-[52px] font-semibold text-[#262626] leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Выдача<br />инструментов
          </h1>
        </div>

        {/* Cards */}
        <div className="flex justify-center mb-8 mt-28">
          <div className="flex gap-8">
            {/* Загрузить изображение Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[520px] h-[420px] flex flex-col zoom-in-animation" style={{ animationDelay: '0.1s' }}>
              <div className="px-6 pt-1 pb-0.5 flex items-center justify-center flex-shrink-0">
                <object 
                  data="/assets/loadphoto.svg" 
                  type="image/svg+xml"
                  width="480" 
                  height="170"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                >
                  <img 
                    src="/assets/loadphoto.svg" 
                    alt="Сканирование" 
                    width="480" 
                    height="170"
                  />
                </object>
              </div>
              
              {/* File Upload Area с распознаванием */}
              <div className="px-6 pt-0 pb-4 flex flex-col items-center flex-1">
                <div className="w-full max-w-lg flex flex-col items-center">
                  <ImageUploadWithRecognition
                    ref={imageUploadRef}
                    onToolsDetected={(tools, confidence) => {
                      console.log('📥 Получены инструменты в InventoryPage:', tools, 'Уверенность:', confidence)
                      console.log('📊 Количество инструментов:', tools.length)
                      console.log('🔍 Детали инструментов:', tools.map(t => ({ name: t.name, id: t.id })))
                      setDetectedTools(tools)
                      if (confidence) {
                        setMatchPercentage(Math.round(confidence * 100))
                      } else {
                        updateMatchPercentage(tools)
                      }
                      setScanComplete(true)
                      setIsScanning(false) // Сбрасываем статус сканирования
                    }}
                    onScanStart={handleStartScan}
                    onScanError={(error) => {
                      console.error('❌ Ошибка сканирования:', error)
                      setIsScanning(false) // Сбрасываем статус сканирования при ошибке
                      setScanComplete(false)
                    }}
                    onFileRemoved={handleFileRemoved}
                    onImageAdded={handleImageAdded}
                    className="w-[420px] h-40"
                  />
                </div>
              </div>
            </div>

            {/* Список найденных инструментов */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[520px] min-h-[420px] flex flex-col zoom-in-animation transition-all duration-700 ease-out" style={{ animationDelay: '0.2s' }}>
              <div className="px-6 py-2 flex items-center justify-center">
                <object 
                  data="/assets/instruments_list.svg" 
                  type="image/svg+xml"
                  width="480" 
                  height="170"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                >
                  <img 
                    src="/assets/instruments_list.svg" 
                    alt="Список инструментов" 
                    width="480" 
                    height="170"
                  />
                </object>
              </div>
              
              <div className="px-6 pt-0 pb-4 flex-1 -mt-8 flex flex-col justify-between">
                {/* Миниатюры загруженных изображений */}
                {uploadedImages.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Загруженные изображения:</h3>
                    <div className="flex gap-2 flex-wrap">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.url}
                            alt={image.fileName}
                            className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleImageRemove(index)
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all duration-200 opacity-70 hover:opacity-100 z-10"
                            title="Удалить изображение"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {image.fileName.length > 10 ? image.fileName.substring(0, 10) + '...' : image.fileName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Счетчик найденных инструментов */}
                {detectedTools.length > 0 && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in-up">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">
                        Найдено инструментов:
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        {detectedTools.reduce((total, tool) => total + tool.quantity, 0)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className={`space-y-1 overflow-y-auto ${uploadedImages.length > 0 ? 'max-h-40' : 'max-h-48'}`}>
                  {detectedTools.length > 0 ? (
                    <div className="animate-slide-down">
                      {detectedTools.map((tool, index) => (
                        <div 
                          key={tool.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-fade-in-up group"
                          style={{ 
                            animationDelay: `${index * 0.1}s`,
                            animationFillMode: 'both'
                          }}
                        >
                          <div className="flex flex-col flex-1">
                            <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                            {tool.serialNumber && (
                              <span className="text-xs text-gray-500">№ {tool.serialNumber}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{tool.quantity} шт.</span>
                            <button
                              onClick={() => handleToolRemove(tool.id)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-colors duration-200 p-1 hover:bg-red-50 rounded"
                              title="Удалить инструмент"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">Загрузите изображение для распознавания инструментов</p>
                    </div>
                  )}
                </div>
                
                {/* Buttons */}
                <div className="space-y-2 mt-auto">
                  {/* Кнопка добавления инструмента */}
                  <button
                    onClick={handleAddManual}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Добавить инструмент вручную</span>
                  </button>
                  
                  {/* Кнопка завершения сканирования */}
                  <button 
                    onClick={handleScanComplete}
                    disabled={uploadedImages.length === 0 || isScanning}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Check size={16} />
                    <span>
                      {isScanning ? `Сканирование... (${uploadedImages.length} изображений)` : 
                       scanComplete ? 'Завершить обслуживание' : 
                       `Завершить сканирование (${uploadedImages.length} изображений)`}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Confidence Block */}
            <ConfidenceBlock 
              confidence={confidence}
              onConfidenceChange={updateConfidence}
            />
          </div>
        </div>

        {/* Modal для добавления инструмента */}
        <AddToolModal
          isOpen={isAddToolModalOpen}
          onClose={() => setIsAddToolModalOpen(false)}
          onAddTool={handleAddTool}
        />

        {/* Диалог результатов выдачи инструментов */}
        {showIssuanceDialog && issuanceResult && (
          <IssuanceResultsDialog
            result={issuanceResult}
            onClose={handleIssuanceDialogClose}
            onConfirm={handleIssuanceConfirm}
            currentStep={3}
            totalSteps={3}
            photoFileName={uploadedImages[0]?.fileName || 'DSCN4946.JPG'}
            uploadedImages={uploadedImages}
            imageMLResults={imageMLResults}
          />
        )}

      </div>
    </div>
  )
}
