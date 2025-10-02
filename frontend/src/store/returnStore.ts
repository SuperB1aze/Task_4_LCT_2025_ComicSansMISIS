import { create } from 'zustand';

export interface ComparisonResult {
  success: boolean;
  message: string;
  issued_tools: Array<{
    tool_id: number;
    name: string;
    serial_number: string;
    quantity: number;
  }>;
  returned_tools: Array<{
    tool_id: number;
    name: string;
    serial_number: string;
    quantity: number;
  }>;
  missing_tools: Array<{
    tool_id: number;
    name: string;
    serial_number: string;
    quantity: number;
    missing_quantity?: number;
  }>;
  extra_tools: Array<{
    tool_id: number;
    name: string;
    serial_number: string;
    quantity: number;
  }>;
  all_returned: boolean;
  issued_transaction_id: number;
  comparison_summary: {
    total_issued: number;
    total_returned: number;
    missing_count: number;
    extra_count: number;
  };
  discrepancies: Array<{
    tool_id: number;
    name: string;
    issued_qty: number;
    returned_qty: number;
    difference: number;
    type: 'excess' | 'unexpected';
  }>;
}

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

interface ReturnStore {
  // Состояние
  isProcessing: boolean;
  result: ReturnResult | null;
  comparisonResult: ComparisonResult | null;
  error: string | null;
  showResultsDialog: boolean;
  uploadedImages: Array<{url: string, fileName: string}>;
  imageMLResults: Array<{fileName: string, result: ReturnResult}>;
  
  // Действия
  setProcessing: (processing: boolean) => void;
  setResult: (result: ReturnResult | null) => void;
  setComparisonResult: (result: ComparisonResult | null) => void;
  setError: (error: string | null) => void;
  setShowResultsDialog: (show: boolean) => void;
  setUploadedImages: (images: Array<{url: string, fileName: string}>) => void;
  addUploadedImage: (image: {url: string, fileName: string}) => void;
  removeUploadedImage: (index: number) => void;
  setImageMLResults: (results: Array<{fileName: string, result: ReturnResult}>) => void;
  addImageMLResult: (result: {fileName: string, result: ReturnResult}) => void;
  reset: () => void;
}

export const useReturnStore = create<ReturnStore>((set) => ({
  // Начальное состояние
  isProcessing: false,
  result: null,
  comparisonResult: null,
  error: null,
  showResultsDialog: false,
  uploadedImages: [],
  imageMLResults: [],
  
  // Действия
  setProcessing: (processing) => set({ isProcessing: processing }),
  setResult: (result) => set({ result }),
  setComparisonResult: (comparisonResult) => set({ comparisonResult }),
  setError: (error) => set({ error }),
  setShowResultsDialog: (show) => set({ showResultsDialog: show }),
  setUploadedImages: (uploadedImages) => set({ uploadedImages }),
  addUploadedImage: (image) => set((state) => ({ 
    uploadedImages: [...state.uploadedImages, image] 
  })),
  removeUploadedImage: (index) => set((state) => ({ 
    uploadedImages: state.uploadedImages.filter((_, i) => i !== index) 
  })),
  setImageMLResults: (imageMLResults) => set({ imageMLResults }),
  addImageMLResult: (result) => set((state) => ({ 
    imageMLResults: [...state.imageMLResults, result] 
  })),
  reset: () => set({
    isProcessing: false,
    result: null,
    comparisonResult: null,
    error: null,
    showResultsDialog: false,
    uploadedImages: [],
    imageMLResults: []
  })
}));
