
import type { User as SupabaseUserType } from "@supabase/supabase-js";

export type User = SupabaseUserType;

export type LifestyleType = "food" | "water" | "sleep" | "exercise" | "habit" | "weight";

export interface LifestyleGoal {
  id: string;
  userId: string; // Will be Supabase user ID
  date: string; // ISO string for date
  type: LifestyleType;
  name?: string; // e.g. "Morning Meditation" for habit
  value: number | string | boolean; // e.g., for water: ml, sleep: hours, food: description/calories, habit: completed(boolean)
  targetValue?: number | string;
  unit?: string; // e.g. "ml", "hours", "kcal", "minutes"
  notes?: string;
  createdAt: number; // timestamp
}

export interface JournalEntry {
  id:string;
  userId: string; // Will be Supabase user ID
  date: string; // ISO string for date
  content: string;
  sentimentScore?: number;
  sentimentAnalysis?: string;
  isFlagged?: boolean;
  createdAt: number; // timestamp
}

export interface PHQ9Answer {
  questionIndex: number; // 0-indexed
  score: 0 | 1 | 2 | 3;
}

export interface PHQ9Record {
  id: string;
  userId: string; // Will be Supabase user ID
  date: string; // ISO string for date
  answers: PHQ9Answer[];
  totalScore: number;
  intervention?: string;
  severityLevel?: string; // Added severity level
  conversationHistory?: { user: string; bot: string }[];
  createdAt: number; // timestamp
}

    