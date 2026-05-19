import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

interface VoiceQualityFeedbackProps {
  feedback: string[];
}

const VoiceQualityFeedback: React.FC<VoiceQualityFeedbackProps> = ({ feedback }) => {
  const { darkMode } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect rounded-2xl p-6 ${darkMode ? 'bg-slate-900/40 border-slate-700/50' : 'glass-effect-light'}`}
    >
      <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        <span>💡</span>
        Voice Quality Feedback
      </h2>

      <div className="space-y-3">
        {feedback.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start gap-3 p-3 rounded-lg ${
              item.includes('✓')
                ? darkMode
                  ? 'bg-green-900/20 border border-green-700/30'
                  : 'bg-green-50 border border-green-200'
                : item.includes('⚠️')
                  ? darkMode
                    ? 'bg-yellow-900/20 border border-yellow-700/30'
                    : 'bg-yellow-50 border border-yellow-200'
                  : darkMode
                    ? 'bg-blue-900/20 border border-blue-700/30'
                    : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <div
              className={`text-lg flex-shrink-0 ${
                item.includes('✓')
                  ? 'text-green-400'
                  : item.includes('⚠️')
                    ? 'text-yellow-400'
                    : 'text-blue-400'
              }`}
            >
              {item.charAt(0)}
            </div>
            <p
              className={`text-sm flex-1 ${
                item.includes('✓')
                  ? darkMode
                    ? 'text-green-200'
                    : 'text-green-800'
                  : item.includes('⚠️')
                    ? darkMode
                      ? 'text-yellow-200'
                      : 'text-yellow-800'
                    : darkMode
                      ? 'text-blue-200'
                      : 'text-blue-800'
              }`}
            >
              {item.substring(1).trim()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-purple-900/20 border border-purple-700/30' : 'bg-purple-50 border border-purple-200'}`}
      >
        <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>💬 Pro Tips for Better Vocal Quality</h3>
        <ul className={`text-xs space-y-1 ${darkMode ? 'text-purple-200/70' : 'text-purple-800/70'}`}>
          <li>• Maintain consistent distance from the microphone (15-30cm)</li>
          <li>• Speak clearly with proper enunciation</li>
          <li>• Keep your environment quiet to minimize background noise</li>
          <li>• Stay relaxed and maintain natural breathing</li>
          <li>• Use a high-quality microphone for better accuracy</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default VoiceQualityFeedback;
