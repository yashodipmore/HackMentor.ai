-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for embeddings (RAG)
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'team', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settings JSONB DEFAULT '{
    "voice_enabled": true,
    "health_reminders": true,
    "auto_review_interval": 30
  }'::jsonb,
  skill_level JSONB DEFAULT '{
    "react": 0,
    "typescript": 0,
    "node": 0,
    "python": 0
  }'::jsonb
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INT DEFAULT 0,
  screen_frames_analyzed INT DEFAULT 0,
  suggestions_given INT DEFAULT 0,
  code_quality_score DECIMAL(3,1),
  health_score DECIMAL(3,1),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- AI Interactions table
CREATE TABLE ai_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  interaction_type TEXT CHECK (interaction_type IN ('suggestion', 'question', 'review', 'health_alert')),
  ai_message TEXT,
  user_response TEXT,
  code_context TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Code Reviews table
CREATE TABLE code_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  overall_score DECIMAL(3,1),
  issues JSONB[] DEFAULT ARRAY[]::jsonb[],
  strengths TEXT[] DEFAULT ARRAY[]::text[],
  cost_impact DECIMAL(10,2),
  carbon_impact DECIMAL(10,2),
  previous_score DECIMAL(3,1)
);

-- Screen Captures table
CREATE TABLE screen_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  image_url TEXT,
  analysis_result JSONB DEFAULT '{}'::jsonb,
  processed BOOLEAN DEFAULT FALSE
);

-- Knowledge Base table (for RAG)
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT,
  title TEXT,
  content TEXT,
  embedding vector(1024),
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill TEXT,
  level INT CHECK (level >= 0 AND level <= 100),
  xp_points INT DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  milestones_completed TEXT[] DEFAULT ARRAY[]::text[]
);

-- Create indexes for better performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_ai_interactions_session_id ON ai_interactions(session_id);
CREATE INDEX idx_code_reviews_user_id ON code_reviews(user_id);
CREATE INDEX idx_screen_captures_session_id ON screen_captures(session_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);

-- Create vector similarity search function for RAG
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1024),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  category text,
  title text,
  content text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    category,
    title,
    content,
    1 - (knowledge_base.embedding <=> query_embedding) as similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE screen_captures ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own interactions" ON ai_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM sessions 
      WHERE sessions.id = ai_interactions.session_id 
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own reviews" ON code_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);
