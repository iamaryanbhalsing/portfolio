export interface TrackPreset {
  id: string;
  name: string;
  artist: string;
  bpm: number;
  description: string;
  // Oscillator configs
  oscillators: {
    type: OscillatorType;
    frequency: number;
    detune: number;
    gain: number;
    lfoRate?: number;
    lfoDepth?: number;
  }[];
  // Filter config
  filter: {
    type: BiquadFilterType;
    frequency: number;
    Q: number;
    lfoRate?: number;
    lfoDepth?: number;
  };
  // Reverb
  reverb: {
    decay: number;
    wet: number;
  };
  // Master
  master: {
    gain: number;
    pan: number;
  };
}

const PRESETS: TrackPreset[] = [
  {
    id: "midnight-protocol",
    name: "Midnight Protocol",
    artist: "Generative Audio",
    bpm: 72,
    description: "Deep ambient pads with subtle digital textures",
    oscillators: [
      { type: "sine", frequency: 110, detune: 0, gain: 0.15, lfoRate: 0.05, lfoDepth: 2 },
      { type: "sine", frequency: 165, detune: 3, gain: 0.1, lfoRate: 0.07, lfoDepth: 1.5 },
      { type: "triangle", frequency: 220, detune: -2, gain: 0.06, lfoRate: 0.03, lfoDepth: 3 },
      { type: "sine", frequency: 330, detune: 5, gain: 0.03, lfoRate: 0.1, lfoDepth: 1 },
    ],
    filter: { type: "lowpass", frequency: 800, Q: 1.2, lfoRate: 0.02, lfoDepth: 300 },
    reverb: { decay: 4, wet: 0.6 },
    master: { gain: 0.7, pan: 0 },
  },
  {
    id: "neural-drift",
    name: "Neural Drift",
    artist: "Generative Audio",
    bpm: 85,
    description: "Ethereal synth layers with soft rhythmic pulses",
    oscillators: [
      { type: "sine", frequency: 146.83, detune: 0, gain: 0.12, lfoRate: 0.08, lfoDepth: 4 },
      { type: "triangle", frequency: 220, detune: -5, gain: 0.08, lfoRate: 0.04, lfoDepth: 2 },
      { type: "sine", frequency: 293.66, detune: 7, gain: 0.05, lfoRate: 0.06, lfoDepth: 1.5 },
      { type: "sine", frequency: 440, detune: -3, gain: 0.03, lfoRate: 0.12, lfoDepth: 0.8 },
    ],
    filter: { type: "lowpass", frequency: 1200, Q: 0.8, lfoRate: 0.03, lfoDepth: 400 },
    reverb: { decay: 5, wet: 0.5 },
    master: { gain: 0.65, pan: 0 },
  },
  {
    id: "quantum-field",
    name: "Quantum Field",
    artist: "Generative Audio",
    bpm: 60,
    description: "Atmospheric drones with shimmering overtones",
    oscillators: [
      { type: "sine", frequency: 82.41, detune: 0, gain: 0.18, lfoRate: 0.02, lfoDepth: 1 },
      { type: "sine", frequency: 123.47, detune: 4, gain: 0.1, lfoRate: 0.04, lfoDepth: 2 },
      { type: "triangle", frequency: 164.81, detune: -6, gain: 0.07, lfoRate: 0.06, lfoDepth: 3 },
      { type: "sine", frequency: 246.94, detune: 2, gain: 0.04, lfoRate: 0.09, lfoDepth: 1 },
      { type: "sine", frequency: 329.63, detune: -1, gain: 0.02, lfoRate: 0.15, lfoDepth: 0.5 },
    ],
    filter: { type: "lowpass", frequency: 600, Q: 2, lfoRate: 0.015, lfoDepth: 200 },
    reverb: { decay: 7, wet: 0.7 },
    master: { gain: 0.6, pan: 0 },
  },
  {
    id: "code-flow",
    name: "Code Flow",
    artist: "Generative Audio",
    bpm: 95,
    description: "Focused ambience with crystalline textures",
    oscillators: [
      { type: "sine", frequency: 196, detune: 0, gain: 0.1, lfoRate: 0.1, lfoDepth: 3 },
      { type: "triangle", frequency: 293.66, detune: 2, gain: 0.07, lfoRate: 0.05, lfoDepth: 2 },
      { type: "sine", frequency: 392, detune: -4, gain: 0.05, lfoRate: 0.08, lfoDepth: 1.5 },
      { type: "sine", frequency: 587.33, detune: 6, gain: 0.025, lfoRate: 0.15, lfoDepth: 0.8 },
    ],
    filter: { type: "bandpass", frequency: 1000, Q: 0.5, lfoRate: 0.04, lfoDepth: 500 },
    reverb: { decay: 3, wet: 0.4 },
    master: { gain: 0.55, pan: 0 },
  },
  {
    id: "digital-sunrise",
    name: "Digital Sunrise",
    artist: "Generative Audio",
    bpm: 78,
    description: "Warm ambient wash with golden overtones",
    oscillators: [
      { type: "sine", frequency: 130.81, detune: 0, gain: 0.14, lfoRate: 0.04, lfoDepth: 2 },
      { type: "triangle", frequency: 196, detune: 4, gain: 0.09, lfoRate: 0.06, lfoDepth: 1.5 },
      { type: "sine", frequency: 261.63, detune: -3, gain: 0.06, lfoRate: 0.08, lfoDepth: 2.5 },
      { type: "sine", frequency: 392, detune: 2, gain: 0.035, lfoRate: 0.12, lfoDepth: 1 },
      { type: "triangle", frequency: 523.25, detune: -5, gain: 0.02, lfoRate: 0.18, lfoDepth: 0.6 },
    ],
    filter: { type: "lowpass", frequency: 900, Q: 1.5, lfoRate: 0.025, lfoDepth: 350 },
    reverb: { decay: 6, wet: 0.65 },
    master: { gain: 0.65, pan: 0 },
  },
  {
    id: "syntax-error",
    name: "Syntax Error",
    artist: "Generative Audio",
    bpm: 110,
    description: "Glitchy digital textures with erratic pulses",
    oscillators: [
      { type: "sawtooth", frequency: 82.41, detune: 7, gain: 0.08, lfoRate: 0.15, lfoDepth: 8 },
      { type: "square", frequency: 164.81, detune: -10, gain: 0.05, lfoRate: 0.2, lfoDepth: 5 },
      { type: "sine", frequency: 329.63, detune: 12, gain: 0.04, lfoRate: 0.08, lfoDepth: 3 },
      { type: "triangle", frequency: 659.25, detune: -8, gain: 0.025, lfoRate: 0.25, lfoDepth: 2 },
    ],
    filter: { type: "bandpass", frequency: 1500, Q: 2.5, lfoRate: 0.1, lfoDepth: 800 },
    reverb: { decay: 2, wet: 0.3 },
    master: { gain: 0.5, pan: 0 },
  },
  {
    id: "deep-focus",
    name: "Deep Focus",
    artist: "Generative Audio",
    bpm: 55,
    description: "Minimal sub-bass drones for intense concentration",
    oscillators: [
      { type: "sine", frequency: 55, detune: 0, gain: 0.2, lfoRate: 0.01, lfoDepth: 0.5 },
      { type: "sine", frequency: 82.41, detune: 2, gain: 0.12, lfoRate: 0.02, lfoDepth: 1 },
      { type: "sine", frequency: 110, detune: -1, gain: 0.08, lfoRate: 0.03, lfoDepth: 1.5 },
      { type: "triangle", frequency: 165, detune: 3, gain: 0.04, lfoRate: 0.05, lfoDepth: 2 },
    ],
    filter: { type: "lowpass", frequency: 400, Q: 3, lfoRate: 0.01, lfoDepth: 150 },
    reverb: { decay: 8, wet: 0.75 },
    master: { gain: 0.7, pan: 0 },
  },
  {
    id: "neon-cascade",
    name: "Neon Cascade",
    artist: "Generative Audio",
    bpm: 90,
    description: "Bright cascading tones with vivid harmonics",
    oscillators: [
      { type: "sine", frequency: 220, detune: 0, gain: 0.1, lfoRate: 0.12, lfoDepth: 3 },
      { type: "triangle", frequency: 329.63, detune: 5, gain: 0.07, lfoRate: 0.08, lfoDepth: 2 },
      { type: "sine", frequency: 440, detune: -7, gain: 0.05, lfoRate: 0.15, lfoDepth: 4 },
      { type: "sine", frequency: 659.25, detune: 3, gain: 0.03, lfoRate: 0.2, lfoDepth: 1.5 },
      { type: "triangle", frequency: 880, detune: -2, gain: 0.015, lfoRate: 0.25, lfoDepth: 0.8 },
    ],
    filter: { type: "lowpass", frequency: 2000, Q: 0.7, lfoRate: 0.06, lfoDepth: 600 },
    reverb: { decay: 4, wet: 0.5 },
    master: { gain: 0.55, pan: 0 },
  },
  {
    id: "silicon-dreams",
    name: "Silicon Dreams",
    artist: "Generative Audio",
    bpm: 68,
    description: "Dreamy soft pads with gentle detuned swells",
    oscillators: [
      { type: "sine", frequency: 146.83, detune: 6, gain: 0.13, lfoRate: 0.03, lfoDepth: 2 },
      { type: "sine", frequency: 220, detune: -8, gain: 0.09, lfoRate: 0.05, lfoDepth: 3 },
      { type: "triangle", frequency: 293.66, detune: 4, gain: 0.06, lfoRate: 0.07, lfoDepth: 1.5 },
      { type: "sine", frequency: 440, detune: -6, gain: 0.035, lfoRate: 0.1, lfoDepth: 2 },
      { type: "sine", frequency: 587.33, detune: 9, gain: 0.02, lfoRate: 0.14, lfoDepth: 1 },
    ],
    filter: { type: "lowpass", frequency: 700, Q: 1.8, lfoRate: 0.02, lfoDepth: 250 },
    reverb: { decay: 6, wet: 0.7 },
    master: { gain: 0.6, pan: 0 },
  },
  {
    id: "terminal-velocity",
    name: "Terminal Velocity",
    artist: "Generative Audio",
    bpm: 120,
    description: "Driving rhythmic pulses with forward momentum",
    oscillators: [
      { type: "sine", frequency: 110, detune: 0, gain: 0.12, lfoRate: 0.2, lfoDepth: 5 },
      { type: "triangle", frequency: 220, detune: 3, gain: 0.08, lfoRate: 0.15, lfoDepth: 3 },
      { type: "sine", frequency: 330, detune: -5, gain: 0.05, lfoRate: 0.25, lfoDepth: 4 },
      { type: "sine", frequency: 440, detune: 7, gain: 0.03, lfoRate: 0.3, lfoDepth: 2 },
      { type: "triangle", frequency: 660, detune: -3, gain: 0.02, lfoRate: 0.35, lfoDepth: 1.5 },
    ],
    filter: { type: "bandpass", frequency: 1200, Q: 1, lfoRate: 0.08, lfoDepth: 700 },
    reverb: { decay: 3, wet: 0.35 },
    master: { gain: 0.55, pan: 0 },
  },
];

