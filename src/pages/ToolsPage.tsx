import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export const ToolsPage = () => {
  const [searchCode, setSearchCode] = useState('')

  return (
    <div className="min-h-screen p-8" style={{ backgroundImage: 'url(/assets/background.svg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="max-w-7xl mx-auto">
        {/* Back to Home Button */}
        <Link to="/" className="mb-8 bg-blue-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-700 transition-colors w-fit">
          <ArrowLeft className="w-5 h-5" />
          На главную
        </Link>

        {/* Main Title and Description */}
        <div className="mb-12">
          <div className="flex items-end gap-8">
            <div>
              <h1 className="text-[52px] font-semibold text-[#262626] leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Сдача<br />инструментов
              </h1>
            </div>
            <p className="text-lg text-white max-w-md leading-relaxed ml-auto">
              Проверка количества и состояния рабочих инструментов после их эксплуатации
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* % Совпадения Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[448px] h-[300px] ml-[163px]">
            <div className="px-6 py-2">
              <img src="/assets/sovpadenia.svg" alt="% Совпадения" className="w-full h-auto" />
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

          {/* Сканирование Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[448px] h-[300px]">
            <div className="px-6 py-2">
              <img src="/assets/scan.svg" alt="Сканирование" className="w-full h-auto" />
            </div>
            <div className="px-6 py-1 flex flex-col items-center justify-center h-full">
              <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
