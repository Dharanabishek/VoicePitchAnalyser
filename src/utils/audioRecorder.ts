import { analyzeAudio, AudioAnalysis } from './audioProcessor';

export class AudioRecorder {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private isRecording = false;
  private bufferSize = 4096;
  private analysisCallback: (analysis: AudioAnalysis) => void = () => {};
  private recordedChunks: Float32Array[] = [];

  async initialize(): Promise<void> {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } as any,
      });

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;

      // Create script processor for real-time analysis
      this.scriptProcessor = this.audioContext.createScriptProcessor(this.bufferSize, 1, 1);

      source.connect(this.analyser);
      this.analyser.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);

      this.scriptProcessor.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!this.isRecording) return;

        const inputData = e.inputBuffer.getChannelData(0);
        const bufferCopy = new Float32Array(inputData);
        this.recordedChunks.push(bufferCopy);

        const analysis = analyzeAudio(bufferCopy, this.audioContext!.sampleRate);
        this.analysisCallback(analysis);
      };
    } catch (error) {
      console.error('Failed to initialize audio recorder:', error);
      throw error;
    }
  }

  startRecording(callback: (analysis: AudioAnalysis) => void): void {
    if (!this.audioContext) {
      console.error('Audio context not initialized');
      return;
    }

    this.isRecording = true;
    this.analysisCallback = callback;
    this.recordedChunks = [];

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  stopRecording(): Float32Array {
    this.isRecording = false;

    // Concatenate all recorded chunks
    const totalLength = this.recordedChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;

    for (const chunk of this.recordedChunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    this.recordedChunks = [];
    return merged;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array();
    }

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getWaveformData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array();
    }

    const dataArray = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  stop(): void {
    this.isRecording = false;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export const audioRecorder = new AudioRecorder();
