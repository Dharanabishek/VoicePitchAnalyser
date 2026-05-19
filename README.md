# Voice Pitch Analyzer 🎤

A professional AI-powered Voice Pitch Analyzer web application for real-time vocal analysis. Record your microphone audio and get instant feedback on your pitch, vocal range, frequency analysis, and voice quality.

## ✨ Features

### Core Features
- **Real-time Microphone Recording** - Live audio input with echo cancellation and noise suppression
- **Pitch Detection** - Advanced autocorrelation algorithm for accurate pitch detection (50-2000 Hz)
- **Live Pitch Meter** - Beautiful circular animated meter showing current pitch
- **Vocal Range Detection** - Automatic classification (Bass, Baritone, Tenor, Alto, Mezzo-Soprano, Soprano)
- **Confidence Scoring** - Real-time confidence percentage for detected pitch

### Analysis & Visualization
- **Real-time Waveform** - Visual representation of audio waveform
- **Frequency Spectrum** - Real-time frequency analysis with color-coded visualization
- **Pitch History Chart** - Historical pitch data with trend analysis
- **Analytics Dashboard** - Detailed metrics including volume, bass, midrange, and treble analysis
- **Voice Quality Feedback** - AI-based suggestions for vocal improvement

### UI/UX
- **Dark/Light Mode** - Professional dark theme with light mode option
- **Glassmorphism Effects** - Modern frosted glass UI elements
- **Smooth Animations** - Framer Motion powered transitions and effects
- **Mobile Responsive** - Fully responsive design for mobile and desktop
- **Real-time Updates** - Live data updates at 50ms intervals

### Advanced Features
- **Frequency Band Analysis** - Separate analysis of bass, midrange, and treble frequencies
- **Vocal Range Statistics** - Track min, max, and average pitch during session
- **Echo Cancellation** - Built-in Web Audio API echo cancellation
- **Noise Suppression** - Automatic noise suppression during recording
- **Auto Gain Control** - Automatic volume leveling

## 🚀 Tech Stack

- **React 18.2** - UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Web Audio API** - Real-time audio processing
- **Zustand** - State management
- **Vite** - Build tool

## 📋 Prerequisites

