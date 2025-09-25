
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import handoverImage from '../assets/handover.svg'
import changeImage from '../assets/change.svg'
import questionsImage from '../assets/questions.svg'

export const DashboardPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-[1548px]">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
              <span className="font-medium text-sm" style={{ color: '#B6B7B8' }}>Аэрофлот</span>
            </div>
            
            <h1 className="text-[52px] font-semibold text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
              Держите все<br />под контролем
            </h1>
            
            <p className="text-lg text-gray-600 font-normal max-w-xl leading-relaxed">
              Сервис для тщательного отслеживания и контроля состояния рабочих инструментов
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {/* Card 1 - Выдача инструментов */}
          <div className="rounded-xl overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform w-[500px] h-[470px] animate-in slide-in-from-bottom-4 fade-in duration-300 delay-0">
            <img 
              src={handoverImage} 
              alt="Выдача инструментов"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
            <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <ArrowRight className="w-4 h-4 text-primary-500" />
            </button>
          </div>

          {/* Card 2 - Сдача инструментов */}
          <div className="rounded-xl overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform w-[500px] h-[470px] animate-in slide-in-from-bottom-4 fade-in duration-300 delay-0">
            <img 
              src={changeImage} 
              alt="Сдача инструментов"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
            <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <ArrowRight className="w-4 h-4 text-primary-500" />
            </button>
          </div>

          {/* Card 3 - Q&A Reports */}
          <div className="rounded-xl overflow-hidden relative group cursor-pointer hover:scale-105 transition-transform w-[500px] h-[470px] animate-in slide-in-from-bottom-4 fade-in duration-300 delay-0">
            <img 
              src={questionsImage} 
              alt="Q&A Reports"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-200"></div>
            <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
              <ArrowRight className="w-4 h-4 text-primary-500" />
            </button>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2">
          <button className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center hover:bg-primary-200 transition-colors">
            <ChevronLeft className="w-4 h-4 text-primary-500" />
          </button>
          <button className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}