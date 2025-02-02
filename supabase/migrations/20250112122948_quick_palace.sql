-- Create a test user
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000001', 'test.user@example.com');

INSERT INTO Users (id, name, email, skills, interests)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'テストユーザー',
  'test.user@example.com',
  ARRAY['プログラミング', '写真撮影'],
  ARRAY['テクノロジー', '芸術']
);

-- Create a test quest master
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000002', 'test.master@example.com');

INSERT INTO QuestMasters (id, company_name, contact_person, email, industry)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'テスト株式会社',
  'テスト太郎',
  'test.master@example.com',
  'IT'
);