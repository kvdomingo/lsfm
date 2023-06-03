import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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

export const appSlice = createSlice({
  name: "lsfm",
  initialState,
  reducers: {
    setSelectedVisual: (state, action: PayloadAction<string | null>) => {
      state.selectedVisual = action.payload;
    },
    setSelectedText: (state, action: PayloadAction<string | null>) => {
      state.selectedText = action.payload;
    },
    setSelectedAudio: (state, action: PayloadAction<string | null>) => {
      state.selectedAudio = action.payload;
      state.isAudioPlaying = false;
    },
    setOutput: (state, action: PayloadAction<string | null>) => {
      state.output = action.payload;
    },
    setIsAudioPlaying: (state, action: PayloadAction<boolean>) => {
      state.isAudioPlaying = action.payload;
    },
    toggleIsAudioPlaying: state => {
      state.isAudioPlaying = !state.isAudioPlaying;
    },
    setIsProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setIsProcessingNotificationOpen: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.isProcessingNotificationOpen = action.payload;
    },
    setIsErrorNotificationOpen: (state, action: PayloadAction<boolean>) => {
      state.isErrorNotificationOpen = action.payload;
    },
    decreasePage: state => {
      state.page -= 1;
    },
    increasePage: state => {
      state.page += 1;
    },
    resetState: state => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSelectedVisual,
  setSelectedText,
  setSelectedAudio,
  setOutput,
  setIsAudioPlaying,
  toggleIsAudioPlaying,
  setIsProcessing,
  setIsProcessingNotificationOpen,
  setIsErrorNotificationOpen,
  decreasePage,
  increasePage,
  resetState,
} = appSlice.actions;

export default appSlice.reducer;
