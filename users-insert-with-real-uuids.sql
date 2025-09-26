-- =============================================
-- HOW TO FIX THE UUID ERROR
-- =============================================

-- STEP 1: First, run this query in Supabase SQL Editor to get the actual UUIDs:

SELECT id, email FROM auth.users ORDER BY created_at DESC;

-- This will show you something like:
-- id                                   | email
-- ---------------------------------------|-------------------------
-- 12345678-1234-1234-1234-123456789abc | admin@gitam.edu
-- 87654321-4321-4321-4321-cba987654321 | rajesh.kumar@gitam.edu
-- 11111111-2222-3333-4444-555555555555 | arjun.sharma@gitam.in
-- 22222222-3333-4444-5555-666666666666 | priya.patel@gitam.in
-- 33333333-4444-5555-6666-777777777777 | kiran.reddy@gitam.in

-- STEP 2: Copy the actual UUIDs and use them in the INSERT queries below:

-- =============================================
-- ADMIN USER INSERT (CORRECTED EXAMPLE)
-- =============================================
-- Replace 'REPLACE-WITH-ADMIN-UUID-FROM-AUTH-USERS' with the actual UUID for admin@gitam.edu
-- Example:

INSERT INTO public.users (
    id,
    name,
    roll_number_faculty_id,
    school,
    branch,
    year_designation,
    email,
    contact,
    password_hash,
    is_admin,
    is_faculty
) VALUES (
    '12345678-1234-1234-1234-123456789abc',  -- ✅ USE YOUR ACTUAL UUID HERE
    'GITAM Administrator',
    'ADMIN001',
    'School of Technology',
    'Administration',
    'Administrator',
    'admin@gitam.edu',
    '+91-9876543210',
    'managed_by_supabase_auth',
    true,
    true
);

-- =============================================
-- FACULTY USER INSERT (CORRECTED EXAMPLE)
-- =============================================
-- Replace with actual UUID for rajesh.kumar@gitam.edu

INSERT INTO public.users (
    id,
    name,
    roll_number_faculty_id,
    school,
    branch,
    year_designation,
    email,
    contact,
    password_hash,
    is_admin,
    is_faculty
) VALUES (
    '87654321-4321-4321-4321-cba987654321',  -- ✅ USE YOUR ACTUAL UUID HERE
    'Dr. Rajesh Kumar',
    'FAC001',
    'School of Technology',
    'Computer Science Engineering',
    'Assistant Professor',
    'rajesh.kumar@gitam.edu',
    '+91-9876543211',
    'managed_by_supabase_auth',
    false,
    true
);

-- =============================================
-- STUDENT 1 INSERT (CORRECTED EXAMPLE)
-- =============================================
-- Replace with actual UUID for arjun.sharma@gitam.in

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
) VALUES (
    '11111111-2222-3333-4444-555555555555',  -- ✅ USE YOUR ACTUAL UUID HERE
    'Arjun Sharma',
    '22UCS001',
    '2022-2026',
    'School of Technology',
    'Computer Science Engineering',
    'Artificial Intelligence',
    '3rd Year',
    'arjun.sharma@gitam.in',
    '+91-9876543212',
    'managed_by_supabase_auth',
    false,
    false
);

-- =============================================
-- STUDENT 2 INSERT (CORRECTED EXAMPLE)
-- =============================================
-- Replace with actual UUID for priya.patel@gitam.in

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
) VALUES (
    '22222222-3333-4444-5555-666666666666',  -- ✅ USE YOUR ACTUAL UUID HERE
    'Priya Patel',
    '22UEC002',
    '2022-2026',
    'School of Technology',
    'Electronics and Communication Engineering',
    'VLSI Design',
    '3rd Year',
    'priya.patel@gitam.in',
    '+91-9876543213',
    'managed_by_supabase_auth',
    false,
    false
);

-- =============================================
-- STUDENT 3 INSERT (CORRECTED EXAMPLE)
-- =============================================
-- Replace with actual UUID for kiran.reddy@gitam.in

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
) VALUES (
    '33333333-4444-5555-6666-777777777777',  -- ✅ USE YOUR ACTUAL UUID HERE
    'Kiran Reddy',
    '22UME003',
    '2022-2026',
    'School of Technology',
    'Mechanical Engineering',
    'Robotics',
    '3rd Year',
    'kiran.reddy@gitam.in',
    '+91-9876543214',
    'managed_by_supabase_auth',
    false,
    false
);

-- =============================================
-- SAMPLE ACHIEVEMENTS (OPTIONAL)
-- =============================================
-- Replace with actual student UUIDs

INSERT INTO public.achievements (
    user_id,
    event_name,
    category,
    level,
    date,
    position,
    school,
    branch,
    batch,
    organizer,
    place,
    remarks,
    status
) VALUES (
    '11111111-2222-3333-4444-555555555555',  -- Arjun's UUID
    'National Programming Contest 2024',
    'Co-curricular',
    'National',
    '2024-08-15',
    '1st',
    'School of Technology',
    'Computer Science Engineering',
    '2022-2026',
    'IEEE Computer Society',
    'Delhi, India',
    'Won first place in competitive programming contest',
    'approved'
);

INSERT INTO public.achievements (
    user_id,
    event_name,
    category,
    level,
    date,
    position,
    school,
    branch,
    batch,
    organizer,
    place,
    remarks,
    status
) VALUES (
    '22222222-3333-4444-5555-666666666666',  -- Priya's UUID
    'State Level Robotics Competition',
    'Extracurricular',
    'State',
    '2024-09-10',
    '2nd',
    'School of Technology',
    'Electronics and Communication Engineering',
    '2022-2026',
    'State Robotics Society',
    'Hyderabad, India',
    'Second place in autonomous robot category',
    'pending'
);

-- =============================================
-- VERIFICATION QUERY
-- =============================================
-- Run this after inserting to verify:
SELECT name, email, is_admin, is_faculty, roll_number_faculty_id FROM public.users;
