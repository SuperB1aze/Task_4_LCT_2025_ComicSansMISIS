import { useState } from 'react'
import { QrCode } from 'lucide-react'

export const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<'matches' | 'scanning'>('matches')
  const [searchCode, setSearchCode] = useState('')
  const [showResults, setShowResults] = useState(false)

  const handleSearch = () => {
    if (searchCode.trim()) {
      setShowResults(true)
    }
  }

  const tools = [
    { id: 1, name: 'Отвертка', quantity: '1 шт.', checked: false },
    { id: 2, name: 'Гаечный ключ', quantity: '2 шт.', checked: false },
    { id: 3, name: 'Плоскогубцы', quantity: '1 шт.', checked: false },
  ]

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Выдача инструментов
            </h1>
            
            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('matches')}
                className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'matches'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                % Совпадения
              </button>
              <button
                onClick={() => setActiveTab('scanning')}
                className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'scanning'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Сканирование
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'matches' ? (
            <div className="space-y-8">
              {/* Search Input */}
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Введите код"
                  className="input flex-1"
                />
                <button
                  onClick={handleSearch}
                  className="btn btn-primary px-8"
                >
                  Найти
                </button>
              </div>

              {/* Results */}
              {showResults && (
                <div className="space-y-6">
                  {/* Match Percentage */}
                  <div className="card p-6 text-center">
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#E5E7EB"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#3B82F6"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${98 * 2.51} 251`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">98%</span>
                      </div>
                    </div>
                    <p className="text-gray-600">Совпадений</p>
                  </div>

                  {/* Tools List */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Инструментов
                    </h3>
                    <div className="space-y-3">
                      {tools.map((tool) => (
                        <label
                          key={tool.id}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{tool.name}</span>
                            <span className="text-gray-500 ml-2">({tool.quantity})</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Наведите камеру на QR-код для сканирования</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
