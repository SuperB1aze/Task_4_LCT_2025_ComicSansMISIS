import { useState } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { ImageUploadWithRecognition } from '../components/ImageUploadWithRecognition'
import { DetectedTool } from '../types'

export const ToolsPage = () => {
  const [detectedTools, setDetectedTools] = useState<DetectedTool[]>([])
  const [newToolName, setNewToolName] = useState('')
  const [newToolQuantity, setNewToolQuantity] = useState(1)
  const [showModal, setShowModal] = useState(false)

  const addNewTool = () => {
    if (newToolName.trim()) {
      const newTool: DetectedTool = {
        id: `manual_${Date.now()}`,
        name: newToolName.trim(),
        quantity: newToolQuantity,
        confidence: 1.0
      }
      setDetectedTools([...detectedTools, newTool])
      setNewToolName('')
      setNewToolQuantity(1)
      setShowModal(false)
    }
  }

  const removeTool = (id: string) => {
    setDetectedTools(tools => tools.filter(tool => tool.id !== id))
  }

  const confirmReturn = () => {
    if (detectedTools.length === 0) {
      alert('Список инструментов пуст')
      return
    }
    console.log('Сдаваемые инструменты:', detectedTools)
    alert(`Подтверждена сдача ${detectedTools.length} инструментов!`)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">

        {/* Main Title and Description */}
        <div className="mb-6">
          <div className="flex items-end gap-8">
            <div>
              <h1 className="text-[52px] font-semibold text-[#262626] leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Сдача<br />инструментов
              </h1>
            </div>
          </div>
        </div>


        {/* Cards */}
        <div className="flex justify-center gap-8 mb-8">
          {/* Сканирование Card */}
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
                  onToolsDetected={(tools) => setDetectedTools(tools)}
                  className="w-[357px] h-32"
                />
              </div>
            </div>
          </div>

          {/* Список найденных инструментов */}
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
            
            <div className="px-6 pt-0 pb-4 flex-1 -mt-8 relative" style={{ height: '240px' }}>
              {/* Прокручиваемый список инструментов */}
              <div className="overflow-y-auto space-y-2 pr-2" style={{ height: '100px', marginBottom: '120px' }}>
                {detectedTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{tool.quantity} шт.</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeTool(tool.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Кнопки внизу блока - абсолютное позиционирование */}
              <div className="absolute bottom-6 left-6 right-6 space-y-2" style={{ height: '100px' }}>
                {/* Кнопка добавления инструмента */}
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Plus size={16} />
                  <span>Добавить инструмент вручную</span>
                </button>
                
                {/* Кнопка завершения сдачи */}
                <button 
                  onClick={confirmReturn}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Check size={16} />
                  <span>Завершить сдачу</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно для добавления инструмента */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Добавить инструмент
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название инструмента
                  </label>
                  <input
                    type="text"
                    placeholder="Введите название инструмента"
                    value={newToolName}
                    onChange={(e) => setNewToolName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Количество
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      value={newToolQuantity}
                      onChange={(e) => setNewToolQuantity(parseInt(e.target.value) || 1)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">шт.</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={addNewTool}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Добавить
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
