import React from 'react';

interface PhotoResultsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onRetake: () => void;
  onConfirm: () => void;
  imageUrl?: string;
  isLoading?: boolean;
}

export const PhotoResultsDialog: React.FC<PhotoResultsDialogProps> = ({
  isOpen,
  onClose,
  onRetake,
  onConfirm,
  imageUrl,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Результат фотографирования</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Обработка изображения...</span>
            </div>
          ) : (
            <>
              {imageUrl && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <img
                    src={imageUrl}
                    alt="Сфотографированное изображение"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Что дальше?</h3>
                <p className="text-blue-700 text-sm">
                  Изображение готово для обработки. Нажмите "Подтвердить" для начала распознавания инструментов
                  или "Переснять" для повторной фотографии.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onRetake}
            disabled={isLoading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Переснять
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Обработка...' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  );
};
