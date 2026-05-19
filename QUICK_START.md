# 🚀 Quick Start Guide - Voice Pitch Analyzer

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Microphone access enabled in browser

### One-Time Setup

```bash
# Navigate to project directory
cd /workspaces/VoicePitchAnalyser

# Install all dependencies (already done, but you can reinstall if needed)
npm install
```

## Running the Application

### Development Mode (Recommended for Development)

```bash
npm run dev
```

Then:
1. Open your browser to `http://localhost:5173`
2. Allow microphone access when prompted
3. Start analyzing your voice!

The development server includes:
- Hot Module Replacement (HMR) - changes reload instantly
- Source maps for debugging
- Full development tools

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The production build:
- Minified code
- Optimized bundle size
- Ready for deployment

## Usage Instructions

### Recording & Analysis

1. **Start App**: Run `npm run dev` and open in browser
2. **Grant Permission**: Allow microphone access
3. **Click Microphone Button**: Start recording (center button)
4. **Speak/Sing**: Speak naturally into your microphone
5. **View Results**:
   - Pitch Meter shows current frequency in Hz
   - Analytics Panel shows volume and frequency bands
   - Waveform visualizer shows audio signal
   - Frequency spectrum shows distribution
   - Voice feedback provides suggestions

6. **Stop Recording**: Click button again or close browser
7. **View History**: All data persists during session

### UI Features

- **Dark/Light Mode**: Toggle in top right corner
- **Real-time Updates**: 20 times per second
- **Responsive Design**: Works on desktop and mobile
- **Smooth Animations**: Framer Motion effects
- **Professional Charts**: Recharts for data visualization

## Keyboard Shortcuts & Controls

- **Start/Stop**: Click the large microphone button
- **Toggle Theme**: Click sun/moon icon in header
- **ESC**: Close any dialogs (if added)

## Browser Console

Open browser DevTools (F12) to see:
- Performance metrics
- Error messages
- Audio context status
- Pitch detection logs

## Troubleshooting

### Microphone Not Working?
1. Check browser permissions for microphone
2. Try a different browser
3. Check if microphone is connected and not muted
4. Run: `npm run dev` again and reload page

### Inaccurate Pitch Detection?
- Speak more clearly
- Maintain steady volume
- Reduce background noise
- Move closer to microphone (15-30cm)
- Use a quality microphone

### Visual Issues?
- Clear browser cache (Ctrl+Shift+Delete)
- Try a different browser
- Make sure JavaScript is enabled
- Check console for errors

### Performance Slow?
- Close other browser tabs
- Close background applications
- Use Chrome/Firefox (faster than Safari)
- Reduce screen resolution if needed

## Project Structure

```
VoicePitchAnalyser/
├── src/
│   ├── components/     # React components
│   ├── utils/         # Audio processing & recording
│   ├── store/         # State management
│   ├── App.tsx        # Main app component
│   ├── main.tsx       # Entry point
│   ├── index.css      # Global styles
│   └── App.css        # App styles
├── dist/              # Production build output
├── node_modules/      # Dependencies
├── package.json       # Project configuration
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── README.md          # Full documentation
```

## Key Technologies

- **React 18.2** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data charts
- **Zustand** - State management
- **Vite** - Build tool
- **Web Audio API** - Real-time audio processing

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Common Tasks

### Modifying Styles
- Component styles: `src/components/ComponentName.tsx` (inline className)
- Global styles: `src/index.css` and `src/App.css`
- Theme colors: `tailwind.config.ts`

### Adding New Features
1. Create component in `src/components/`
2. Import in `src/App.tsx`
3. Use Zustand store for state (`src/store/appStore.ts`)
4. Style with Tailwind CSS classes

### Changing Audio Parameters
- Edit `src/utils/audioProcessor.ts` for pitch detection
- Edit `src/utils/audioRecorder.ts` for microphone settings
- Edit `src/App.tsx` for update intervals

## Performance Tips

1. Close other browser tabs
2. Use a quiet environment
3. Use wired headphones (better quality)
4. Run in Chrome/Firefox (most optimized)
5. Keep browser up to date

## Mobile Testing

The app is fully responsive:
- Works on iOS Safari 14.1+
- Works on Android Chrome/Firefox
- Touch controls are optimized
- Landscape and portrait modes supported

To test on mobile:
```bash
# Find your computer's IP
ipconfig getifaddr en0  # macOS
hostname -I            # Linux

# Access from mobile on same network
http://YOUR_IP:5173
```

## Deployment

The app can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static hosting service

```bash
# Build for production
npm run build

# Upload dist/ folder to hosting
```

## Getting Help

1. Check browser console for errors (F12)
2. Review README.md for detailed documentation
3. Check component comments in source code
4. Verify microphone permissions in OS

## Performance Metrics

Typical Performance:
- Initial load: ~2 seconds
- Build time: ~11 seconds
- Memory usage: ~50-100 MB
- Pitch update latency: ~50ms
- Audio latency: <100ms

## Notes

- All data is processed locally in the browser
- No data is sent to external servers
- Works offline once loaded
- Requires microphone permission
- Best with HTTPS (some browsers require it)

---

**Enjoy analyzing your voice! 🎤**

For more information, see the full [README.md](README.md)
