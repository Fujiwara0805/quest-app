-- Set password for test user
UPDATE auth.users
SET encrypted_password = crypt('testuser123', gen_salt('bf'))
WHERE email = 'test.user@example.com';

-- Set password for test quest master
UPDATE auth.users
SET encrypted_password = crypt('testmaster123', gen_salt('bf'))
WHERE email = 'test.master@example.com';