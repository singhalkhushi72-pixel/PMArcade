import { District, Level, Flashcard, Question, PlayerArcadeProfile, BossMonster } from '../types';

const API_BASE = '/api';

export const api = {
  getDistricts: async (): Promise<District[]> => {
    const res = await fetch(`${API_BASE}/districts`);
    if (!res.ok) throw new Error('Failed to load districts from Product City');
    return res.json();
  },

  getDistrictById: async (id: string): Promise<District & { levels: Level[] }> => {
    const res = await fetch(`${API_BASE}/districts/${id}`);
    if (!res.ok) throw new Error('Failed to load district details');
    return res.json();
  },

  deleteDistrict: async (id: string): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE}/districts/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Cannot delete core Foundry district');
    return res.json();
  },

  uploadFiles: async (files: File[]): Promise<{ success: boolean; districts: District[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload presentation');
    }
    return res.json();
  },

  getLevel: async (districtId: string, levelNum: number): Promise<Level & { flashcards: Flashcard[]; questions: Question[] }> => {
    const res = await fetch(`${API_BASE}/levels/district/${districtId}/level/${levelNum}`);
    if (!res.ok) throw new Error('Failed to load node grid');
    return res.json();
  },

  getDueFlashcards: async (districtId?: string): Promise<Flashcard[]> => {
    const url = districtId ? `${API_BASE}/flashcards/due?districtId=${districtId}` : `${API_BASE}/flashcards/due`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load holographic flashcards');
    return res.json();
  },

  reviewFlashcard: async (id: string, rating: 'again' | 'good' | 'easy'): Promise<{ success: boolean; card: Flashcard; profile: PlayerArcadeProfile }> => {
    const res = await fetch(`${API_BASE}/flashcards/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    if (!res.ok) throw new Error('Failed to update neural memory');
    return res.json();
  },

  submitLevelBattle: async (payload: {
    levelId: string;
    districtId: string;
    answers: Record<string, string>;
    timeSpentSeconds?: number;
    shieldsLostInBattle?: number;
    maxCombo?: number;
  }) => {
    const res = await fetch(`${API_BASE}/battle/level/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit combat results');
    return res.json();
  },

  getBossBattle: async (districtId: string): Promise<{ boss: BossMonster; questions: Question[] }> => {
    const res = await fetch(`${API_BASE}/battle/boss/${districtId}`);
    if (!res.ok) throw new Error('Failed to summon Boss Monster');
    return res.json();
  },

  submitBossBattle: async (districtId: string, answers: Record<string, string>) => {
    const res = await fetch(`${API_BASE}/battle/boss/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ districtId, answers }),
    });
    if (!res.ok) throw new Error('Failed to submit boss strike');
    return res.json();
  },

  askPixel: async (levelId: string, districtId: string, question: string): Promise<{ answer: string; mascot: string }> => {
    const res = await fetch(`${API_BASE}/pixel/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ levelId, districtId, question }),
    });
    if (!res.ok) throw new Error('Pixel transmitter signal lost');
    return res.json();
  },

  getProfile: async (): Promise<PlayerArcadeProfile> => {
    const res = await fetch(`${API_BASE}/profile`);
    if (!res.ok) throw new Error('Failed to load arcade profile');
    return res.json();
  },

  deductShield: async (): Promise<{ shields: number }> => {
    const res = await fetch(`${API_BASE}/profile/deduct-shield`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to deduct cyber-shield');
    return res.json();
  },

  rechargeShields: async (): Promise<{ shields: number }> => {
    const res = await fetch(`${API_BASE}/profile/recharge-shields`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to recharge shields');
    return res.json();
  },

  resetProgress: async (): Promise<{ success: boolean; profile: PlayerArcadeProfile }> => {
    const res = await fetch(`${API_BASE}/profile/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset profile');
    return res.json();
  },

  checkHealth: async (): Promise<{ status: string; geminiKeySet: boolean }> => {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Arcade mainframe offline');
    return res.json();
  }
};
