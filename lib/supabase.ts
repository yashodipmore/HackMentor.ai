import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro' | 'team' | 'enterprise';
  created_at: string;
  settings: {
    voice_enabled: boolean;
    health_reminders: boolean;
    auto_review_interval: number;
  };
  skill_level: {
    react: number;
    typescript: number;
    node: number;
    python: number;
  };
}

export interface Session {
  id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration_seconds: number;
  screen_frames_analyzed: number;
  suggestions_given: number;
  code_quality_score?: number;
  health_score?: number;
  metadata: Record<string, any>;
}

export interface AIInteraction {
  id: string;
  session_id: string;
  timestamp: string;
  interaction_type: 'suggestion' | 'question' | 'review' | 'health_alert';
  ai_message?: string;
  user_response?: string;
  code_context?: string;
  metadata: Record<string, any>;
}

export interface CodeReview {
  id: string;
  session_id: string;
  user_id: string;
  created_at: string;
  overall_score: number;
  issues: any[];
  strengths: string[];
  cost_impact: number;
  carbon_impact: number;
  previous_score?: number;
}

export interface ScreenCapture {
  id: string;
  session_id: string;
  captured_at: string;
  image_url?: string;
  analysis_result: Record<string, any>;
  processed: boolean;
}
