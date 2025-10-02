import { create } from 'zustand';
import { IssuanceResult } from '../services/issuanceService';

interface IssuanceStore {
  // Состояние
  isProcessing: boolean;
  result: IssuanceResult | null;
  error: string | null;
  showResultsDialog: boolean;
  
  // Действия
  setProcessing: (processing: boolean) => void;
  setResult: (result: IssuanceResult | null) => void;
  setError: (error: string | null) => void;
  setShowResultsDialog: (show: boolean) => void;
  reset: () => void;
}

export const useIssuanceStore = create<IssuanceStore>((set) => ({
  // Начальное состояние
  isProcessing: false,
  result: null,
  error: null,
  showResultsDialog: false,
  
  // Действия
  setProcessing: (processing) => set({ isProcessing: processing }),
  setResult: (result) => set({ result }),
  setError: (error) => set({ error }),
  setShowResultsDialog: (show) => set({ showResultsDialog: show }),
  reset: () => set({
    isProcessing: false,
    result: null,
    error: null,
    showResultsDialog: false
  })
}));
