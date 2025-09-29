import { useState } from 'react'
import { X, Check, AlertCircle, Clock, Target } from 'lucide-react'
import { DetectedTool, RecognitionResult } from '../types'

interface RecognitionResultsDialogProps {
  isOpen: boolean
  onClose: () => void
  result: RecognitionResult | null
  onConfirmTools: (tools: DetectedTool[]) => void
  onEditTool: (toolId: string, updates: Partial<DetectedTool>) => void
  onRemoveTool: (toolId: string) => void
}

export const RecognitionResultsDialog = ({
  isOpen,
  onClose,
  result,
  onConfirmTools,
  onEditTool,
  onRemoveTool
}: RecognitionResultsDialogProps) => {
  const [editingTool, setEditingTool] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState<number>(1)

  if (!isOpen || !result) return null

  const handleEditStart = (tool: DetectedTool) => {
    setEditingTool(tool.id)
    setEditQuantity(tool.quantity)
  }

  const handleEditSave = (toolId: string) => {
    onEditTool(toolId, { quantity: editQuantity })
    setEditingTool(null)
  }

  const handleEditCancel = () => {
    setEditingTool(null)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50'
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return 'Высокая'
    if (confidence >= 0.7) return 'Средняя'
    return 'Низкая'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Результаты распознавания
              </h2>
              <p className="text-sm text-gray-500">
                Найдено {result.totalDetections} инструментов
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {result.totalDetections}
              </div>
              <div className="text-sm text-gray-600">Найдено инструментов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(result.processingTime)}мс
              </div>
              <div className="text-sm text-gray-600">Время обработки</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Date(result.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-600">Время распознавания</div>
            </div>
          </div>
        </div>

        {/* Tools List */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {result.tools.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Инструменты не найдены</p>
              <p className="text-gray-400 text-sm mt-2">
                Попробуйте загрузить другое изображение
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.tools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Tool Icon */}
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>

                    {/* Tool Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{tool.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(tool.confidence)}`}
                        >
                          {getConfidenceText(tool.confidence)} ({Math.round(tool.confidence * 100)}%)
                        </span>
                      </div>
                      {tool.category && (
                        <p className="text-sm text-gray-500">Категория: {tool.category}</p>
                      )}
                      {tool.serialNumber && (
                        <p className="text-sm text-gray-500">Серийный номер: {tool.serialNumber}</p>
                      )}
                      {tool.condition && (
                        <p className="text-sm text-gray-500">
                          Состояние: {tool.condition === 'excellent' ? 'Отличное' : 
                                     tool.condition === 'good' ? 'Хорошее' : 
                                     tool.condition === 'fair' ? 'Удовлетворительное' : 'Плохое'}
                        </p>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center space-x-2">
                      {editingTool === tool.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            value={editQuantity}
                            onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleEditSave(tool.id)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">
                            {tool.quantity} шт.
                          </span>
                          <button
                            onClick={() => handleEditStart(tool)}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveTool(tool.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Проверьте найденные инструменты и при необходимости отредактируйте количество
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => onConfirmTools(result.tools)}
                disabled={result.tools.length === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Подтвердить ({result.tools.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
