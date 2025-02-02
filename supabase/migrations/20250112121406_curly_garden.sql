/*
  # Initial Schema Setup for QUEST System

  1. New Tables
    - Users (ユーザー情報)
    - QuestMasters (クエストマスター情報)
    - Quests (クエスト情報)
    - Applications (応募情報)
    - Approvals (承認情報)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS Users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  skills TEXT[],
  interests TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- QuestMasters table
CREATE TABLE IF NOT EXISTS QuestMasters (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  industry TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quests table
CREATE TABLE IF NOT EXISTS Quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward INTEGER NOT NULL,
  location TEXT NOT NULL,
  work_time TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  required_skills TEXT[],
  status TEXT NOT NULL DEFAULT 'open',
  quest_master_id UUID NOT NULL REFERENCES QuestMasters(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS Applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES Users(id),
  quest_id UUID NOT NULL REFERENCES Quests(id),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Approvals table
CREATE TABLE IF NOT EXISTS Approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES Applications(id),
  approved_by UUID NOT NULL REFERENCES QuestMasters(id),
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE Users ENABLE ROW LEVEL SECURITY;
ALTER TABLE QuestMasters ENABLE ROW LEVEL SECURITY;
ALTER TABLE Quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE Applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE Approvals ENABLE ROW LEVEL SECURITY;

-- Users Policies
CREATE POLICY "Users can read own data"
  ON Users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON Users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- QuestMasters Policies
CREATE POLICY "QuestMasters can read own data"
  ON QuestMasters FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "QuestMasters can update own data"
  ON QuestMasters FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Quests Policies
CREATE POLICY "Anyone can read published quests"
  ON Quests FOR SELECT
  TO authenticated
  USING (status = 'open');

CREATE POLICY "QuestMasters can CRUD own quests"
  ON Quests FOR ALL
  TO authenticated
  USING (quest_master_id = auth.uid());

-- Applications Policies
CREATE POLICY "Users can read own applications"
  ON Applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "QuestMasters can read applications for their quests"
  ON Applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM Quests
      WHERE Quests.id = Applications.quest_id
      AND Quests.quest_master_id = auth.uid()
    )
  );

-- Approvals Policies
CREATE POLICY "Users can read own approvals"
  ON Approvals FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM Applications
      WHERE Applications.id = Approvals.application_id
      AND Applications.user_id = auth.uid()
    )
  );

CREATE POLICY "QuestMasters can CRUD approvals for their quests"
  ON Approvals FOR ALL
  TO authenticated
  USING (approved_by = auth.uid());