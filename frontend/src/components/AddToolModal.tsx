import React, { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'

interface AddToolModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTool: (toolName: string, quantity: number) => void
}

// Список доступных инструментов из датасета
const AVAILABLE_TOOLS = [
  "Отвертка «-»",
  "Ключ рожковый/накидной 3⁄4",
  "Бокорезы",
  "Отвертка «+»",
  "Отвертка на смещенный крест",
  "Коловорот",
  "Пассатижи контровочные",
  "Пассатижи",
  "Шэрница",
  "Разводной ключ",
  "Открывашка для банок с маслом"
]

export const AddToolModal: React.FC<AddToolModalProps> = ({
  isOpen,
  onClose,
  onAddTool
}) => {
  const [selectedTool, setSelectedTool] = useState('')
  const [quantity, setQuantity] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTool && quantity > 0) {
      onAddTool(selectedTool, quantity)
      setSelectedTool('')
      setQuantity(1)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedTool('')
    setQuantity(1)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Добавить инструмент вручную
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Tool Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите инструмент
            </label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Выберите инструмент...</option>
              {AVAILABLE_TOOLS.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Количество
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
