import React, { useState, useRef } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { ImageUploadWithRecognition, ImageUploadWithRecognitionRef } from '../components/ImageUploadWithRecognition'
import { AddToolModal } from '../components/AddToolModal'
import { DetectedTool } from '../types'
import { useToolRecognition } from '../hooks/useToolRecognition'

export const ToolsPage = () => {
  const [detectedTools, setDetectedTools] = useState<DetectedTool[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, fileName: string}>>([])
  const [isAddToolModalOpen, setIsAddToolModalOpen] = useState(false)
  const imageUploadRef = useRef<ImageUploadWithRecognitionRef>(null)

  const {
    recognizeTools
  } = useToolRecognition()

  // Принудительная очистка при загрузке страницы
  React.useEffect(() => {
    console.log('🔄 Страница сдачи загружена, очищаем все данные...')
    setDetectedTools([])
    setScanComplete(false)
    setIsScanning(false)
  }, [])

  // Обработка завершения сканирования
  const handleScanComplete = async () => {
    if (uploadedImages.length === 0) {
      console.log('❌ Нет загруженных изображений')
      return
    }
    
    console.log('🚀 Запускаем распознавание для всех изображений...')
    console.log('📸 Количество изображений для обработки:', uploadedImages.length)
    console.log('🧹 Очищаем предыдущие результаты...')
    setDetectedTools([]) // Очищаем список инструментов
    setScanComplete(false) // Сбрасываем статус завершения
    setIsScanning(true) // Устанавливаем статус сканирования
    
    try {
      const allDetectedTools: DetectedTool[] = []
      
      // Обрабатываем каждое изображение
      for (let i = 0; i < uploadedImages.length; i++) {
        const imageData = uploadedImages[i]
        console.log(`🔍 Обрабатываем изображение ${i + 1}/${uploadedImages.length}: ${imageData.fileName}`)
        
        // Создаем File объект из URL
        const response = await fetch(imageData.url)
        const blob = await response.blob()
        const file = new File([blob], imageData.fileName, { type: blob.type })
        
        // Распознаем инструменты на изображении
        const tools = await recognizeTools(file)
        console.log(`✅ Найдено инструментов на изображении ${i + 1}:`, tools.length)
        
        // Добавляем инструменты к общему списку
        allDetectedTools.push(...tools)
      }
      
      console.log('🎯 Общее количество найденных инструментов:', allDetectedTools.length)
      console.log('📋 Список всех инструментов:', allDetectedTools)
      
      setDetectedTools(allDetectedTools)
      setScanComplete(true)
      setIsScanning(false)
      
    } catch (error) {
      console.error('❌ Ошибка при запуске распознавания:', error)
      setIsScanning(false)
      setScanComplete(false)
    }
  }

  // Обработка начала сканирования
  const handleStartScan = () => {
    setIsScanning(true)
    setScanComplete(false)
    console.log('Начато сканирование для сдачи...')
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
    setScanComplete(true) // Помечаем как завершенное сканирование
  }

  // Обработка удаления фотографии
  const handleFileRemoved = () => {
    console.log('🗑️ Фото удалено, сбрасываем состояние...')
    setDetectedTools([]) // Обнуляем список инструментов
    setScanComplete(false) // Сбрасываем статус завершения сканирования
    setIsScanning(false) // Сбрасываем статус сканирования
    setUploadedImages([]) // Очищаем список загруженных изображений
  }

  // Обработка добавления изображения
  const handleImageAdded = (imageUrl: string, fileName: string) => {
    console.log('📸 Добавлено изображение:', fileName)
    setUploadedImages(prev => [...prev, { url: imageUrl, fileName }])
  }

  // Обработка удаления изображения
  const handleImageRemove = (index: number) => {
    console.log('🗑️ Удаляем изображение:', index)
    console.log('📊 Текущий список изображений:', uploadedImages)
    setUploadedImages(prev => {
      const newList = prev.filter((_, i) => i !== index)
      console.log('📊 Новый список изображений:', newList)
      
      // Если удалили все изображения, сбрасываем состояние сканирования
      if (newList.length === 0) {
        setDetectedTools([])
        setScanComplete(false)
        setIsScanning(false)
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
        setScanComplete(false)
      }
      
      return newList
    })
  }


  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-[52px] font-semibold text-[#262626] leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Сдача<br />инструментов
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
                      console.log('📥 Получены инструменты в ToolsPage:', tools, 'Уверенность:', confidence)
                      console.log('📊 Количество инструментов:', tools.length)
                      console.log('🔍 Детали инструментов:', tools.map(t => ({ name: t.name, id: t.id })))
                      setDetectedTools(tools)
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
                       scanComplete ? 'Сканирование завершено' : 
                       `Завершить сканирование (${uploadedImages.length} изображений)`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal для добавления инструмента */}
        <AddToolModal
          isOpen={isAddToolModalOpen}
          onClose={() => setIsAddToolModalOpen(false)}
          onAddTool={handleAddTool}
        />

      </div>
    </div>
  )
}