- Node.js 16+ 
- npm or yarn
- Modern web browser with microphone access (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation

1. **Clone the repository**
```bash
cd /workspaces/VoicePitchAnalyser
```

2. **Install dependencies**
```bash
npm install
```

## 🎯 Usage

### Development Mode
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📖 How to Use

1. **Start the Application**
   - Run `npm run dev` to start the development server
   - Open your browser to `http://localhost:5173`

2. **Grant Microphone Permission**
   - Allow the browser to access your microphone when prompted

3. **Start Recording**
   - Click the large microphone button in the center
   - Speak or sing into your microphone
   - Real-time analysis will begin immediately

4. **View Analysis**
   - **Pitch Meter** - Shows current frequency in Hz and note
   - **Analytics Panel** - Displays volume, bass, midrange, treble levels
   - **Waveform** - Visual representation of audio signal
   - **Spectrum** - Frequency distribution of your voice
   - **History Chart** - Trends over time

5. **Get Feedback**
   - Voice quality feedback appears in real-time
   - See suggestions for vocal improvement

6. **Stop Recording**
   - Click the stop button or press again
   - View complete analysis and statistics

## 🎵 Vocal Range Reference

| Range | Frequency Range | Example |
|-------|-----------------|---------|
| Bass | < 82 Hz | Classical male bass |
| Baritone | 82-110 Hz | Opera baritone |
| Tenor | 110-147 Hz | Opera tenor |
| Alto | 147-175 Hz | Alto/countertenor |
| Mezzo-Soprano | 175-220 Hz | Mezzo-soprano |
| Soprano | > 220 Hz | Classical soprano |

## 🎨 UI Components

### Main Components
- **Header** - App title and dark mode toggle
- **PitchMeter** - Central circular pitch display
- **AnalyticsPanel** - Right sidebar with metrics
- **ControlPanel** - Large record/stop button
- **WaveformVisualizer** - Audio waveform display
- **FrequencyAnalyzer** - Spectrum visualization
- **PitchHistoryChart** - Historical data graphs
- **VoiceQualityFeedback** - Real-time feedback messages

## 🔧 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── PitchMeter.tsx
│   ├── AnalyticsPanel.tsx
│   ├── ControlPanel.tsx
│   ├── WaveformVisualizer.tsx
│   ├── FrequencyAnalyzer.tsx
│   ├── PitchHistoryChart.tsx
│   └── VoiceQualityFeedback.tsx
├── utils/              # Utility functions
│   ├── audioProcessor.ts    # Pitch detection & analysis
│   └── audioRecorder.ts     # Audio recording
├── store/              # State management
│   └── appStore.ts          # Zustand store
├── App.tsx             # Main app component
├── App.css             # App styles
├── index.css           # Global styles
└── main.tsx            # Entry point

public/                # Static assets
index.html            # HTML entry point
package.json          # Dependencies
tsconfig.json         # TypeScript config
tailwind.config.ts    # Tailwind CSS config
vite.config.ts        # Vite config
```

## 🎯 Key Algorithms

### Pitch Detection
Uses autocorrelation algorithm to detect fundamental frequency:
- Analyzes audio buffer for periodic patterns
- Finds best matching frequency based on correlation
- Clamps to human voice range (50-2000 Hz)
- Provides confidence score for accuracy

### Frequency Analysis
- FFT-like frequency bin analysis
- Separates into 32 frequency bands
- Categorizes into bass, midrange, treble
- Color-coded spectrum visualization

### Voice Quality Analysis
Based on:
- Pitch confidence level
- Volume/loudness
- Frequency band distribution
- Tonal balance

## 🌐 Browser Support

- Chrome/Chromium 60+
- Firefox 55+
- Safari 14.1+
- Edge 79+
- Opera 47+

## 📱 Mobile Support

Full mobile responsive design:
- Touch-friendly controls
- Optimized layouts for small screens
- Landscape and portrait modes
- Full feature support on mobile devices

## ⚙️ Configuration

### Audio Settings
Modify `src/utils/audioRecorder.ts` for custom audio settings:
```typescript
audio: {
  echoCancellation: true,      // Enable echo cancellation
  noiseSuppression: true,      // Enable noise suppression
  autoGainControl: true,       // Enable auto gain control
}
```

### Pitch Detection Range
Modify `src/utils/audioProcessor.ts`:
- Min frequency: 50 Hz (can be lowered to 40 Hz)
- Max frequency: 2000 Hz (can be raised to 4000 Hz)

### Analysis Update Interval
In `src/App.tsx`:
- Current: 50ms (20 updates per second)
- Adjustable in the analysis loop

## 🚀 Performance Tips

1. **Use HTTPS** - Some browsers require HTTPS for microphone access
2. **Close Other Tabs** - Reduces background noise and CPU load
3. **Use Wired Headphones** - Better audio quality and less feedback
4. **Quiet Environment** - Improves pitch detection accuracy
5. **Modern Browser** - Latest versions have better Web Audio API support

## 🐛 Troubleshooting

### No Microphone Access
- Check browser permissions
- Allow microphone access when prompted
- Try a different browser
- Ensure microphone is plugged in and working

### Inaccurate Pitch Detection
- Speak clearly and distinctly
- Maintain steady volume
- Reduce background noise
- Use a better quality microphone
- Stay in the 50-2000 Hz range

### Visualizers Not Working
- Check browser console for errors
- Ensure WebGL is enabled
- Try a different browser
- Clear browser cache

### High CPU Usage
- Reduce number of visualization updates
- Close other applications
- Use a simpler browser
- Reduce chart history length

## 📚 Learning Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Pitch Detection Algorithms](https://en.wikipedia.org/wiki/Pitch_detection_algorithm)
- [Music Theory - Vocal Ranges](https://en.wikipedia.org/wiki/Vocal_range)
- [Autocorrelation Pitch Detection](https://en.wikipedia.org/wiki/Autocorrelation)

## 🎓 Music Theory

### Understanding Pitch
- **Frequency (Hz)** - Number of oscillations per second
- **Note** - Musical pitch designation (C, D, E, F, G, A, B)
- **Octave** - Doubling of frequency (A3=220Hz, A4=440Hz, A5=880Hz)
- **Semitone** - 1/12th of an octave

### Vocal Physiology
- **Fundamental Frequency** - Primary pitch of voice
- **Harmonics** - Multiples of fundamental frequency
- **Resonance** - Amplification by vocal tract
- **Formants** - Peaks in frequency spectrum

## 💡 Advanced Features (Future)

- [ ] Recording playback with audio scrubbing
- [ ] PDF report export
- [ ] Comparison with famous singers
- [ ] Daily improvement tips
- [ ] Session history and statistics
- [ ] Pitch bend detection
- [ ] Vibrato analysis
- [ ] Real-time auto-tune visualization
- [ ] Social sharing features
- [ ] Multi-user comparison

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

## 🙏 Acknowledgments

- Web Audio API documentation and community
- React and TypeScript communities
- Framer Motion for animation framework
- Recharts for data visualization
- All open source contributors

---

**Built with ❤️ for voice enthusiasts and vocal professionals**
