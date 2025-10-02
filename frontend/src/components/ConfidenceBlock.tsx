import React, { useState } from 'react'
import { Settings, Save, X } from 'lucide-react'

interface ConfidenceBlockProps {
  confidence: number
  onConfidenceChange: (value: number) => Promise<void>
}

export const ConfidenceBlock: React.FC<ConfidenceBlockProps> = ({
  confidence,
  onConfidenceChange
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true)
    setInputValue(confidence.toString())
  }

  const handleCancel = () => {
    setIsEditing(false)
    setInputValue('')
  }

  const handleSave = async () => {
    const value = parseFloat(inputValue)
    
    // Валидация: число от 0 (не включая) до 1
    if (isNaN(value) || value <= 0 || value > 1) {
      alert('Введите число от 0 до 1 (не включая 0)')
      return
    }

    setIsLoading(true)
    try {
      await onConfidenceChange(value)
      setIsEditing(false)
      setInputValue('')
    } catch (error) {
      console.error('Ошибка при изменении уверенности:', error)
      alert('Ошибка при сохранении значения уверенности')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[520px] h-[420px] flex flex-col zoom-in-animation" style={{ animationDelay: '0.3s' }}>
      {/* Header with SVG */}
      <div className="px-6 py-2 flex items-center justify-center flex-shrink-0">
        <object 
          data="/assets/Confidence.svg" 
          type="image/svg+xml"
          width="480" 
          height="170"
          style={{ 
            maxWidth: '100%',
            height: 'auto'
          }}
        >
          <img 
            src="/assets/Confidence.svg" 
            alt="Уверенность модели" 
            width="480" 
            height="170"
          />
        </object>
      </div>
      
      {/* Content */}
      <div className="px-6 pt-0 pb-4 flex flex-col items-center justify-center flex-1 -mt-8">
        <div className="text-center">
          {/* Current confidence value */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-[#262626] mb-2">
              {(confidence * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              Текущая уверенность модели
            </div>
          </div>

          {/* Edit button or input */}
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Settings size={16} />
              <span>Задать значение уверенности</span>
            </button>
          ) : (
            <div className="space-y-4 w-full max-w-xs">
              <div>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="0.5"
                  min="0"
                  max="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <div className="text-xs text-gray-500 mt-1">
                  Введите число от 0 до 1 (например: 0.5)
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Save size={14} />
                  <span>{isLoading ? 'Сохранение...' : 'Сохранить'}</span>
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <X size={14} />
                  <span>Отмена</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
