-- =============================================
-- SAMPLE USERS INSERT QUERIES
-- Run these AFTER creating auth users in Supabase Dashboard
-- =============================================

-- STEP 1: First create these users in Supabase Auth Dashboard:
-- Go to: Supabase Dashboard → Authentication → Users → Add User
-- 
-- Create users with these emails and passwords:
-- admin@gitam.edu (password: Admin@123)
-- rajesh.kumar@gitam.edu (password: Faculty@123)  
-- arjun.sharma@gitam.in (password: Student@123)
-- priya.patel@gitam.in (password: Student@123)
-- kiran.reddy@gitam.in (password: Student@123)

-- STEP 2: Get the user IDs by running this query:
-- SELECT id, email FROM auth.users ORDER BY created_at DESC;

-- STEP 3: Replace the UUIDs below with actual IDs from Step 2 and run these queries:

-- =============================================
-- ADMIN USER INSERT
-- =============================================
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
    'REPLACE-WITH-ADMIN-UUID-FROM-AUTH-USERS',  -- Replace this with actual UUID
    'GITAM Administrator',
    'ADMIN001',
    'School of Technology',
    'Administration',
    'Administrator',
    'admin@gitam.edu',
    '+91-9876543210',
    'managed_by_supabase_auth',
    true,   -- is_admin = true
    true    -- is_faculty = true (admins have faculty access too)
);

-- =============================================
-- FACULTY USER INSERT
-- =============================================
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
    'REPLACE-WITH-FACULTY-UUID-FROM-AUTH-USERS',  -- Replace this with actual UUID
    'Dr. Rajesh Kumar',
    'FAC001',
    'School of Technology',
    'Computer Science Engineering',
    'Assistant Professor',
    'rajesh.kumar@gitam.edu',
    '+91-9876543211',
    'managed_by_supabase_auth',
    false,  -- is_admin = false
    true    -- is_faculty = true
);

-- =============================================
-- STUDENT 1 INSERT
-- =============================================
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
    'REPLACE-WITH-STUDENT1-UUID-FROM-AUTH-USERS',  -- Replace this with actual UUID
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
    false,  -- is_admin = false
    false   -- is_faculty = false
);

-- =============================================
-- STUDENT 2 INSERT
-- =============================================
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
    'REPLACE-WITH-STUDENT2-UUID-FROM-AUTH-USERS',  -- Replace this with actual UUID
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
    false,  -- is_admin = false
    false   -- is_faculty = false
);

-- =============================================
-- STUDENT 3 INSERT
-- =============================================
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
    'REPLACE-WITH-STUDENT3-UUID-FROM-AUTH-USERS',  -- Replace this with actual UUID
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
    false,  -- is_admin = false
    false   -- is_faculty = false
);

-- =============================================
-- SAMPLE ACHIEVEMENT INSERT (OPTIONAL)
-- For testing the approval workflow
-- =============================================
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
    'REPLACE-WITH-STUDENT1-UUID-FROM-AUTH-USERS',  -- Same as Arjun's UUID
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
    'approved'  -- Change to 'pending' if you want to test approval flow
);

-- =============================================
-- SAMPLE ACHIEVEMENT 2 (PENDING STATUS)
-- =============================================
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
    'REPLACE-WITH-STUDENT2-UUID-FROM-AUTH-USERS',  -- Same as Priya's UUID
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
    'pending'  -- This will show in admin approval queue
);

-- =============================================
-- QUERY TO VERIFY USERS WERE CREATED
-- =============================================
-- Run this to check if users were inserted correctly:
-- SELECT name, email, is_admin, is_faculty, roll_number_faculty_id FROM public.users;
