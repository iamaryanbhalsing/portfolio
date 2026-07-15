interface AudioState {
  bass: number;
  mid: number;
  treble: number;
  energy: number;
  isPlaying: boolean;
  bpm: number;
}

function createAudioState(): AudioState & { update: (s: Partial<AudioState>) => void } {
  const state: AudioState = {
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
    isPlaying: false,
    bpm: 80,
  };

  return {
    ...state,
    update(partial: Partial<AudioState>) {
      Object.assign(state, partial);
    },
    get bass() {
      return state.bass;
    },
    get mid() {
      return state.mid;
    },
    get treble() {
      return state.treble;
    },
    get energy() {
      return state.energy;
    },
    get isPlaying() {
      return state.isPlaying;
    },
    get bpm() {
      return state.bpm;
    },
  };
}

export const audioState = createAudioState();