export class MusicGenerator {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private panner: StereoPannerNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private lfoOscillators: OscillatorNode[] = [];
  private lfoGains: GainNode[] = [];
  private filter: BiquadFilterNode | null = null;
  private filterLfo: OscillatorNode | null = null;
  private filterLfoGain: GainNode | null = null;
  private convolver: ConvolverNode | null = null;
  private convolverGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private wetGain: GainNode | null = null;
  private currentPreset: TrackPreset | null = null;
  private isPlaying = false;
  private fadeTime = 2;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;

  getContext(): AudioContext | null {
    return this.ctx;
  }

  getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  async init(): Promise<void> {
    if (this.ctx) return;
    this.ctx = new AudioContext();

    // Master chain: sources -> filter -> dry/wet reverb -> masterGain -> analyser -> panner -> destination
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;

    this.panner = this.ctx.createStereoPanner();
    this.panner.pan.value = 0;

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 1000;
    this.filter.Q.value = 1;

    // Reverb
    this.convolver = this.ctx.createConvolver();
    this.convolverGain = this.ctx.createGain();
    this.dryGain = this.ctx.createGain();
    this.wetGain = this.ctx.createGain();

    // Generate impulse response
    await this.createReverbImpulse(4);

    this.dryGain.gain.value = 0.5;
    this.wetGain.gain.value = 0.5;

    // Routing: filter -> [dryGain -> destination] + [convolver -> wetGain -> destination]
    // But we need: filter -> split(dry, wet) -> masterGain -> analyser -> panner -> dest
    this.filter.connect(this.dryGain);
    this.filter.connect(this.convolver);
    this.convolver.connect(this.convolverGain);
    this.convolverGain.connect(this.wetGain);
    this.dryGain.connect(this.masterGain);
    this.wetGain.connect(this.masterGain);
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.panner);
    this.panner.connect(this.ctx.destination);
  }

  private async createReverbImpulse(decay: number): Promise<void> {
    if (!this.ctx || !this.convolver) return;
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * decay;
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t / (decay * 0.5));
      left[i] = (Math.random() * 2 - 1) * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }
    this.convolver.buffer = impulse;
  }

  private createNoiseBuffer(duration: number): AudioBuffer {
    if (!this.ctx) throw new Error("No context");
    const sampleRate = this.ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  async play(preset: TrackPreset): Promise<void> {
    await this.init();
    if (!this.ctx || !this.filter || !this.masterGain) return;

    // Stop current
    this.stop(0.5);

    this.currentPreset = preset;
    this.ctx.resume();

    // Filter LFO
    if (preset.filter.lfoRate && preset.filter.lfoDepth) {
      this.filterLfo = this.ctx.createOscillator();
      this.filterLfoGain = this.ctx.createGain();
      this.filterLfo.type = "sine";
      this.filterLfo.frequency.value = preset.filter.lfoRate;
      this.filterLfoGain.gain.value = preset.filter.lfoDepth;
      this.filterLfo.connect(this.filterLfoGain);
      this.filterLfoGain.connect(this.filter.frequency);
      this.filterLfo.start();
    }

    this.filter.type = preset.filter.type;
    this.filter.frequency.value = preset.filter.frequency;
    this.filter.Q.value = preset.filter.Q;

    // Reverb
    if (this.convolver && this.dryGain && this.wetGain && this.convolverGain) {
      await this.createReverbImpulse(preset.reverb.decay);
      this.dryGain.gain.value = 1 - preset.reverb.wet;
      this.wetGain.gain.value = preset.reverb.wet;
    }

    // Create oscillators
    for (const osc of preset.oscillators) {
      const oscNode = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      oscNode.type = osc.type;
      oscNode.frequency.value = osc.frequency;
      oscNode.detune.value = osc.detune;
      gainNode.gain.value = 0;

      oscNode.connect(gainNode);
      gainNode.connect(this.filter);

      // LFO for pitch modulation
      if (osc.lfoRate && osc.lfoDepth) {
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = "sine";
        lfo.frequency.value = osc.lfoRate;
        lfoGain.gain.value = osc.lfoDepth;
        lfo.connect(lfoGain);
        lfoGain.connect(oscNode.frequency);
        lfo.start();
        this.lfoOscillators.push(lfo);
        this.lfoGains.push(lfoGain);
      }

      // Fade in
      const now = this.ctx.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(osc.gain, now + this.fadeTime);

      oscNode.start();
      this.oscillators.push(oscNode);
      this.gains.push(gainNode);
    }

    // Subtle noise layer
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.value = 0;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = preset.filter.frequency * 0.5;
    noiseFilter.Q.value = 3;
    this.noiseGain.connect(noiseFilter);
    noiseFilter.connect(this.filter);

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = this.createNoiseBuffer(10);
    this.noiseNode.loop = true;
    this.noiseNode.connect(this.noiseGain);

    const now = this.ctx.currentTime;
    this.noiseGain.gain.setValueAtTime(0, now);
    this.noiseGain.gain.linearRampToValueAtTime(0.015, now + this.fadeTime);
    this.noiseNode.start();

    // Fade in master
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(preset.master.gain, now + this.fadeTime);

    this.isPlaying = true;
  }

  stop(fadeTime?: number): void {
    if (!this.ctx || !this.masterGain) return;
    const fade = fadeTime ?? this.fadeTime;
    const now = this.ctx.currentTime;

    // Fade out master
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + fade);

    // Schedule cleanup
    setTimeout(() => {
      this.oscillators.forEach((o) => {
        try { o.stop(); } catch {}
      });
      this.lfoOscillators.forEach((o) => {
        try { o.stop(); } catch {}
      });
      if (this.noiseNode) {
        try { this.noiseNode.stop(); } catch {}
      }
      this.oscillators = [];
      this.gains = [];
      this.lfoOscillators = [];
      this.lfoGains = [];
      this.noiseNode = null;
      this.noiseGain = null;
    }, fade * 1000 + 100);

    this.isPlaying = false;
  }

  setVolume(vol: number): void {
    if (!this.masterGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(vol, now + 0.1);
  }

  setFilterFrequency(freq: number): void {
    if (!this.filter || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.filter.frequency.cancelScheduledValues(now);
    this.filter.frequency.setValueAtTime(this.filter.frequency.value, now);
    this.filter.frequency.linearRampToValueAtTime(freq, now + 0.3);
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentPreset(): TrackPreset | null {
    return this.currentPreset;
  }

  getPresets(): TrackPreset[] {
    return PRESETS;
  }

  destroy(): void {
    this.stop(0);
    if (this.ctx) {
      setTimeout(() => {
        this.ctx?.close();
        this.ctx = null;
      }, 200);
    }
  }
}

export const musicGenerator = new MusicGenerator();
export { PRESETS };
