-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update test user password
UPDATE auth.users
SET raw_user_meta_data = '{"email":"test.user@example.com"}',
    encrypted_password = crypt('testuser123', gen_salt('bf')),
    email_confirmed_at = now(),
    confirmation_token = '',
    recovery_token = ''
WHERE email = 'test.user@example.com';

-- Update test quest master password
UPDATE auth.users
SET raw_user_meta_data = '{"email":"test.master@example.com"}',
    encrypted_password = crypt('testmaster123', gen_salt('bf')),
    email_confirmed_at = now(),
    confirmation_token = '',
    recovery_token = ''
WHERE email = 'test.master@example.com';