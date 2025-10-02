import { STANDARD_TOOLKIT } from '../constants';

export interface ReturnResult {
  returned_tools: Array<{
    id: number;
    name: string;
    serial_number: string;
    category: string;
  }>;
  hand_check: boolean;
  processed_image_url?: string;
  ml_predictions: number[];
}

class ReturnService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.getApiBaseUrl();
  }

  private getApiBaseUrl(): string {
    if (import.meta.env.DEV) {
      return 'http://localhost:8000';
    }
    return import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  async recognizeReturnedTools(imageFile: File, toolkitId: number = 1, confidence: number = 0.1): Promise<ReturnResult> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('toolkit_id', toolkitId.toString());
    formData.append('confidence', confidence.toString());

    try {
      const response = await fetch(`${this.baseUrl}/predict/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.transformBackendResponse(data);
    } catch (error) {
      console.error('Ошибка распознавания:', error);
      throw new Error('Не удалось распознать возвращаемые инструменты на изображении');
    }
  }

  private transformBackendResponse(data: any): ReturnResult {
    return {
      returned_tools: data.found_tools || [],
      hand_check: data.hand_check || false,
      processed_image_url: data.processed_image_url,
      ml_predictions: data.ml_predictions || []
    };
  }

  async createReturnTransaction(tools: any[], userId: string, toolkitId: number = 1) {
    // Здесь должна быть логика создания транзакции сдачи
    // Пока возвращаем заглушку
    return {
      id: Date.now(),
      type: 'return',
      tools,
      userId,
      toolkitId,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  }
}

export const returnService = new ReturnService();
