export type QuestionFormat = 'mcq' | 'true_false' | 'fill_blank' | 'scenario';

export interface BossMonster {
  id: string;
  district_id: string;
  name: string; // e.g. "THE SCOPE CREEP", "CHURN GOLIATH", "THE TECH DEBT HYDRA"
  title: string; // e.g. "Eater of Roadmaps & Destroyer of Sprints"
  avatar_type: 'scope_creep' | 'churn_goliath' | 'tech_debt' | 'over_engineer';
  max_hp: number;
  current_hp?: number;
  health?: number;
  weakness: string;
  defeat_xp: number;
  completed: boolean;
  defeated?: boolean;
  high_score?: number;
  color: string;
  attack_power?: number;
  special_move?: string;
  description?: string;
}

export interface Question {
  id: string;
  level_id: string;
  district_id: string;
  format: QuestionFormat;
  question_type?: string;
  question: string;
  question_text?: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  slide_ref: string;
  slide_reference?: string;
  difficulty?: string;
  damage?: number; // e.g. 25 damage to boss
  is_boss?: boolean;
}

export interface Flashcard {
  id: string;
  level_id: string;
  district_id: string;
  front: string;
  back: string;
  slide_ref: string;
  slide_reference?: string;
  category?: string;
  ease_factor: number;
  interval: number;
  repetitions: number;
  next_review: string;
  status?: 'new' | 'learning' | 'mastered';
}

export interface Level {
  id: string;
  district_id: string;
  order_num: number;
  level_number?: number;
  title: string;
  code_name: string; // e.g. "NODE-01: RETRIEVAL MATRIX"
  explanation: string;
  content?: string;
  summary?: string;
  analogy: string;
  product_example: string;
  real_world_example?: string;
  slide_refs: string;
  slide_reference?: string;
  unlocked: boolean;
  completed: boolean;
  xp_reward?: number;
  high_score?: number;
  stars?: number;
  flashcards?: Flashcard[];
  questions?: Question[];
}

export interface District {
  id: string;
  title: string;
  tagline: string;
  description?: string;
  arcade_cabinet_color: string;
  neon_glow: string;
  cyber_theme?: string;
  district_order?: number;
  source_filename: string;
  total_slides: number;
  raw_text: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  created_at: string;
  is_demo?: boolean;
  levels?: Level[];
  boss: BossMonster;
}

export interface RetroAchievement {
  id: string;
  title: string;
  desc: string;
  description?: string;
  badge_code: string;
  icon: string;
  xp_value?: number;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface PlayerArcadeProfile {
  handle: string; // e.g. "CYBER_FOUNDER"
  callsign?: string;
  credits_xp: number;
  credits?: number;
  total_score?: number;
  level: number;
  rank_title: string; // "Rookie Founder", "Seed Hacker", "Series A Slayer", "Unicorn Warlord"
  rank?: string;
  streak_days: number;
  last_active_date: string;
  shields: number; // 5 shields
  max_shields: number;
  highest_combo: number;
  bosses_defeated: number;
  completed_level_ids: string[];
  completed_district_ids: string[];
  badges: RetroAchievement[];
  achievements?: RetroAchievement[];
}
