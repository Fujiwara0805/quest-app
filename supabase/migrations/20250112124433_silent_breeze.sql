/*
  # Setup test users with proper authentication

  1. Changes
    - Enable required extensions
    - Remove existing test users
    - Create test users with proper authentication
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Remove existing test users and their profiles
DELETE FROM Users WHERE email IN ('test.user@example.com');
DELETE FROM QuestMasters WHERE email IN ('test.master@example.com');
DELETE FROM auth.users WHERE email IN ('test.user@example.com', 'test.master@example.com');

-- Create test user
DO $$
DECLARE
    test_user_id UUID := uuid_generate_v4();
BEGIN
    -- Insert into auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        test_user_id,
        'test.user@example.com',
        crypt('testuser123', gen_salt('bf')),
        now(),
        '{"email":"test.user@example.com"}'::jsonb,
        now(),
        now()
    );

    -- Insert into Users profile table
    INSERT INTO Users (
        id,
        name,
        email,
        skills,
        interests
    ) VALUES (
        test_user_id,
        'テストユーザー',
        'test.user@example.com',
        ARRAY['プログラミング', '写真撮影'],
        ARRAY['テクノロジー', '芸術']
    );
END $$;

-- Create test quest master
DO $$
DECLARE
    test_master_id UUID := uuid_generate_v4();
BEGIN
    -- Insert into auth.users
    INSERT INTO auth.users (
        id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES (
        test_master_id,
        'test.master@example.com',
        crypt('testmaster123', gen_salt('bf')),
        now(),
        '{"email":"test.master@example.com"}'::jsonb,
        now(),
        now()
    );

    -- Insert into QuestMasters profile table
    INSERT INTO QuestMasters (
        id,
        company_name,
        contact_person,
        email,
        industry
    ) VALUES (
        test_master_id,
        'テスト株式会社',
        'テスト太郎',
        'test.master@example.com',
        'IT'
    );
END $$;