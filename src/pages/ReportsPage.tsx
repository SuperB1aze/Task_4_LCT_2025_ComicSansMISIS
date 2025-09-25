import { useState } from 'react'
import { BarChart3, Download, Filter, Calendar } from 'lucide-react'

export const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const reports = [
    {
      id: 1,
      title: 'Отчет по выдаче инструментов',
      date: '23 ноября 2023',
      status: 'completed',
      description: 'Детальный отчет о всех выданных инструментах за период'
    },
    {
      id: 2,
      title: 'Отчет по техническому обслуживанию',
      date: '22 ноября 2023',
      status: 'pending',
      description: 'Список инструментов, требующих технического обслуживания'
    },
    {
      id: 3,
      title: 'Отчет по инвентаризации',
      date: '21 ноября 2023',
      status: 'completed',
      description: 'Результаты инвентаризации инструментов'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="card p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Отчеты
              </h1>
              <p className="text-gray-600">
                Аналитика и отчеты по использованию инструментов
              </p>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input w-40"
              >
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
                <option value="quarter">За квартал</option>
                <option value="year">За год</option>
              </select>
              
              <button className="btn btn-outline flex items-center space-x-2">
                <Filter size={16} />
                <span>Фильтр</span>
              </button>
              
              <button className="btn btn-primary flex items-center space-x-2">
                <Download size={16} />
                <span>Экспорт</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card p-6 text-center">
              <BarChart3 className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-600">Всего операций</div>
            </div>
            
            <div className="card p-6 text-center">
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">142</div>
              <div className="text-sm text-gray-600">Успешных</div>
            </div>
            
            <div className="card p-6 text-center">
              <BarChart3 className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">В процессе</div>
            </div>
            
            <div className="card p-6 text-center">
              <BarChart3 className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-600">Ошибок</div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Последние отчеты
            </h2>
            
            {reports.map((report) => (
              <div key={report.id} className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {report.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report.status === 'completed' ? 'Завершен' : 'В процессе'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{report.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="btn btn-outline text-sm">
                      Просмотр
                    </button>
                    <button className="btn btn-primary text-sm">
                      Скачать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
