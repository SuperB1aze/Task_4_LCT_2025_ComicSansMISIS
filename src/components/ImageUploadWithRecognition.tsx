import { useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { Upload, Camera, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useToolRecognition } from '../hooks/useToolRecognition'
import { RecognitionResultsDialog } from './RecognitionResultsDialog'

interface ImageUploadWithRecognitionProps {
  onToolsDetected?: (tools: any[], confidence?: number) => void
  onScanStart?: () => void
  onFileSelected?: (hasFile: boolean) => void
  onFileRemoved?: () => void
  className?: string
  disabled?: boolean
}

export interface ImageUploadWithRecognitionRef {
  startRecognition: () => Promise<void>
}

export const ImageUploadWithRecognition = forwardRef<ImageUploadWithRecognitionRef, ImageUploadWithRecognitionProps>(({
  onToolsDetected,
  onScanStart,
  onFileSelected,
  onFileRemoved,
  className = '',
  disabled = false
}, ref) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showResultsDialog, setShowResultsDialog] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    isProcessing,
    recognitionResult,
    error,
    detectedTools,
    recognizeTools,
    updateTool,
    removeTool,
    confirmTools,
    clearResults
  } = useToolRecognition()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    }
  }

  const handleFileSelect = (file: File) => {
    console.log('📁 Выбран новый файл:', file.name)
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    clearResults() // Очищаем предыдущие результаты
    onFileSelected?.(true)
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        handleFileSelect(file)
      } else {
        alert('Пожалуйста, выберите изображение')
      }
    }
  }


  // Функция для запуска распознавания извне
  const startRecognition = async () => {
    if (!selectedFile) return

    try {
      console.log('🚀 Начинаем распознавание...')
      console.log('🧹 Очищаем предыдущие результаты в компоненте...')
      clearResults() // Очищаем результаты в компоненте
      onScanStart?.()
      const tools = await recognizeTools(selectedFile)
      console.log('🔍 Результаты распознавания:', tools)
      // Автоматически передаем результаты в родительский компонент
      if (tools.length > 0) {
        const avgConfidence = tools.reduce((sum, tool) => sum + tool.confidence, 0) / tools.length
        console.log('✅ Передаем инструменты в родительский компонент:', tools, 'Уверенность:', avgConfidence)
        console.log('🔢 Количество инструментов для передачи:', tools.length)
        onToolsDetected?.(tools, avgConfidence)
      } else {
        console.log('❌ Инструменты не найдены')
      }
      // Убираем показ диалога результатов
    } catch (err) {
      console.error('Ошибка распознавания:', err)
    }
  }

  // Экспортируем функцию через ref
  useImperativeHandle(ref, () => ({
    startRecognition
  }))

  const handleConfirmTools = (tools: any[]) => {
    confirmTools(tools)
    setShowResultsDialog(false)
    onToolsDetected?.(tools)
  }

  const handleRetakePhoto = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    clearResults()
    onFileSelected?.(false)
    fileInputRef.current?.click()
  }

  const handleRemovePhoto = () => {
    console.log('🗑️ Удаляем загруженное фото...')
    setSelectedFile(null)
    setPreviewUrl(null)
    clearResults()
    onFileSelected?.(false)
    onFileRemoved?.() // Уведомляем родительский компонент об удалении файла
  }

  const getStatusIcon = () => {
    if (isProcessing) return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    if (error) return <AlertCircle className="w-8 h-8 text-red-500" />
    if (detectedTools.length > 0) return <CheckCircle className="w-8 h-8 text-green-500" />
    return <Upload className="w-8 h-8 text-gray-400" />
  }

  const getStatusText = () => {
    if (isProcessing) return 'Обрабатываем изображение...'
    if (error) return 'Ошибка распознавания'
    if (detectedTools.length > 0) return `Найдено ${detectedTools.length} инструментов`
    if (isDragOver) return 'Отпустите файл здесь'
    return 'Перетащите фото сюда'
  }

  const getSubText = () => {
    if (isProcessing) return 'Пожалуйста, подождите'
    if (error) return 'Попробуйте другое изображение'
    if (detectedTools.length > 0) return 'Нажмите для просмотра результатов'
    return 'или нажмите для выбора файла'
  }

  return (
    <>
      <div className={`w-full ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div
          className={`cursor-pointer flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg transition-all duration-200 ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : error
              ? 'border-red-300 bg-red-50'
              : detectedTools.length > 0
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-blue-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {getStatusIcon()}
          
          <div className="text-center">
            <p className={`text-lg font-medium mb-2 ${
              error ? 'text-red-700' : 
              detectedTools.length > 0 ? 'text-green-700' : 
              'text-gray-700'
            }`}>
              {getStatusText()}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {getSubText()}
            </p>
            {selectedFile && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-blue-600 font-medium">
                  Выбран: {selectedFile.name}
                </p>
                <button
                  onClick={handleRemovePhoto}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  title="Удалить фото"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Область кнопок - всегда видна */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {/* Preview */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Предварительный просмотр"
              className="max-w-32 max-h-24 rounded-lg object-cover shadow-sm border"
            />
          )}
          
          {/* Область кнопок с фиксированной высотой */}
          <div className="flex gap-2 flex-wrap justify-center min-h-[60px] items-center">
            {/* Кнопка выбора файла - всегда видна когда не обрабатывается */}
            {!isProcessing && !detectedTools.length && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2 shadow-lg"
              >
                <Camera className="w-5 h-5" />
                {selectedFile ? 'Выбрать другое фото' : 'Выбрать фото'}
              </button>
            )}
            
            {/* Кнопка просмотра результатов - когда есть результаты */}
            {detectedTools.length > 0 && (
              <button
                onClick={() => setShowResultsDialog(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                <CheckCircle className="w-5 h-5" />
                Просмотреть результаты
              </button>
            )}
            
            {/* Кнопки когда есть файл */}
            {selectedFile && !isProcessing && (
              <div className="flex gap-2">
                <button
                  onClick={handleRetakePhoto}
                  disabled={isProcessing}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 disabled:bg-gray-50 transition-colors"
                >
                  Выбрать другое фото
                </button>
                <button
                  onClick={handleRemovePhoto}
                  disabled={isProcessing}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm hover:bg-red-200 disabled:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Удалить фото
                </button>
              </div>
            )}
          </div>
        </div>
        

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Dialog */}
      <RecognitionResultsDialog
        isOpen={showResultsDialog}
        onClose={() => setShowResultsDialog(false)}
        result={recognitionResult}
        onConfirmTools={handleConfirmTools}
        onEditTool={updateTool}
        onRemoveTool={removeTool}
      />
    </>
  )
})
