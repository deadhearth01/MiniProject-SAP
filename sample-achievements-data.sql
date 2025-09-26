-- =============================================
-- SAMPLE ACHIEVEMENTS DATA FOR SUPABASE
-- ✅ Insert this after creating users in your database
-- =============================================

-- ⚠️  IMPORTANT: Replace these UUIDs with actual user IDs from your auth.users table
-- Run this query first to get real user IDs:
-- SELECT id, email FROM auth.users ORDER BY created_at;

-- Sample achievements for different users and scenarios
INSERT INTO public.achievements (
    user_id, 
    event_name, 
    category, 
    level, 
    date, 
    position, 
    school, 
    branch, 
    specialization, 
    batch, 
    organizer, 
    place, 
    proof_file_path, 
    remarks, 
    status
) VALUES 

-- 🥇 INTERNATIONAL LEVEL ACHIEVEMENTS
(
    'REPLACE-WITH-REAL-UUID-1', -- Replace with actual user UUID
    'International Coding Championship',
    'Co-curricular',
    'International',
    '2024-08-15',
    '1st',
    'School of Technology',
    'Computer Science Engineering',
    'Artificial Intelligence',
    '2022-2026',
    'IEEE International',
    'Singapore',
    'proofs/international-coding-cert.pdf',
    'Won first place among 500+ participants worldwide',
    'approved'
),
(
    'REPLACE-WITH-REAL-UUID-2', -- Replace with actual user UUID
    'International Robotics Competition',
    'Co-curricular',
    'International',
    '2024-07-20',
    '2nd',
    'School of Technology',
    'Mechanical Engineering',
    'Robotics',
    '2021-2025',
    'World Robotics Federation',
    'Tokyo, Japan',
    'proofs/robotics-international.pdf',
    'Secured second position in autonomous robot category',
    'approved'
),

-- 🏆 NATIONAL LEVEL ACHIEVEMENTS
(
    'REPLACE-WITH-REAL-UUID-1', -- Same user, multiple achievements
    'Smart India Hackathon',
    'Co-curricular',
    'National',
    '2024-06-10',
    '1st',
    'School of Technology',
    'Computer Science Engineering',
    'Artificial Intelligence',
    '2022-2026',
    'Government of India',
    'New Delhi',
    'proofs/sih-winner-cert.pdf',
    'Developed AI-powered healthcare solution for rural areas',
    'approved'
),
(
    'REPLACE-WITH-REAL-UUID-3', -- Replace with actual user UUID
    'National Science Exhibition',
    'Curricular',
    'National',
    '2024-05-25',
    '3rd',
    'School of Science',
    'Biotechnology',
    'Medical Biotechnology',
    '2023-2027',
    'National Science Foundation',
    'Bangalore',
    'proofs/science-exhibition.pdf',
    'Presented research on gene therapy applications',
    'approved'
),
(
    'REPLACE-WITH-REAL-UUID-4', -- Replace with actual user UUID
    'National Mathematics Olympiad',
    'Curricular',
    'National',
    '2024-04-18',
    '1st',
    'School of Science',
    'Mathematics',
    'Applied Mathematics',
    '2022-2026',
    'Mathematical Society of India',
    'Chennai',
    'proofs/math-olympiad.pdf',
    'Solved complex probability and statistics problems',
    'approved'
),

-- 🎯 STATE LEVEL ACHIEVEMENTS
(
    'REPLACE-WITH-REAL-UUID-2', -- Same user, multiple achievements
    'Andhra Pradesh Tech Fest',
    'Co-curricular',
    'State',
    '2024-03-12',
    '1st',
    'School of Technology',
    'Mechanical Engineering',
    'Robotics',
    '2021-2025',
    'AP State Government',
    'Visakhapatnam',
    'proofs/ap-tech-fest.pdf',
    'Won robotics design competition',
    'approved'
),
(
    'REPLACE-WITH-REAL-UUID-5', -- Replace with actual user UUID
    'State Level Cultural Competition',
    'Extracurricular',
    'State',
    '2024-02-28',
    '2nd',
    'School of Humanities',
    'English Literature',
    'Creative Writing',
    '2023-2027',
    'Andhra Pradesh Cultural Society',
    'Vijayawada',
    'proofs/cultural-competition.pdf',
    'Won second place in poetry recitation',
    'approved'
),
(
    'REPLACE-WITH-REAL-UUID-6', -- Replace with actual user UUID
    'State Basketball Championship',
    'Extracurricular',
    'State',
    '2024-01-15',
    '1st',
    'School of Physical Education',
    'Sports Science',
    'Athletic Performance',
    '2022-2026',
    'AP Sports Authority',
    'Guntur',
    'proofs/basketball-championship.pdf',
    'Captain of winning team',
    'approved'
),

