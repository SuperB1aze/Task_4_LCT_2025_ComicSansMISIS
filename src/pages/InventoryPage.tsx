import React, { useState, useRef } from 'react'
import { Check, Plus } from 'lucide-react'
import { ImageUploadWithRecognition, ImageUploadWithRecognitionRef } from '../components/ImageUploadWithRecognition'
import { DetectedTool } from '../types'

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
  const [hasSelectedFile, setHasSelectedFile] = useState(false)
  const imageUploadRef = useRef<ImageUploadWithRecognitionRef>(null)

  // Принудительная очистка при загрузке страницы
  React.useEffect(() => {
    console.log('🔄 Страница загружена, очищаем все данные...')
    setDetectedTools([])
    setMatchPercentage(0)
    setScanComplete(false)
    setIsScanning(false)
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
  const handleScanComplete = async () => {
    if (!imageUploadRef.current) {
      console.log('❌ imageUploadRef не доступен')
      return
    }
    
    console.log('🚀 Запускаем распознавание...')
    console.log('🧹 Очищаем предыдущие результаты...')
    setDetectedTools([]) // Очищаем список инструментов
    setMatchPercentage(0) // Сбрасываем процент совпадения
    setScanComplete(false) // Сбрасываем статус завершения
    
    try {
      await imageUploadRef.current.startRecognition()
    } catch (error) {
      console.error('❌ Ошибка при запуске распознавания:', error)
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
    // Здесь можно добавить модальное окно для добавления инструмента
  }

  // Обработка удаления фотографии
  const handleFileRemoved = () => {
    console.log('🗑️ Фото удалено, сбрасываем состояние...')
    setDetectedTools([]) // Обнуляем список инструментов
    setMatchPercentage(0) // Сбрасываем процент совпадения
    setScanComplete(false) // Сбрасываем статус завершения сканирования
    setIsScanning(false) // Сбрасываем статус сканирования
    setHasSelectedFile(false) // Сбрасываем статус выбранного файла
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
        <div className="flex justify-center mb-8">
          <div className="flex gap-8">
            {/* Совпадения Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[448px] h-[345px] zoom-in-animation" style={{ animationDelay: '0s' }}>
              <div className="px-6 py-2 flex items-center justify-center">
                <object 
                  data="/assets/sovpadenia.svg" 
                  type="image/svg+xml"
                  width="400" 
                  height="89"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                >
                  <img 
                    src="/assets/sovpadenia.svg" 
                    alt="% Совпадения" 
                    width="400" 
                    height="89"
                  />
                </object>
              </div>
              <div className="px-6 py-1">
                <p className="text-gray-600 text-sm mb-2">Введите число</p>
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Текст"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Загрузить изображение Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[448px] h-[345px] flex flex-col zoom-in-animation" style={{ animationDelay: '0.1s' }}>
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
                    }}
                    onScanStart={handleStartScan}
                    onFileSelected={(hasFile) => setHasSelectedFile(hasFile)}
                    onFileRemoved={handleFileRemoved}
                    className="w-[357px] h-32"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Instruments List and Result */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-8">
          {/* Список инструментов */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[448px] h-[345px] flex flex-col zoom-in-animation" style={{ animationDelay: '0.2s' }}>
              <div className="px-6 py-2 flex items-center justify-center">
                <object 
                  data="/assets/instruments_list.svg" 
                  type="image/svg+xml"
                  width="400" 
                  height="89"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                >
                  <img 
                    src="/assets/instruments_list.svg" 
                    alt="Список инструментов" 
                    width="400" 
                    height="89"
                  />
                </object>
              </div>
              <div className="px-6 pt-0 pb-4 flex-1 -mt-8 flex flex-col justify-between">
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {detectedTools.length > 0 ? (
                    detectedTools.map((tool) => (
                      <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                          {tool.serialNumber && (
                            <span className="text-xs text-gray-500">№ {tool.serialNumber}</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{tool.quantity} шт.</span>
                      </div>
                    ))
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
                    disabled={!hasSelectedFile || isScanning}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <Check size={16} />
                    <span>
                      {isScanning ? 'Сканирование...' : 
                       scanComplete ? 'Сканирование завершено' : 
                       'Завершить сканирование'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

          {/* Блок результата */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[448px] h-[345px] flex flex-col zoom-in-animation" style={{ animationDelay: '0.3s' }}>
              {/* Header с result.svg */}
              <div className="px-6 py-2 flex items-center justify-center">
                <object 
                  data="/assets/result.svg" 
                  type="image/svg+xml"
                  width="400" 
                  height="89"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                >
                  <img 
                    src="/assets/result.svg" 
                    alt="Результат" 
                    width="400" 
                    height="89"
                  />
                </object>
              </div>

              {/* Content */}
              <div className="px-6 pt-0 pb-4 flex-1 flex flex-col justify-start">
              <div className="flex items-center justify-between px-2">
                {/* Левая часть - круговая диаграмма */}
                <div className="flex flex-col items-center ml-5">
                  <CircularProgress percentage={matchPercentage} />
                </div>

                {/* Правая часть - подпись "Совпадение" и процент */}
                <div className="flex flex-col items-center mr-5">
                  <h3 className="text-[#262626] mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '24px', fontWeight: 'bold' }}>
                    Совпадение
                  </h3>
                  <div className="text-center">
                    <p className="text-base font-bold text-[#0066FF]">{matchPercentage}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {matchPercentage === 100 ? 'Полное совпадение' : 
                       matchPercentage >= 90 ? 'Высокое совпадение' :
                       matchPercentage >= 70 ? 'Хорошее совпадение' :
                       matchPercentage >= 50 ? 'Среднее совпадение' : 'Низкое совпадение'}
                    </p>
                  </div>
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
