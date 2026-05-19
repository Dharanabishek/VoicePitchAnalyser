import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppStore } from '../store/appStore';
import { AnalysisHistory } from '../store/appStore';

interface PitchHistoryChartProps {
  history: AnalysisHistory[];
}

const PitchHistoryChart: React.FC<PitchHistoryChartProps> = ({ history }) => {
  const { darkMode } = useAppStore();

  const chartData = useMemo(() => {
    // Sample data to avoid performance issues with too many points
    const sampleRate = Math.max(1, Math.floor(history.length / 100));
    return history.filter((_, i) => i % sampleRate === 0).map((item, index) => ({
      index,
      frequency: item.frequency,
      confidence: item.confidence,
      volume: item.volume,
      time: item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }));
  }, [history]);

  const stats = useMemo(() => {
    if (history.length === 0) return { avg: 0, max: 0, min: 0, avgConf: 0 };

    const frequencies = history.map((h) => h.frequency);
    const confidences = history.map((h) => h.confidence);

    return {
      avg: frequencies.reduce((a, b) => a + b, 0) / frequencies.length,
      max: Math.max(...frequencies),
      min: Math.min(...frequencies),
      avgConf: confidences.reduce((a, b) => a + b, 0) / confidences.length,
    };
  }, [history]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-effect rounded-2xl p-6 ${darkMode ? 'bg-slate-900/40 border-slate-700/50' : 'glass-effect-light'}`}
    >
      <h2 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Pitch History & Analytics</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-slate-50 border border-slate-200'}`}
        >
          <div className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Average Pitch</div>
          <div className={`text-xl font-bold mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {stats.avg.toFixed(0)} Hz
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-slate-50 border border-slate-200'}`}
        >
          <div className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Max Pitch</div>
          <div className={`text-xl font-bold mt-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {stats.max.toFixed(0)} Hz
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-slate-50 border border-slate-200'}`}
        >
          <div className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Min Pitch</div>
          <div className={`text-xl font-bold mt-1 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            {stats.min.toFixed(0)} Hz
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/30 border border-slate-700/30' : 'bg-slate-50 border border-slate-200'}`}
        >
          <div className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avg Confidence</div>
          <div className={`text-xl font-bold mt-1 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {stats.avgConf.toFixed(0)}%
          </div>
        </motion.div>
      </div>

      {/* Pitch Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`mb-8 p-4 rounded-lg ${darkMode ? 'bg-slate-800/20' : 'bg-slate-50'}`}
      >
        <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Pitch Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke={darkMode ? '#334155' : '#cbd5e1'} strokeDasharray="5 5" />
            <XAxis
              stroke={darkMode ? '#64748b' : '#94a3b8'}
              style={{ fontSize: '12px' }}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }}
            />
            <YAxis
              stroke={darkMode ? '#64748b' : '#94a3b8'}
              style={{ fontSize: '12px' }}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}
            />
            <Legend wrapperStyle={{ color: darkMode ? '#e2e8f0' : '#1f2937' }} />
            <Line
              type="monotone"
              dataKey="frequency"
              stroke="#3b82f6"
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Confidence & Volume Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/20' : 'bg-slate-50'}`}
      >
        <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Confidence & Volume</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid stroke={darkMode ? '#334155' : '#cbd5e1'} strokeDasharray="5 5" />
            <XAxis
              stroke={darkMode ? '#64748b' : '#94a3b8'}
              style={{ fontSize: '12px' }}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }}
            />
            <YAxis
              stroke={darkMode ? '#64748b' : '#94a3b8'}
              style={{ fontSize: '12px' }}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                border: `1px solid ${darkMode ? '#475569' : '#cbd5e1'}`,
                borderRadius: '8px',
              }}
              labelStyle={{ color: darkMode ? '#e2e8f0' : '#1f2937' }}
            />
            <Legend wrapperStyle={{ color: darkMode ? '#e2e8f0' : '#1f2937' }} />
            <Bar dataKey="confidence" fill="#10b981" name="Confidence %" radius={[4, 4, 0, 0]} />
            <Bar dataKey="volume" fill="#f59e0b" name="Volume (dB)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
};

export default PitchHistoryChart;
