
import { Category } from './types';
import { Flag, BookOpen, Home, Globe, MessageCircle, Atom, Calculator, HelpCircle, Scroll, Trophy, Car, Activity, Cat, Tv, Palette, Apple, Landmark, Map, Zap, PenTool } from 'lucide-react';

export const CATEGORY_ICONS: Record<Category, any> = {
  [Category.FLAGS]: Flag,
  [Category.GENERAL]: Globe,
  [Category.QURAN]: BookOpen,
  [Category.HADITH]: Scroll,
  [Category.HOUSE]: Home,
  [Category.CIVILIZATION]: Globe, 
  [Category.RIDDLES]: HelpCircle,
  [Category.DIALECTS]: MessageCircle,
  [Category.SCIENCE]: Atom,
  [Category.MATH]: Calculator,
  [Category.FOOTBALL]: Trophy,
  [Category.CARS]: Car,
  
  // Kids
  [Category.ANIMALS]: Cat,
  [Category.CARTOONS]: Tv,
  [Category.COLORS_SHAPES]: Palette,
  [Category.FRUITS_VEG]: Apple,

  // Students
  [Category.HISTORY]: Landmark,
  [Category.GEOGRAPHY]: Map,
  [Category.PHYSICS]: Zap,
  [Category.ARABIC]: PenTool,
};

export const TEAM_AVATARS = [
  '🦁', '🦅', '🐺', '🦂', '🐎', '🦈', '🐉', '🐪'
];

export const INITIAL_TEAMS_STATE = {
  A: { id: 'A', name: 'Team A', avatar: '🦁', members: [], totalScore: 0 },
  B: { id: 'B', name: 'Team B', avatar: '🦅', members: [], totalScore: 0 },
};

// High quality fallback images specific to each category
export const CATEGORY_FALLBACKS: Record<Category, string> = {
  [Category.FLAGS]: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80', 
  [Category.GENERAL]: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80', 
  [Category.QURAN]: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=800&q=80', 
  [Category.HADITH]: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7fe?w=800&q=80', 
  [Category.HOUSE]: 'https://images.unsplash.com/photo-1484154218962-a1c00207099b?w=800&q=80', 
  [Category.CIVILIZATION]: 'https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=800&q=80', 
  [Category.RIDDLES]: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80', 
  [Category.DIALECTS]: 'https://images.unsplash.com/photo-1555447405-4d726f687271?w=800&q=80', 
  [Category.SCIENCE]: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80', 
  [Category.MATH]: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80', 
  [Category.FOOTBALL]: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', 
  [Category.CARS]: 'https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80',
  
  // Kids Fallbacks
  [Category.ANIMALS]: 'https://images.unsplash.com/photo-1472491235688-bdc81a63246e?w=800&q=80',
  [Category.CARTOONS]: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=800&q=80',
  [Category.COLORS_SHAPES]: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80',
  [Category.FRUITS_VEG]: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80',

  // Student Fallbacks
  [Category.HISTORY]: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80',
  [Category.GEOGRAPHY]: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80',
  [Category.PHYSICS]: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80',
  [Category.ARABIC]: 'https://images.unsplash.com/photo-1523293836414-90ec834c1740?w=800&q=80',
};

export const getQuestionImageUrl = (imageUrl?: string): string => {
  if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('data:'))) {
    return imageUrl;
  }
  return '';
};

// --- Category Lists per Mode ---

export const KIDS_CATEGORIES = [
  Category.QURAN,
  Category.ANIMALS,
  Category.CARTOONS,
  Category.COLORS_SHAPES,
  Category.FRUITS_VEG,
  Category.GENERAL,
  Category.FOOTBALL,
  Category.CARS,
];

export const STUDENT_CATEGORIES = [
  Category.QURAN,
  Category.HISTORY,
  Category.GEOGRAPHY,
  Category.PHYSICS,
  Category.SCIENCE,
  Category.MATH,
  Category.ARABIC,
  Category.FLAGS,
  Category.GENERAL,
  Category.CIVILIZATION,
];

export const CLASSIC_CATEGORIES = [
  Category.FLAGS,
  Category.GENERAL,
  Category.QURAN,
  Category.HADITH,
  Category.HOUSE,
  Category.CIVILIZATION,
  Category.RIDDLES,
  Category.DIALECTS,
  Category.SCIENCE,
  Category.MATH,
  Category.FOOTBALL,
  Category.CARS,
];
