import { STANDARD_TOOLKIT } from '../constants';
import { ComparisonResult } from '../store/returnStore';

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
  comparison_result?: ComparisonResult;
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

  async compareWithIssued(
    returnedTools: Array<{
      id: number;
      name: string;
      serial_number: string;
      category: string;
    }>,
    userId: number = 1,
    toolkitId: number = 1
  ): Promise<ComparisonResult> {
    try {
      const response = await fetch(`${this.baseUrl}/return-tools/compare-with-issued`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          toolkit_id: toolkitId,
          returned_tools: returnedTools.map(tool => ({
            tool_id: tool.id,
            name: tool.name,
            serialNumber: tool.serial_number,
            quantity: 1 // По умолчанию 1 штука
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка сравнения с выданными инструментами:', error);
      throw new Error('Не удалось сравнить сданные инструменты с выданными');
    }
  }

  async processReturn(
    returnedTools: Array<{
      id: number;
      name: string;
      serial_number: string;
      category: string;
    }>,
    userId: number = 1,
    toolkitId: number = 1,
    processedImageUrl?: string,
    handCheck: boolean = false
  ): Promise<{success: boolean; transaction_id?: number; comparison_result?: ComparisonResult; message: string}> {
    try {
      const response = await fetch(`${this.baseUrl}/return-tools/process-return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          toolkit_id: toolkitId,
          returned_tools: returnedTools.map(tool => ({
            tool_id: tool.id,
            name: tool.name,
            serialNumber: tool.serial_number,
            quantity: 1 // По умолчанию 1 штука
          })),
          processed_image_url: processedImageUrl,
          hand_check: handCheck
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Ошибка обработки сдачи:', error);
      throw new Error('Не удалось обработать сдачу инструментов');
    }
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
