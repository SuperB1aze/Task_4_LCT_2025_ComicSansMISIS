import React from 'react';
import { Check, X, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Package, AlertCircle } from 'lucide-react';
import { ReturnResult } from '../services/returnService';
import { ComparisonResult } from '../store/returnStore';

interface ReturnResultsDialogProps {
  result: ReturnResult;
  comparisonResult?: ComparisonResult;
  onClose: () => void;
  onConfirm: () => void;
  currentStep?: number;
  totalSteps?: number;
  photoFileName?: string;
  uploadedImages?: Array<{url: string, fileName: string}>;
  imageMLResults?: Array<{fileName: string, result: ReturnResult}>;
}

export const ReturnResultsDialog: React.FC<ReturnResultsDialogProps> = ({
  result,
  comparisonResult,
  onClose,
  onConfirm,
  currentStep = 3,
  totalSteps = 3,
  photoFileName = 'DSCN4946.JPG',
  uploadedImages = [],
  imageMLResults = []
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  
  // Определяем, нужно ли показывать навигацию
  const hasMultipleImages = imageMLResults.length > 1;
  const currentImageData = imageMLResults[currentImageIndex];

  // Подсчет статистики на основе текущего изображения
  const currentImageToolCount = currentImageData?.result.returned_tools.length || 0;
  
  // Определяем статус сдачи на основе сравнения
  const isFullReturn = comparisonResult?.all_returned || false;
  const hasMissingTools = (comparisonResult?.missing_tools?.length || 0) > 0;
  const hasExtraTools = (comparisonResult?.extra_tools?.length || 0) > 0;

  // Компонент статуса
  const StatusIcon = () => {
    if (isFullReturn && !hasMissingTools && !hasExtraTools) {
      return (
        <div className="flex items-center justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
      );
    } else if (hasMissingTools) {
      return (
        <div className="flex items-center justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
      );
    } else if (hasExtraTools) {
      return (
        <div className="flex items-center justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full">
            <AlertTriangle className="w-12 h-12 text-orange-600" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Package className="w-12 h-12 text-blue-600" />
          </div>
        </div>
      );
    }
  };

  // Компонент сообщения статуса
  const StatusMessage = () => {
    if (isFullReturn && !hasMissingTools && !hasExtraTools) {
      return (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-green-600 mb-2">
            ✅ Все инструменты сданы!
          </h3>
          <p className="text-gray-600 text-sm">
            Полный комплект из {comparisonResult?.comparison_summary.total_issued || 0} инструментов успешно возвращен
          </p>
        </div>
      );
    } else if (hasMissingTools) {
      return (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-red-600 mb-2">
            ⚠️ Недостающие инструменты
          </h3>
          <p className="text-gray-600 text-sm">
            Сдано {comparisonResult?.comparison_summary.total_returned || 0} из {comparisonResult?.comparison_summary.total_issued || 0} инструментов
          </p>
        </div>
      );
    } else if (hasExtraTools) {
      return (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-orange-600 mb-2">
            ⚠️ Лишние инструменты
          </h3>
          <p className="text-gray-600 text-sm">
            Обнаружены инструменты, которые не были выданы
          </p>
        </div>
      );
    } else {
      return (
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-blue-600 mb-2">
            📦 Результаты сканирования
          </h3>
          <p className="text-gray-600 text-sm">
            Анализ изображений завершен
          </p>
        </div>
      );
    }
  };

  // Функции навигации
  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < imageMLResults.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Если нет данных для текущего изображения, показываем заглушку
  if (!currentImageData && imageMLResults.length > 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Нет данных для отображения</h2>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Заголовок с пагинацией */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Результаты сдачи инструментов
            </h2>
            {hasMultipleImages && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Фото {currentImageIndex + 1} из {imageMLResults.length}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Навигация между страницами */}
        {hasMultipleImages && (
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handlePreviousImage}
              disabled={currentImageIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Предыдущее</span>
            </button>
            
            <div className="flex space-x-2">
              {imageMLResults.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={handleNextImage}
              disabled={currentImageIndex === imageMLResults.length - 1}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Следующее</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* Статусные иконки и сообщения */}
          <StatusIcon />
          <StatusMessage />

          {/* Заголовок страницы с информацией о текущем изображении */}
          {currentImageData && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-blue-600 mb-2">
                {currentImageData.fileName}
              </h3>
              <p className="text-gray-600 text-sm">
                Найдено инструментов: {currentImageData.result.returned_tools.length}
              </p>
            </div>
          )}

          {/* Обработанное изображение с ML результатами */}
          {currentImageData?.result.processed_image_url && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Результат анализа ML
              </h4>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={`http://localhost:8000${currentImageData.result.processed_image_url}`}
                  alt="Обработанное изображение с выделенными инструментами"
                  className="max-w-full h-auto rounded"
                  onError={(e) => {
                    console.error('Ошибка загрузки изображения:', currentImageData.result.processed_image_url);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-center py-4">
                  <p className="text-gray-500">Не удалось загрузить обработанное изображение</p>
                </div>
              </div>
            </div>
          )}

          {/* Инструменты, найденные на текущем изображении */}
          {currentImageData && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Check className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-semibold text-green-600">
                  Инструменты на этом изображении ({currentImageData.result.returned_tools.length})
                </h4>
              </div>
              {currentImageData.result.returned_tools.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-green-50">
                  {currentImageData.result.returned_tools.map((tool, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-xs">{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{tool.name}</div>
                          {tool.serial_number && (
                            <div className="text-xs text-gray-500">№ {tool.serial_number}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                  <p className="text-gray-500">На этом изображении инструменты не обнаружены</p>
                </div>
              )}
            </div>
          )}

          {/* Сводная информация сравнения */}
          {comparisonResult && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Сводная информация сравнения
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Выдано инструментов:</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {comparisonResult.comparison_summary.total_issued}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Сдано инструментов:</div>
                  <div className="text-2xl font-bold text-green-600">
                    {comparisonResult.comparison_summary.total_returned}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${comparisonResult.comparison_summary.missing_count === 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="text-sm text-gray-600">Недостающих:</div>
                  <div className={`text-2xl font-bold ${comparisonResult.comparison_summary.missing_count === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparisonResult.comparison_summary.missing_count}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${comparisonResult.comparison_summary.extra_count === 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <div className="text-sm text-gray-600">Лишних:</div>
                  <div className={`text-2xl font-bold ${comparisonResult.comparison_summary.extra_count === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {comparisonResult.comparison_summary.extra_count}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Список недостающих инструментов */}
          {comparisonResult?.missing_tools && comparisonResult.missing_tools.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <X className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-600">
                  Недостающие инструменты ({comparisonResult.missing_tools.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-red-50">
                {comparisonResult.missing_tools.map((tool, index) => (
                  <div key={tool.tool_id} className="flex items-center justify-between p-2 bg-white rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-semibold text-xs">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{tool.name}</div>
                        <div className="text-xs text-gray-500">№ {tool.serial_number}</div>
                      </div>
                    </div>
                    <div className="text-sm text-red-600 font-semibold">
                      {tool.missing_quantity || tool.quantity} шт.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Список лишних инструментов */}
          {comparisonResult?.extra_tools && comparisonResult.extra_tools.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-orange-600">
                  Лишние инструменты ({comparisonResult.extra_tools.length})
                </h3>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-orange-50">
                {comparisonResult.extra_tools.map((tool, index) => (
                  <div key={tool.tool_id} className="flex items-center justify-between p-2 bg-white rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-xs">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{tool.name}</div>
                        <div className="text-xs text-gray-500">№ {tool.serial_number}</div>
                      </div>
                    </div>
                    <div className="text-sm text-orange-600 font-semibold">
                      {tool.quantity} шт.
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопки навигации внизу */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          {hasMultipleImages && currentImageIndex > 0 ? (
            <button
              onClick={handlePreviousImage}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Предыдущее</span>
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Закрыть
          </button>
          
          {hasMultipleImages && currentImageIndex < imageMLResults.length - 1 ? (
            <button
              onClick={handleNextImage}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <span>Следующее</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};
