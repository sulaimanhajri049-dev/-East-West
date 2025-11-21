
// Sound URLs (Public Domain / Creative Commons from reliable CDNs)
const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  correct: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success chime
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Error buzzer
  tick: 'https://assets.mixkit.co/active_storage/sfx/2578/2578-preview.mp3', // Clock tick
  win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Victory sound
  timeUp: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Same as wrong/fail
  lifeline: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Magic swoosh
};

class SoundManager {
  private audioCache: Record<string, HTMLAudioElement> = {};
  private muted: boolean = false;

  constructor() {
    // Preload sounds
    Object.entries(SOUNDS).forEach(([key, url]) => {
      this.audioCache[key] = new Audio(url);
      this.audioCache[key].volume = 0.5;
    });
  }

  play(key: keyof typeof SOUNDS) {
    if (this.muted) return;
    const audio = this.audioCache[key];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.warn('Audio play failed', e));
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

export const soundManager = new SoundManager();