-- 🏫 COLLEGE LEVEL ACHIEVEMENTS
(
    'REPLACE-WITH-REAL-UUID-3', -- Same user, multiple achievements
    'GITAM Annual Project Exhibition',
    'Curricular',
    'College',
    '2024-11-20',
    '1st',
    'School of Science',
    'Biotechnology',
    'Medical Biotechnology',
    '2023-2027',
    'GITAM University',
    'GITAM Campus, Visakhapatnam',
    'proofs/project-exhibition.pdf',
    'Best project award for cancer research model',
    'approved'
),
(
    'REPLACE-WITH-REAL-UUID-7', -- Replace with actual user UUID
    'GITAM Debate Championship',
    'Extracurricular',
    'College',
    '2024-10-08',
    '1st',
    'School of Law',
    'Law',
    'Corporate Law',
    '2021-2026',
    'GITAM Debate Society',
    'GITAM Campus, Hyderabad',
    'proofs/debate-championship.pdf',
    'Won inter-department debate on constitutional law',
    'approved'
),
(
    'REPLACE-WITH-REAL-UUID-8', -- Replace with actual user UUID
    'GITAM Innovation Challenge',
    'Co-curricular',
    'College',
    '2024-09-15',
    '2nd',
    'School of Business',
    'Business Administration',
    'Marketing',
    '2022-2026',
    'GITAM Entrepreneurship Cell',
    'GITAM Campus, Bangalore',
    'proofs/innovation-challenge.pdf',
    'Developed sustainable business model for waste management',
    'approved'
),

-- 📚 PARTICIPATION ACHIEVEMENTS (Lower points but still valuable)
(
    'REPLACE-WITH-REAL-UUID-4', -- Same user, multiple achievements
    'International Conference on Data Science',
    'Co-curricular',
    'International',
    '2024-12-01',
    'Participation',
    'School of Science',
    'Mathematics',
    'Applied Mathematics',
    '2022-2026',
    'IEEE Computer Society',
    'London, UK',
    'proofs/data-science-conference.pdf',
    'Presented paper on machine learning algorithms',
    'approved'
),
(
    'REPLACE-WITH-REAL-UUID-5', -- Same user, multiple achievements
    'National Workshop on Creative Writing',
    'Extracurricular',
    'National',
    '2024-11-10',
    'Participation',
    'School of Humanities',
    'English Literature',
    'Creative Writing',
    '2023-2027',
    'Writers Guild of India',
    'Mumbai',
    'proofs/writing-workshop.pdf',
    'Completed 3-day intensive workshop',
    'approved'
),

-- 🔄 PENDING ACHIEVEMENTS (For testing approval workflow)
(
    'REPLACE-WITH-REAL-UUID-6', -- Same user, pending achievement
    'Inter-University Sports Meet',
    'Extracurricular',
    'National',
    '2024-12-15',
    '1st',
    'School of Physical Education',
    'Sports Science',
    'Athletic Performance',
    '2022-2026',
    'Association of Indian Universities',
    'Pune',
    'proofs/sports-meet-pending.pdf',
    'Waiting for official results announcement',
    'pending'
),
(
    'REPLACE-WITH-REAL-UUID-7', -- Same user, pending achievement
    'Moot Court Competition',
    'Curricular',
    'State',
    '2024-12-10',
    '2nd',
    'School of Law',
    'Law',
    'Corporate Law',
    '2021-2026',
    'Andhra Pradesh Bar Council',
    'Vijayawada',
    'proofs/moot-court-pending.pdf',
    'Submitted final documentation for verification',
    'pending'
),

-- 🚫 SAMPLE REJECTED ACHIEVEMENT (For testing rejection workflow)
(
    'REPLACE-WITH-REAL-UUID-8', -- Same user, rejected achievement
    'Local Coding Bootcamp',
    'Other',
    'College',
    '2024-11-25',
    'Participation',
    'School of Business',
    'Business Administration',
    'Marketing',
    '2022-2026',
    'Local Tech Community',
    'Visakhapatnam',
    'proofs/bootcamp-incomplete.pdf',
    'Insufficient proof documentation',
    'rejected'
);

-- =============================================
-- INSTRUCTIONS FOR USE:
-- =============================================

-- 1️⃣ FIRST: Create users in Supabase Auth Dashboard or via API
--    - Go to Authentication → Users in Supabase Dashboard
--    - Add users manually or use signup API

-- 2️⃣ SECOND: Get real UUIDs from auth.users table:
--    SELECT id, email FROM auth.users ORDER BY created_at;

-- 3️⃣ THIRD: Replace all "REPLACE-WITH-REAL-UUID-X" with actual UUIDs

-- 4️⃣ FOURTH: Run this modified SQL in Supabase SQL Editor

-- 5️⃣ VERIFY: Check if data inserted correctly:
--    SELECT * FROM public.achievements ORDER BY created_at DESC;

-- =============================================
-- POINTS BREAKDOWN:
-- =============================================
-- International 1st = 100 points
-- International 2nd = 80 points  
-- International 3rd = 60 points
-- International Participation = 30 points
-- National 1st = 75 points
-- National 2nd = 60 points
-- National 3rd = 45 points
-- State 1st = 50 points
-- State 2nd = 40 points
-- College 1st = 25 points
-- College 2nd = 20 points
-- =============================================
