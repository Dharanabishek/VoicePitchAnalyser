import React from 'react';
import { motion } from 'framer-motion';
import { AudioAnalysis } from '../utils/audioProcessor';
import { useAppStore } from '../store/appStore';

interface AnalyticsPanelProps {
  analysis: AudioAnalysis | null;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ analysis }) => {
  const { darkMode } = useAppStore();

  const volume = analysis?.volume || 0;
  const frequencyBand = analysis?.frequencyBand || { bass: 0, midrange: 0, treble: 0 };

  const metrics = [
    {
      label: 'Volume',
      value: volume.toFixed(1),
      unit: 'dB',
      icon: '🔊',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-500/20 to-red-500/20',
    },
    {
      label: 'Bass',
      value: (frequencyBand.bass * 100).toFixed(0),
      unit: '%',
      icon: '🎸',
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-500/20 to-pink-500/20',
    },
    {
      label: 'Midrange',
      value: (frequencyBand.midrange * 100).toFixed(0),
      unit: '%',
      icon: '🎤',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/20 to-emerald-500/20',
    },
    {
      label: 'Treble',
      value: (frequencyBand.treble * 100).toFixed(0),
      unit: '%',
      icon: '✨',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/20 to-cyan-500/20',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-effect rounded-2xl p-6 h-full ${darkMode ? 'bg-slate-900/40 border-slate-700/50' : 'glass-effect-light'}`}
    >
      <h2 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Analytics</h2>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-slate-50 border border-slate-200'}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {metric.label}
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className={`relative h-2 bg-gradient-to-r ${metric.color} rounded-full overflow-hidden opacity-20`}>
                <motion.div
                  className={`h-full bg-gradient-to-r ${metric.color}`}
                  animate={{ width: `${Math.min(parseFloat(metric.value), 100)}%` }}
                  transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                />
              </div>
            </div>

            {/* Value display */}
            <div className="flex justify-between items-end">
              <motion.div
                key={metric.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}
              >
                {metric.value}
              </motion.div>
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{metric.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'}`}
      >
        <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>Frequency Balance</h3>
        <p className={`text-xs ${darkMode ? 'text-blue-200/70' : 'text-blue-800/70'}`}>
          {frequencyBand.midrange > frequencyBand.treble && frequencyBand.midrange > frequencyBand.bass
            ? '✓ Good tonal balance with strong midrange'
            : 'Adjust vocal techniques for better balance'}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPanel;
