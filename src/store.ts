import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum Page {
  VISUAL,
  TEXT_AUDIO,
}

export interface AppState {
  selectedVisual: string | null;
  selectedText: string | null;
  selectedAudio: string | null;
  output: string | null;
  isAudioPlaying: boolean;
  isProcessing: boolean;
  isProcessingNotificationOpen: boolean;
  isErrorNotificationOpen: boolean;
  page: Page;
}

export interface AppActions {
  setSelectedVisual: (visual: string | null) => void;
  setSelectedText: (text: string | null) => void;
  setSelectedAudio: (audio: string | null) => void;
  setOutput: (output: string | null) => void;
  setIsAudioPlaying: (isProcessing: boolean) => void;
  toggleIsAudioPlaying: () => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setIsProcessingNotificationOpen: (isOpen: boolean) => void;
  setIsErrorNotificationOpen: (isOpen: boolean) => void;
  setPage: (page: Page) => void;
  increasePage: () => void;
  decreasePage: () => void;
  resetState: () => void;
}

const initialState: AppState = {
  selectedVisual: null,
  selectedAudio: null,
  selectedText: null,
  output: null,
  isAudioPlaying: false,
  isProcessing: false,
  isProcessingNotificationOpen: false,
  isErrorNotificationOpen: false,
  page: Page.VISUAL,
};

export const useZStore = create<AppState & AppActions>()(
  devtools(set => ({
    ...initialState,
    setSelectedVisual: selectedVisual => set(() => ({ selectedVisual })),
    setSelectedText: selectedText => set(() => ({ selectedText })),
    setSelectedAudio: selectedAudio => set(() => ({ selectedAudio })),
    setOutput: output => set(() => ({ output })),
    setIsAudioPlaying: isAudioPlaying => set(() => ({ isAudioPlaying })),
    toggleIsAudioPlaying: () =>
      set(state => ({ isAudioPlaying: !state.isAudioPlaying })),
    setIsProcessing: isProcessing => set(() => ({ isProcessing })),
    setIsProcessingNotificationOpen: isProcessingNotificationOpen =>
      set(() => ({ isProcessingNotificationOpen })),
    setIsErrorNotificationOpen: isErrorNotificationOpen =>
      set(() => ({ isErrorNotificationOpen })),
    setPage: page => set(() => ({ page })),
    increasePage: () => set(state => ({ page: state.page + 1 })),
    decreasePage: () => set(state => ({ page: state.page - 1 })),
    resetState: () => set(() => ({ ...initialState })),
  })),
);
