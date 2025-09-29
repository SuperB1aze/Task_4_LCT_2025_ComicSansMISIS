import { useState } from 'react'
import { Upload } from 'lucide-react'

// Компонент круговой диаграммы
const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 50
  const strokeWidth = 10
  const normalizedRadius = radius - strokeWidth / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-24 h-24">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Прогресс круг с градиентом */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#0046E2" />
          </linearGradient>
        </defs>
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="drop-shadow-lg"
        />
      </svg>
      {/* Процент в центре */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-lg font-bold text-[#262626] leading-none ml-2.5 mt-1"
          style={{ 
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {percentage}%
        </span>
      </div>
    </div>
  )
}

export const InventoryPage = () => {
  const [searchCode, setSearchCode] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [matchPercentage, setMatchPercentage] = useState(98) // Пока модель не обучена, используем тестовые данные

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
      } else {
        alert('Пожалуйста, выберите изображение')
      }
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Загружаем файл:', selectedFile.name)
      alert(`Файл "${selectedFile.name}" успешно загружен!`)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-[52px] font-semibold text-[#262626] leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Выдача<br />инструментов
          </h1>
        </div>

        {/* Cards */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-8">
            {/* Совпадения Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[448px] h-[345px] zoom-in-animation" style={{ animationDelay: '0s' }}>
              <div className="px-6 py-2 flex items-center justify-center">
                <object 
                  data="/assets/sovpadenia.svg" 
                  type="image/svg+xml"
                  width="400" 
                  height="89"
                  style={{ 
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                >
                  <img 
                    src="/assets/sovpadenia.svg" 
                    alt="% Совпадения" 
                    width="400" 
                    height="89"
                  />
                </object>
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

            {/* Загрузить изображение Card */}
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
              
              {/* File Upload Area - перемещен выше */}
              <div className="px-6 pt-0 pb-4 flex flex-col items-center flex-1">
                <div className="w-full max-w-lg flex flex-col items-center">
                  <input
                    type="file"
                    id="card-file-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div
                    className={`cursor-pointer flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg transition-all duration-200 w-[357px] h-32 ${
                      isDragOver 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('card-file-upload')?.click()}
                  >
                    <Upload className={`w-8 h-8 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        {isDragOver ? 'Отпустите файл здесь' : 'Перетащите фото сюда'}
                      </p>
                      <p className="text-sm text-gray-500">
                        или нажмите для выбора файла
                      </p>
                      {selectedFile && (
                        <p className="text-sm text-green-600 mt-2 font-medium">
                          Выбран: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Preview */}
                  {previewUrl && (
                    <div className="mt-3 flex flex-col items-center gap-1">
                      <img
                        src={previewUrl}
                        alt="Предварительный просмотр"
                        className="max-w-20 max-h-14 rounded object-cover shadow-sm"
                      />
                      <button
                        onClick={handleUpload}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        Загрузить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Instruments List and Result */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-8">
          {/* Список инструментов */}
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
              <div className="px-6 pt-0 pb-4 flex-1 -mt-8 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Отвертка крестовая</span>
                    <span className="text-sm text-gray-500">2 шт.</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Плоскогубцы</span>
                    <span className="text-sm text-gray-500">1 шт.</span>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button 
                    className="flex-1 px-3 rounded-full text-xs font-medium transition-colors"
                    style={{ 
                      backgroundColor: '#F3F4F6', 
                      color: '#262626',
                      height: '48px'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#E5E7EB'}
                    onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#F3F4F6'}
                  >
                    Завершить сканирование
                  </button>
                  <button 
                    className="flex-1 px-3 rounded-full text-xs font-medium text-white transition-colors hover:opacity-90"
                    style={{ 
                      backgroundColor: '#0046E2',
                      height: '48px'
                    }}
                  >
                    Добавить вручную
                  </button>
                </div>
              </div>
            </div>

          {/* Блок результата */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col zoom-in-animation" style={{ animationDelay: '0.3s', width: '569px', height: '130px' }}>
              {/* Content */}
              <div className="px-6 py-4 flex-1 flex items-center justify-between">
                {/* Левая часть - круговая диаграмма */}
                <div className="flex flex-col items-center">
                  <CircularProgress percentage={matchPercentage} />
                </div>

                {/* Центральная часть - подпись "Совпадение" и процент */}
                <div className="flex flex-col items-center">
                  <h3 className="text-[#262626] mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '20px', fontWeight: 'bold' }}>
                    Совпадение
                  </h3>
                  <div className="text-center">
                    <p className="text-xl font-bold text-[#0066FF]">{matchPercentage}%</p>
                    <p className="text-xs text-gray-500">
                      {matchPercentage === 100 ? 'Полное совпадение' : 
                       matchPercentage >= 90 ? 'Высокое совпадение' :
                       matchPercentage >= 70 ? 'Хорошее совпадение' :
                       matchPercentage >= 50 ? 'Среднее совпадение' : 'Низкое совпадение'}
                    </p>
                  </div>
                </div>

                {/* Правая часть - кнопки с тестовыми данными */}
                <div className="flex flex-col gap-2">
                  <button 
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                    onClick={() => setMatchPercentage(Math.floor(Math.random() * 50) + 50)}
                  >
                    Тест: 50-99%
                  </button>
                  <button 
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                    onClick={() => setMatchPercentage(100)}
                  >
                    Тест: 100%
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
