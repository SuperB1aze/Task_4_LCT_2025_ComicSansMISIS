import React from 'react';
import { ReturnResult } from '../services/returnService';

interface ReturnResultsDialogProps {
  result: ReturnResult;
  onClose: () => void;
  onConfirm: () => void;
}

export const ReturnResultsDialog: React.FC<ReturnResultsDialogProps> = ({
  result,
  onClose,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Результаты сдачи инструментов</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {/* Статистика */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Статистика сдачи</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Возвращено инструментов:</span>
                <span className="ml-2 font-semibold">{result.returned_tools.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Нужна проверка:</span>
                <span className={`ml-2 font-semibold ${result.hand_check ? 'text-red-600' : 'text-green-600'}`}>
                  {result.hand_check ? 'Да' : 'Нет'}
                </span>
              </div>
            </div>
          </div>

          {/* Список возвращенных инструментов */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Возвращенные инструменты</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {result.returned_tools.map((tool, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{tool.name}</div>
                      <div className="text-sm text-gray-500">{tool.serial_number}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{tool.category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Предупреждение о ручной проверке */}
          {result.hand_check && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="text-yellow-600 mr-3">⚠️</div>
                <div>
                  <h4 className="font-semibold text-yellow-800">Требуется ручная проверка</h4>
                  <p className="text-yellow-700 text-sm mt-1">
                    Количество возвращенных инструментов не соответствует ожидаемому.
                    Рекомендуется проверить результат вручную.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Обработанное изображение */}
          {result.processed_image_url && (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Обработанное изображение</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <img
                  src={`http://localhost:8000${result.processed_image_url}`}
                  alt="Обработанное изображение"
                  className="max-w-full h-auto rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Подтвердить сдачу
          </button>
        </div>
      </div>
    </div>
  );
};
