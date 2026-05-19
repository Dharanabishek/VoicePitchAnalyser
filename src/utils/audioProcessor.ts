export interface PitchData {
  frequency: number;
  confidence: number;
  note: string;
  octave: number;
}

export interface AudioAnalysis {
  pitch: PitchData;
  volume: number;
  spectrum: number[];
  waveform: Float32Array;
  frequencyBand: {
    bass: number;
    midrange: number;
    treble: number;
  };
}

const A4 = 440;
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Detect pitch using autocorrelation algorithm
 * Based on the algorithm described in:
 * https://en.wikipedia.org/wiki/Autocorrelation
 */
export function detectPitch(buffer: Float32Array, sampleRate: number): PitchData {
  // Find approximate pitch using autocorrelation
  const MAX_SAMPLES = Math.floor(sampleRate / 40); // Minimum 40 Hz
  let best_offset = -1;
  let best_correlation = 0;

  // Normalization
  let sum = 0;
  for (let i = 0; i < MAX_SAMPLES; i++) {
    sum += buffer[i] * buffer[i];
  }

  // Autocorrelation
  for (let shift = 40; shift < MAX_SAMPLES; shift++) {
    let same_side_correlation = 0;
    let neg_corner_correlation = 0;
    let pos_corner_correlation = 0;

    for (let index = 0; index < MAX_SAMPLES; index++) {
      same_side_correlation += buffer[index] * buffer[index + shift];
      neg_corner_correlation += buffer[index] * buffer[index + shift];
      pos_corner_correlation += buffer[index + shift] * buffer[index + shift];
    }

    if (shift === 0) {
      pos_corner_correlation = sum * sum;
    } else {
      pos_corner_correlation = Math.sqrt(pos_corner_correlation * sum);
    }

    same_side_correlation /= pos_corner_correlation;

    if (same_side_correlation > 0.9) {
      if (same_side_correlation > best_correlation) {
        best_correlation = same_side_correlation;
        best_offset = shift;
      }
    }
  }

  let frequency = 0;
  let confidence = 0;

  if (best_correlation > 0.01) {
    frequency = sampleRate / best_offset;
    confidence = best_correlation;
  }

  // Clamp frequency to human voice range
  frequency = Math.max(50, Math.min(frequency, 2000));

  const { note, octave } = frequencyToNote(frequency);

  return {
    frequency,
    confidence: Math.min(confidence * 100, 100),
    note,
    octave,
  };
}

/**
 * Convert frequency to musical note
 */
export function frequencyToNote(frequency: number): { note: string; octave: number } {
  if (frequency <= 0) return { note: '—', octave: 0 };

  const semitones = 12 * Math.log2(frequency / A4);
  const noteIndex = Math.round(semitones + 9) % 12;
  const octave = Math.floor((semitones + 9) / 12) + 4;

  return {
    note: NOTES[(noteIndex + 12) % 12],
    octave: Math.max(0, octave),
  };
}

/**
 * Get vocal range category based on frequency
 */
export function getVocalRange(frequency: number): string {
  // Frequency ranges for different vocal types
  if (frequency < 82) return 'Bass';
  if (frequency < 110) return 'Baritone';
  if (frequency < 147) return 'Tenor';
  if (frequency < 175) return 'Alto';
  if (frequency < 220) return 'Mezzo-Soprano';
  return 'Soprano';
}

/**
 * Calculate volume from buffer
 */
export function calculateVolume(buffer: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sum / buffer.length);
  // Convert to dB (0 to 100 scale)
  return Math.min(100, Math.max(0, (20 * Math.log10(rms) + 100) * 0.5));
}

/**
 * Perform FFT-like frequency analysis using naive approach
 */
export function analyzeFrequencies(buffer: Float32Array, sampleRate: number): number[] {
  const bands = 32;
  const spectrum = new Array(bands).fill(0);
  const nyquist = sampleRate / 2;
  const bandWidth = nyquist / bands;

  for (let band = 0; band < bands; band++) {
    const minFreq = band * bandWidth;
    const maxFreq = (band + 1) * bandWidth;
    const minIndex = Math.floor((minFreq / nyquist) * buffer.length);
    const maxIndex = Math.ceil((maxFreq / nyquist) * buffer.length);

    let sum = 0;
    for (let i = minIndex; i < maxIndex; i++) {
      sum += Math.abs(buffer[i]);
    }
    spectrum[band] = sum / (maxIndex - minIndex);
  }

  return spectrum;
}

/**
 * Analyze frequency bands
 */
export function analyzeFrequencyBands(spectrum: number[]): { bass: number; midrange: number; treble: number } {
  const bass = spectrum.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
  const midrange = spectrum.slice(8, 20).reduce((a, b) => a + b, 0) / 12;
  const treble = spectrum.slice(22, 32).reduce((a, b) => a + b, 0) / 10;

  return { bass, midrange, treble };
}

/**
 * Perform complete audio analysis
 */
export function analyzeAudio(buffer: Float32Array, sampleRate: number): AudioAnalysis {
  const pitch = detectPitch(buffer, sampleRate);
  const volume = calculateVolume(buffer);
  const spectrum = analyzeFrequencies(buffer, sampleRate);
  const frequencyBand = analyzeFrequencyBands(spectrum);

  return {
    pitch,
    volume,
    spectrum,
    waveform: buffer.slice(0, buffer.length),
    frequencyBand,
  };
}

/**
 * Get voice quality feedback
 */
export function getVoiceQualityFeedback(
  confidence: number,
  volume: number,
  frequencyBand: { bass: number; midrange: number; treble: number }
): string[] {
  const feedback: string[] = [];

  if (confidence < 30) {
    feedback.push('⚠️ Low confidence in pitch detection. Speak more clearly.');
  } else if (confidence > 80) {
    feedback.push('✓ Excellent pitch stability!');
  }

  if (volume < 20) {
    feedback.push('🔊 Speak louder for better analysis.');
  } else if (volume > 85) {
    feedback.push('⚠️ Volume is too high. Try speaking more gently.');
  } else {
    feedback.push('✓ Good volume level!');
  }

  if (frequencyBand.midrange > frequencyBand.treble && frequencyBand.midrange > frequencyBand.bass) {
    feedback.push('✓ Good tonal balance!');
  }

  if (frequencyBand.bass > 0.5) {
    feedback.push('💬 Rich bass tones detected. Good for deep voices.');
  }

  return feedback;
}
