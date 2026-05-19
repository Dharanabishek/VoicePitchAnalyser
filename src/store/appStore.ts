import { create } from 'zustand';
import { AudioAnalysis } from '../utils/audioProcessor';

export interface AnalysisHistory {
  timestamp: Date;
  frequency: number;
  confidence: number;
  volume: number;
  note: string;
  vocalRange: string;
}

interface AppState {
  isRecording: boolean;
  currentAnalysis: AudioAnalysis | null;
  analysisHistory: AnalysisHistory[];
  darkMode: boolean;
  recordedAudio: Float32Array | null;
  maxFrequency: number;
  minFrequency: number;
  averageConfidence: number;

  setRecording: (recording: boolean) => void;
  setCurrentAnalysis: (analysis: AudioAnalysis | null) => void;
  addToHistory: (item: AnalysisHistory) => void;
  clearHistory: () => void;
  setDarkMode: (dark: boolean) => void;
  setRecordedAudio: (audio: Float32Array | null) => void;
  updateStats: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isRecording: false,
  currentAnalysis: null,
  analysisHistory: [],
  darkMode: true,
  recordedAudio: null,
  maxFrequency: 0,
  minFrequency: Infinity,
  averageConfidence: 0,

  setRecording: (recording: boolean) => set({ isRecording: recording }),

  setCurrentAnalysis: (analysis: AudioAnalysis | null) => {
    set({ currentAnalysis: analysis });
    if (analysis) {
      set((state) => {
        const maxFreq = Math.max(state.maxFrequency, analysis.pitch.frequency);
        const minFreq = Math.min(state.minFrequency, analysis.pitch.frequency);
        return {
          maxFrequency: maxFreq,
          minFrequency: minFreq === Infinity ? analysis.pitch.frequency : minFreq,
        };
      });
    }
  },

  addToHistory: (item: AnalysisHistory) =>
    set((state) => {
      const newHistory = [...state.analysisHistory, item];
      // Keep only last 300 items for performance
      if (newHistory.length > 300) {
        newHistory.shift();
      }
      return { analysisHistory: newHistory };
    }),

  clearHistory: () => set({ analysisHistory: [], maxFrequency: 0, minFrequency: Infinity }),

  setDarkMode: (dark: boolean) => set({ darkMode: dark }),

  setRecordedAudio: (audio: Float32Array | null) => set({ recordedAudio: audio }),

  updateStats: () => {
    set((state) => {
      const avgConfidence =
        state.analysisHistory.length > 0
          ? state.analysisHistory.reduce((sum, item) => sum + item.confidence, 0) / state.analysisHistory.length
          : 0;
      return { averageConfidence: avgConfidence };
    });
  },
}));
