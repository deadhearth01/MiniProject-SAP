-- =============================================
-- SAMPLE DATA FOR SUPABASE (TESTING MODE COMPATIBLE)
-- ✅ This works with your testing authentication system
-- =============================================

-- Insert user profiles first (these match your testing auth system)
INSERT INTO public.user_profiles (
    id,
    name,
    roll_number_faculty_id,
    school,
    branch,
    specialization,
    batch,
    phone,
    is_admin,
    is_faculty
) VALUES 
-- Admin user
(
    gen_random_uuid(),
    'Admin User',
    'ADMIN001',
    'Administration',
    'System Administration',
    'Database Management',
    '2020-2024',
    '+91-9999999999',
    true,
    false
),
-- Faculty user
(
    gen_random_uuid(),
    'Dr. Rajesh Kumar',
    'FAC001',
    'School of Technology',
    'Computer Science Engineering',
    'Artificial Intelligence',
    '2015-Present',
    '+91-9876543210',
    false,
    true
),
-- Student users
(
    gen_random_uuid(),
    'Priya Sharma',
    'STU001',
    'School of Technology', 
    'Computer Science Engineering',
    'Artificial Intelligence',
    '2022-2026',
    '+91-9876543211',
    false,
    false
),
(
    gen_random_uuid(),
    'Amit Patel',
    'STU002',
    'School of Technology',
    'Mechanical Engineering',
    'Robotics',
    '2021-2025',
    '+91-9876543212',
    false,
    false
),
(
    gen_random_uuid(),
    'Sneha Reddy',
    'STU003',
    'School of Science',
    'Biotechnology',
    'Medical Biotechnology', 
    '2023-2027',
    '+91-9876543213',
    false,
    false
),
(
    gen_random_uuid(),
    'Vikram Singh',
    'STU004',
    'School of Science',
    'Mathematics',
    'Applied Mathematics',
    '2022-2026',
    '+91-9876543214',
    false,
    false
),
(
    gen_random_uuid(),
    'Anita Gupta',
    'STU005',
    'School of Physical Education',
    'Sports Science',
    'Athletic Performance',
    '2022-2026',
    '+91-9876543215',
    false,
    false
);

-- Now insert achievements using the generated user IDs
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
    status,
    points
) VALUES
-- STU001 achievements  
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU001'),
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
    'approved', 
    100
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU001'),
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
    'approved', 
    75
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU001'),
    'GITAM Innovation Challenge', 
    'Co-curricular', 
    'College', 
    '2024-09-15', 
    '2nd', 
    'School of Technology', 
    'Computer Science Engineering', 
    'Artificial Intelligence', 
    '2022-2026', 
    'GITAM Innovation Cell', 
    'GITAM Campus', 
    'proofs/innovation-challenge.pdf', 
    'Developed IoT-based smart campus solution', 
    'approved', 
    20
),

-- STU002 achievements
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU002'),
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
    'approved', 
    80
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU002'),
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
    'approved', 
    50
),

-- STU003 achievements
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU003'),
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
    'approved', 
    50
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU003'),
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
    'approved', 
    25
),

-- STU004 achievements
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU004'),
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
    'approved', 
    75
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU004'),
    'Hackathon Delhi 2024', 
    'Co-curricular', 
    'National', 
    '2024-12-01', 
    '1st', 
    'School of Science', 
    'Mathematics', 
    'Applied Mathematics', 
    '2022-2026', 
    'TechCorp India', 
    'New Delhi', 
    'proofs/hackathon-delhi.pdf', 
    'Developed machine learning model for traffic optimization', 
    'pending', 
    0
),

-- STU005 achievements
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU005'),
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
    'approved', 
    50
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU005'),
    'Research Paper Publication', 
    'Curricular', 
    'International', 
    '2024-11-15', 
    '1st', 
    'School of Physical Education', 
    'Sports Science', 
    'Athletic Performance', 
    '2022-2026', 
    'International Journal of Sports Science', 
    'Online Publication', 
    'proofs/research-paper.pdf', 
    'Published paper on sports performance analytics', 
    'pending', 
    0
);

-- Update leaderboard with calculated points
INSERT INTO public.leaderboard (user_id, year, total_points, rank, month)
WITH user_points AS (
    SELECT 
        up.id as user_id,
        up.name,
        up.roll_number_faculty_id,
        COALESCE(SUM(a.points), 0) as total_points,
        EXTRACT(YEAR FROM CURRENT_DATE) as year,
        EXTRACT(MONTH FROM CURRENT_DATE) as month
    FROM public.user_profiles up
    LEFT JOIN public.achievements a ON up.id = a.user_id AND a.status = 'approved'
    WHERE up.is_admin = false AND up.is_faculty = false
    GROUP BY up.id, up.name, up.roll_number_faculty_id
),
ranked_users AS (
    SELECT 
        user_id,
        year,
        total_points,
        month,
        ROW_NUMBER() OVER (ORDER BY total_points DESC, roll_number_faculty_id ASC) as rank
    FROM user_points
    WHERE total_points > 0
)
SELECT user_id, year, total_points, rank, month FROM ranked_users;

-- Insert some notification samples
INSERT INTO public.notifications (user_id, title, message, type, is_read)
SELECT 
    up.id,
    'Achievement Approved!' as title,
    'Your achievement "' || a.event_name || '" has been approved and ' || a.points || ' points have been added to your profile.' as message,
    'achievement' as type,
    false as is_read
FROM public.user_profiles up
JOIN public.achievements a ON up.id = a.user_id
WHERE a.status = 'approved'
AND up.roll_number_faculty_id IN ('STU001', 'STU002', 'STU003')
LIMIT 5;

-- Add some pending approval notifications for faculty/admin
INSERT INTO public.notifications (user_id, title, message, type, is_read)
SELECT 
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'FAC001'),
    'New Achievement Pending Approval' as title,
    'Student ' || up.name || ' has submitted an achievement "' || a.event_name || '" for approval.' as message,
    'approval_required' as type,
    false as is_read
FROM public.achievements a
JOIN public.user_profiles up ON a.user_id = up.id
WHERE a.status = 'pending'
LIMIT 3;
