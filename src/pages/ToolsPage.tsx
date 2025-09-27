import { useState } from 'react'
import { Upload } from 'lucide-react'

export const ToolsPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

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
      // Здесь можно добавить логику загрузки файла на сервер
      console.log('Загружаем файл:', selectedFile.name)
      alert(`Файл "${selectedFile.name}" успешно загружен!`)
    }
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


        {/* Сканирование Card */}
        <div className="flex justify-center items-center min-h-[calc(100vh-300px)]">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[800px] h-[500px] flex flex-col animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="px-6 py-0 flex items-center justify-center flex-shrink-0">
              <object 
                data="/assets/loadphoto.svg" 
                type="image/svg+xml"
                width="720" 
                height="255"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto'
                }}
              >
                <img 
                  src="/assets/loadphoto.svg" 
                  alt="Сканирование" 
                  width="720" 
                  height="255"
                />
              </object>
            </div>

            <div className="px-6 pt-0 pb-0 flex flex-col items-center justify-start flex-1">

              {/* File Upload Area */}
              <div className="w-full max-w-2xl flex flex-col items-center -mt-16">
                <input
                  type="file"
                  id="card-file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  className={`cursor-pointer flex flex-col items-center gap-2 p-6 border-2 border-dashed rounded-lg transition-all duration-200 w-full max-w-[calc(100%-25px)] h-64 ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('card-file-upload')?.click()}
                >
                  <Upload className={`w-16 h-16 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div className="text-center">
                    <p className="text-2xl font-medium text-gray-700 mb-4">
                      {isDragOver ? 'Отпустите файл здесь' : 'Перетащите фото сюда'}
                    </p>
                    <p className="text-lg text-gray-500">
                      или нажмите для выбора файла
                    </p>
                    {selectedFile && (
                      <p className="text-lg text-green-600 mt-4 font-medium">
                        Выбран: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Preview */}
                {previewUrl && (
                  <div className="mt-6 flex flex-col items-center gap-4">
                    <img
                      src={previewUrl}
                      alt="Предварительный просмотр"
                      className="max-w-48 max-h-36 rounded object-cover shadow-lg"
                    />
                    <button
                      onClick={handleUpload}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" />
                      Загрузить
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
