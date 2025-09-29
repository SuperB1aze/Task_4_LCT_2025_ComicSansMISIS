import { useState } from 'react'
import { BarChart3, Filter, Eye, ChevronDown } from 'lucide-react'

export const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  const reports = [
    {
      id: 1,
      title: 'Отчет по выдаче инструментов',
      date: '25 февраля 2025г',
      status: 'awaiting',
      statusText: 'Ожидает',
      description: 'Детальный отчет о всех выданных инструментах за период. Включает информацию о количестве выданных единиц, сроках возврата и состоянии инструментов.'
    },
    {
      id: 2,
      title: 'Отчет по техническому обслуживанию',
      date: '24 февраля 2025г',
      status: 'resolved',
      statusText: 'Решено',
      description: 'Список инструментов, требующих технического обслуживания. Отмечены все выявленные неисправности и выполненные ремонтные работы.'
    },
    {
      id: 3,
      title: 'Отчет по инвентаризации',
      date: '23 февраля 2025г',
      status: 'in_progress',
      statusText: 'В работе',
      description: 'Результаты инвентаризации инструментов. Проверка наличия, состояния и соответствия учетным данным.'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awaiting':
        return 'bg-orange-100 text-orange-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 
          className="text-[52px] font-semibold text-[#262626] leading-tight mb-8"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Отчеты
        </h1>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 zoom-in-animation" style={{ animationDelay: '0.1s' }}>
          {/* Section Header */}
          <div className="flex justify-end items-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="week">За неделю</option>
                  <option value="month">За месяц</option>
                  <option value="quarter">За квартал</option>
                  <option value="year">За год</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <Filter size={16} />
                <span>Фильтр</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow zoom-in-animation" style={{ animationDelay: '0.2s' }}>
              <BarChart3 className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-600">Всего операций</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow zoom-in-animation" style={{ animationDelay: '0.3s' }}>
              <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">140</div>
              <div className="text-sm text-gray-600">Успешных</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow zoom-in-animation" style={{ animationDelay: '0.4s' }}>
              <BarChart3 className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">В процессе</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center hover:shadow-md transition-shadow zoom-in-animation" style={{ animationDelay: '0.5s' }}>
              <BarChart3 className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4</div>
              <div className="text-sm text-gray-600">Ошибок</div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={report.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow zoom-in-animation" style={{ animationDelay: `${0.6 + index * 0.1}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {report.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.statusText}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <Eye size={16} />
                      <span>Просмотр</span>
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {report.description}
                </p>
                
                <div className="text-sm text-gray-500">
                  {report.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
