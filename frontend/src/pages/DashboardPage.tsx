
import React from 'react'
import { useNavigate } from 'react-router-dom'
const handoverImage = '/assets/handover.svg'
const changeImage = '/assets/change.svg'
const questionsImage = '/assets/questions.svg'
const techSupportImage = '/assets/tech_support.svg'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const handleCardClick = (path: string) => {
    navigate(path)
  }

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
          </div>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {/* Card 1 - Выдача инструментов */}
          <div 
            className="relative cursor-pointer w-[380px] h-[470px] zoom-in-animation" 
            style={{ animationDelay: '0s' }}
            onClick={() => handleCardClick('/inventory')}
          >
            <img 
              src={handoverImage} 
              alt="Выдача инструментов"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Card 2 - Сдача инструментов */}
          <div 
            className="relative cursor-pointer w-[380px] h-[470px] zoom-in-animation" 
            style={{ animationDelay: '0.2s' }}
            onClick={() => handleCardClick('/tools')}
          >
            <img 
              src={changeImage} 
              alt="Сдача инструментов"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Card 3 - Q&A Reports */}
          <div 
            className="relative cursor-pointer w-[380px] h-[470px] zoom-in-animation" 
            style={{ animationDelay: '0.4s' }}
            onClick={() => handleCardClick('/reports')}
          >
            <img 
              src={questionsImage} 
              alt="Q&A Reports"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Card 4 - Техническая поддержка */}
          <div 
            className="relative cursor-pointer w-[380px] h-[470px] zoom-in-animation" 
            style={{ animationDelay: '0.6s' }}
            onClick={() => handleCardClick('/support')}
          >
            <img 
              src={techSupportImage} 
              alt="Техническая поддержка"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  )
}