-- =============================================
-- SAMPLE USERS FOR ACHIEVEMENTS DATA
-- ✅ Create these users first, then use their UUIDs in achievements
-- =============================================

-- ⚠️ IMPORTANT: These are sample users for testing
-- In production, users should be created via Supabase Auth

-- 📝 STEP 1: Create users in Supabase Auth Dashboard
-- Go to Authentication → Users → Invite user
-- Create these test users:

/*
Email: student1@gitam.edu
Password: TestPass123!
(This will be UUID-1 - CS AI Student)

Email: student2@gitam.edu  
Password: TestPass123!
(This will be UUID-2 - Mechanical Robotics Student)

Email: student3@gitam.edu
Password: TestPass123!
(This will be UUID-3 - Biotechnology Student)

Email: student4@gitam.edu
Password: TestPass123!
(This will be UUID-4 - Mathematics Student)

Email: student5@gitam.edu
Password: TestPass123!
(This will be UUID-5 - Literature Student)

Email: student6@gitam.edu
Password: TestPass123!
(This will be UUID-6 - Sports Science Student)

Email: student7@gitam.edu
Password: TestPass123!
(This will be UUID-7 - Law Student)

Email: student8@gitam.edu
Password: TestPass123!
(This will be UUID-8 - Business Student)
*/

-- 📝 STEP 2: Get their UUIDs
-- SELECT id, email FROM auth.users ORDER BY created_at;

-- 📝 STEP 3: Insert user profiles (Replace UUIDs with real ones)
INSERT INTO public.users (
    id,
    name,
    roll_number_faculty_id,
    batch,
    school,
    branch,
    specialization,
    year_designation,
    email,
    contact,
    password_hash,
    is_admin,
    is_faculty
) VALUES
(
    'REPLACE-WITH-UUID-FROM-AUTH-USERS-1', -- Get from SELECT id FROM auth.users WHERE email = 'student1@gitam.edu'
    'Arjun Sharma',
    '220030001',
    '2022-2026',
    'School of Technology',
    'Computer Science Engineering',
    'Artificial Intelligence',
    '3rd Year',
    'student1@gitam.edu',
    '+91-9876543210',
    'hashed_password_placeholder', -- This won't be used with Supabase Auth
    false,
    false
),
(
    'REPLACE-WITH-UUID-FROM-AUTH-USERS-2',
    'Priya Reddy',
    '210040002',
    '2021-2025',
    'School of Technology',
    'Mechanical Engineering',
    'Robotics',
    '4th Year',
    'student2@gitam.edu',
    '+91-9876543211',
    'hashed_password_placeholder',
    false,
    false
),
(
    'REPLACE-WITH-UUID-FROM-AUTH-USERS-3',
    'Kavya Patel',
    '230050003',
    '2023-2027',
    'School of Science',
    'Biotechnology',
    'Medical Biotechnology',
    '2nd Year',
    'student3@gitam.edu',
    '+91-9876543212',
    'hashed_password_placeholder',
    false,
    false
),
(
    'REPLACE-WITH-UUID-FROM-AUTH-USERS-4',
    'Rohit Kumar',
    '220060004',
    '2022-2026',
    'School of Science',
    'Mathematics',
    'Applied Mathematics',
    '3rd Year',
    'student4@gitam.edu',
    '+91-9876543213',
    'hashed_password_placeholder',
    false,
    false
),
(
    'REPLACE-WITH-UUID-FROM-AUTH-USERS-5',
    'Sneha Gupta',
    '230070005',
    '2023-2027',
    'School of Humanities',
    'English Literature',
    'Creative Writing',
    '2nd Year',
    'student5@gitam.edu',
    '+91-9876543214',
    'hashed_password_placeholder',
    false,
    false
),
(
    'REPLACE-WITH-UUID-FROM-AUTH-USERS-6',
    'Vikram Singh',
    '220080006',
    '2022-2026',
    'School of Physical Education',
    'Sports Science',
    'Athletic Performance',
    '3rd Year',
    'student6@gitam.edu',
    '+91-9876543215',
    'hashed_password_placeholder',
    false,
    false
),
(
    'REPLACE-WITH-UUID-FROM-AUTH-USERS-7',
    'Ananya Nair',
    '210090007',
    '2021-2026',
    'School of Law',
    'Law',
    'Corporate Law',
    '4th Year',
    'student7@gitam.edu',
    '+91-9876543216',
    'hashed_password_placeholder',
    false,
    false
),
(
    'REPLACE-WITH-UUID-FROM-AUTH-USERS-8',
    'Karthik Rao',
    '220100008',
    '2022-2026',
    'School of Business',
    'Business Administration',
    'Marketing',
    '3rd Year',
    'student8@gitam.edu',
    '+91-9876543217',
    'hashed_password_placeholder',
    false,
    false
);

