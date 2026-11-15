import { create } from 'zustand';
import { PlayerArcadeProfile, RetroAchievement } from '../types';
import { api } from '../services/api';

interface ArcadeState {
  profile: PlayerArcadeProfile | null;
  loading: boolean;
  soundEnabled: boolean;
  crtEnabled: boolean;
  theme: 'cyber' | 'sunset';
  currentCombo: number;
  newLevelNotice: number | null;
  unlockedBadgeNotice: RetroAchievement | null;
  shields: number;

  fetchProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileLocally: (newProfile: PlayerArcadeProfile) => void;
  deductShield: () => Promise<number>;
  setShields: (shields: number) => void;
  rechargeShields: () => Promise<void>;
  addCredits: (credits: number) => void;
  toggleSound: () => void;
  toggleCrt: () => void;
  toggleTheme: () => void;
  setCombo: (combo: number) => void;
  incrementCombo: () => number;
  resetCombo: () => void;
  clearLevelNotice: () => void;
  clearBadgeNotice: () => void;
  resetAll: () => Promise<void>;
}

export const useArcadeStore = create<ArcadeState>((set, get) => {
  const savedSound = localStorage.getItem('pm_arcade_sound');
  const savedCrt = localStorage.getItem('pm_arcade_crt');
  const savedTheme = localStorage.getItem('pm_arcade_theme') as 'cyber' | 'sunset' | null;

  const soundEnabled = savedSound !== null ? savedSound === 'true' : true;
  const crtEnabled = savedCrt !== null ? savedCrt === 'true' : true;
  const theme = savedTheme || 'cyber';

  if (typeof document !== 'undefined') {
    if (theme === 'sunset') {
      document.documentElement.classList.add('theme-sunset');
    } else {
      document.documentElement.classList.remove('theme-sunset');
    }
  }

  return {
    profile: null,
    loading: true,
    soundEnabled,
    crtEnabled,
    theme,
    currentCombo: 0,
    newLevelNotice: null,
    unlockedBadgeNotice: null,
    shields: 5,

    fetchProfile: async () => {
      try {
        set({ loading: true });
        const profile = await api.getProfile();
        set({ profile, shields: profile.shields, loading: false });
      } catch (err) {
        console.error('Failed to load arcade profile:', err);
        set({ loading: false });
      }
    },

    refreshProfile: async () => {
      try {
        const profile = await api.getProfile();
        set({ profile, shields: profile.shields });
      } catch (err) {
        console.error('Failed to refresh profile:', err);
      }
    },

    updateProfileLocally: (newProfile: PlayerArcadeProfile) => {
      const current = get().profile;
      if (current && newProfile.level > current.level) {
        set({ newLevelNotice: newProfile.level });
      }
      set({ profile: newProfile, shields: newProfile.shields });
    },

    setShields: (shields: number) => {
      set((s) => ({
        shields,
        profile: s.profile ? { ...s.profile, shields } : null
      }));
    },

    addCredits: (credits: number) => {
      set((s) => {
        if (!s.profile) return s;
        const currentCredits = s.profile.credits ?? s.profile.credits_xp ?? 0;
        const currentScore = s.profile.total_score ?? s.profile.credits_xp ?? 0;
        return {
          profile: {
            ...s.profile,
            credits: currentCredits + credits,
            credits_xp: currentCredits + credits,
            total_score: currentScore + credits
          }
        };
      });
    },

    deductShield: async () => {
      try {
        const res = await api.deductShield();
        set((s) => ({
          shields: res.shields,
          profile: s.profile ? { ...s.profile, shields: res.shields } : null,
          currentCombo: 0 // combo broken on shield damage!
        }));
        return res.shields;
      } catch (err) {
        console.error('Shield reduction failed:', err);
        return 0;
      }
    },

    rechargeShields: async () => {
      try {
        const res = await api.rechargeShields();
        set((s) => ({
          shields: res.shields,
          profile: s.profile ? { ...s.profile, shields: res.shields } : null
        }));
      } catch (err) {
        console.error('Recharge failed:', err);
      }
    },

    toggleSound: () => {
      const next = !get().soundEnabled;
      localStorage.setItem('pm_arcade_sound', String(next));
      set({ soundEnabled: next });
    },

    toggleCrt: () => {
      const next = !get().crtEnabled;
      localStorage.setItem('pm_arcade_crt', String(next));
      set({ crtEnabled: next });
    },

    toggleTheme: () => {
      const next = get().theme === 'cyber' ? 'sunset' : 'cyber';
      localStorage.setItem('pm_arcade_theme', next);
      if (typeof document !== 'undefined') {
        if (next === 'sunset') {
          document.documentElement.classList.add('theme-sunset');
        } else {
          document.documentElement.classList.remove('theme-sunset');
        }
      }
      set({ theme: next });
    },

    setCombo: (combo: number) => set({ currentCombo: combo }),

    incrementCombo: () => {
      const next = get().currentCombo + 1;
      set({ currentCombo: next });
      return next;
    },

    resetCombo: () => set({ currentCombo: 0 }),

    clearLevelNotice: () => set({ newLevelNotice: null }),
    clearBadgeNotice: () => set({ unlockedBadgeNotice: null }),

    resetAll: async () => {
      try {
        const res = await api.resetProgress();
        set({ profile: res.profile, currentCombo: 0 });
      } catch (err) {
        console.error('Reset arcade failed:', err);
      }
    }
  };
});
