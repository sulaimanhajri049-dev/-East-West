
export enum GamePhase {
  LOGIN = 'LOGIN',
  MAIN_MENU = 'MAIN_MENU',
  SETUP = 'SETUP',
  ONLINE_MENU = 'ONLINE_MENU',
  DIFFICULTY = 'DIFFICULTY',
  CATEGORY = 'CATEGORY',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  ROUND_SUMMARY = 'ROUND_SUMMARY',
  GAME_OVER = 'GAME_OVER',
}

export type GameMode = 'CLASSIC' | 'KIDS' | 'STUDENTS' | 'LOCAL_TOURNAMENT';
export type Language = 'ar' | 'en';

export interface User {
  email: string;
  name: string;
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  IMPOSSIBLE = 'IMPOSSIBLE',
}

export enum Category {
  // Classic / Shared
  FLAGS = 'FLAGS',
  GENERAL = 'GENERAL',
  QURAN = 'QURAN',
  HADITH = 'HADITH',
  HOUSE = 'HOUSE',
  CIVILIZATION = 'CIVILIZATION',
  RIDDLES = 'RIDDLES',
  DIALECTS = 'DIALECTS',
  SCIENCE = 'SCIENCE',
  MATH = 'MATH',
  FOOTBALL = 'FOOTBALL',
  CARS = 'CARS',

  // Kids Specific
  ANIMALS = 'ANIMALS',
  CARTOONS = 'CARTOONS',
  COLORS_SHAPES = 'COLORS_SHAPES',
  FRUITS_VEG = 'FRUITS_VEG',

  // Student Specific
  HISTORY = 'HISTORY',
  GEOGRAPHY = 'GEOGRAPHY',
  PHYSICS = 'PHYSICS',
  ARABIC = 'ARABIC',
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface Team {
  id: 'A' | 'B';
  name: string;
  avatar: string; // URL or Emoji
  members: Player[];
  totalScore: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string; // The actual text of the answer
  imageUrl: string; // Real URL from Google Search
  countryCode?: string; // For flags (e.g., 'SA', 'EG')
  explanation?: string;
}

export interface GameState {
  phase: GamePhase;
  gameMode?: GameMode;
  teams: {
    A: Team;
    B: Team;
  };
  settings: {
    difficulty: Difficulty | null;
    category: Category | Category[] | null;
    tournamentName?: string;
  };
  currentRound: {
    questions: Question[];
    currentQuestionIndex: number;
    usedLifelines: {
      teamA: LifelineType[];
      teamB: LifelineType[];
    };
    activeLifeline: LifelineType | null;
  };
}

export enum LifelineType {
  DOUBLE_CHANCE = 'DOUBLE_CHANCE',
  FIFTY_FIFTY = 'FIFTY_FIFTY',
  CHANGE_QUESTION = 'CHANGE_QUESTION',
}