-- =============================================
-- QUICK SETUP SCRIPT
-- =============================================

-- 🚀 For immediate testing, you can also run this to get the UUIDs:

/*
-- Run this after creating auth users:
DO $$
DECLARE
    user1_uuid uuid;
    user2_uuid uuid;
    user3_uuid uuid;
    user4_uuid uuid;
    user5_uuid uuid;
    user6_uuid uuid;
    user7_uuid uuid;
    user8_uuid uuid;
BEGIN
    -- Get UUIDs from auth.users (adjust emails as needed)
    SELECT id INTO user1_uuid FROM auth.users WHERE email = 'student1@gitam.edu';
    SELECT id INTO user2_uuid FROM auth.users WHERE email = 'student2@gitam.edu';
    SELECT id INTO user3_uuid FROM auth.users WHERE email = 'student3@gitam.edu';
    SELECT id INTO user4_uuid FROM auth.users WHERE email = 'student4@gitam.edu';
    SELECT id INTO user5_uuid FROM auth.users WHERE email = 'student5@gitam.edu';
    SELECT id INTO user6_uuid FROM auth.users WHERE email = 'student6@gitam.edu';
    SELECT id INTO user7_uuid FROM auth.users WHERE email = 'student7@gitam.edu';
    SELECT id INTO user8_uuid FROM auth.users WHERE email = 'student8@gitam.edu';
    
    -- Insert users with real UUIDs
    INSERT INTO public.users (id, name, roll_number_faculty_id, batch, school, branch, specialization, year_designation, email, contact, password_hash, is_admin, is_faculty) VALUES
    (user1_uuid, 'Arjun Sharma', '220030001', '2022-2026', 'School of Technology', 'Computer Science Engineering', 'Artificial Intelligence', '3rd Year', 'student1@gitam.edu', '+91-9876543210', 'placeholder', false, false),
    (user2_uuid, 'Priya Reddy', '210040002', '2021-2025', 'School of Technology', 'Mechanical Engineering', 'Robotics', '4th Year', 'student2@gitam.edu', '+91-9876543211', 'placeholder', false, false),
    (user3_uuid, 'Kavya Patel', '230050003', '2023-2027', 'School of Science', 'Biotechnology', 'Medical Biotechnology', '2nd Year', 'student3@gitam.edu', '+91-9876543212', 'placeholder', false, false),
    (user4_uuid, 'Rohit Kumar', '220060004', '2022-2026', 'School of Science', 'Mathematics', 'Applied Mathematics', '3rd Year', 'student4@gitam.edu', '+91-9876543213', 'placeholder', false, false),
    (user5_uuid, 'Sneha Gupta', '230070005', '2023-2027', 'School of Humanities', 'English Literature', 'Creative Writing', '2nd Year', 'student5@gitam.edu', '+91-9876543214', 'placeholder', false, false),
    (user6_uuid, 'Vikram Singh', '220080006', '2022-2026', 'School of Physical Education', 'Sports Science', 'Athletic Performance', '3rd Year', 'student6@gitam.edu', '+91-9876543215', 'placeholder', false, false),
    (user7_uuid, 'Ananya Nair', '210090007', '2021-2026', 'School of Law', 'Law', 'Corporate Law', '4th Year', 'student7@gitam.edu', '+91-9876543216', 'placeholder', false, false),
    (user8_uuid, 'Karthik Rao', '220100008', '2022-2026', 'School of Business', 'Business Administration', 'Marketing', '3rd Year', 'student8@gitam.edu', '+91-9876543217', 'placeholder', false, false);
    
    RAISE NOTICE 'Users inserted successfully!';
END $$;
*/

-- =============================================
-- TESTING CREDENTIALS FOR YOUR APP:
-- =============================================

/*
🔐 Use these credentials to test different user profiles:

Roll Number: 220030001 | Password: anything | Name: Arjun Sharma (CS AI Student)
Roll Number: 210040002 | Password: anything | Name: Priya Reddy (Mechanical Robotics)  
Roll Number: 230050003 | Password: anything | Name: Kavya Patel (Biotechnology)
Roll Number: 220060004 | Password: anything | Name: Rohit Kumar (Mathematics)
Roll Number: 230070005 | Password: anything | Name: Sneha Gupta (Literature)
Roll Number: 220080006 | Password: anything | Name: Vikram Singh (Sports Science)
Roll Number: 210090007 | Password: anything | Name: Ananya Nair (Law)
Roll Number: 220100008 | Password: anything | Name: Karthik Rao (Business)

Plus the existing test accounts:
Roll Number: ADMIN001 | Password: anything | Admin Account
Roll Number: FAC001 | Password: anything | Faculty Account
Roll Number: STU001 | Password: anything | Basic Student Account
*/
