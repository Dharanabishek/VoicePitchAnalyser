import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

interface ControlPanelProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  initialized: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ isRecording, onStart, onStop, initialized }) => {
  const { darkMode } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect rounded-2xl p-8 ${darkMode ? 'bg-slate-900/40 border-slate-700/50' : 'glass-effect-light'}`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Main Recording Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? onStop : onStart}
          disabled={!initialized}
          className={`relative w-32 h-32 rounded-full font-bold text-white text-lg transition-all duration-300 ${
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-pink-500 shadow-lg shadow-red-500/50'
              : 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70'
          } ${!initialized ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isRecording ? (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-full h-full flex items-center justify-center"
            >
              ⏹️
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-full h-full flex items-center justify-center"
            >
              🎤
            </motion.div>
          )}

          {/* Pulse animation when recording */}
          {isRecording && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-red-500"
              />
              <motion.div
                animate={{ scale: [1, 2], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 rounded-full border-2 border-red-500"
              />
            </>
          )}
        </motion.button>

        {/* Status Text */}
        <motion.div className="text-center">
          <motion.h3
            key={isRecording ? 'recording' : 'ready'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xl font-bold ${isRecording ? 'text-red-400' : darkMode ? 'text-blue-400' : 'text-blue-600'}`}
          >
            {isRecording ? '🔴 Recording...' : '🎙️ Ready to Record'}
          </motion.h3>
          <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {isRecording
              ? 'Click to stop recording and analyze your voice'
              : initialized
                ? 'Click the microphone button to start recording'
                : 'Initializing microphone...'}
          </p>
        </motion.div>

        {/* Quick Info */}
        <div
          className={`w-full grid grid-cols-3 gap-4 pt-6 border-t ${darkMode ? 'border-slate-700/50' : 'border-slate-200'}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>🎯</div>
            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Pitch Detection</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>📊</div>
            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Real-time Analysis</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>📈</div>
            <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Voice Quality</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ControlPanel;
