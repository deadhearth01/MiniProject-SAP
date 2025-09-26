-- =============================================
-- STEP 2: INSERT SAMPLE DATA
-- Run this AFTER step 1 completes successfully
-- =============================================

-- Insert user profiles (Admin, Faculty, Students)
INSERT INTO public.user_profiles (
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
    'System Administrator',
    'ADMIN001',
    'Administration',
    'System Administration',
    'Database Management',
    '2020-Present',
    '+91-9999999999',
    true,
    false
),
-- Faculty user
(
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

-- Insert sample achievements
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
-- Pending achievements for testing approval workflow
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
);

-- Insert leaderboard data
INSERT INTO public.leaderboard (user_id, year, total_points, rank, month)
SELECT 
    up.id,
    EXTRACT(YEAR FROM CURRENT_DATE),
    COALESCE(SUM(a.points), 0),
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(a.points), 0) DESC),
    EXTRACT(MONTH FROM CURRENT_DATE)
FROM public.user_profiles up
LEFT JOIN public.achievements a ON up.id = a.user_id AND a.status = 'approved'
WHERE up.is_admin = false AND up.is_faculty = false
GROUP BY up.id;

-- Insert sample notifications
INSERT INTO public.notifications (user_id, title, message, type, is_read) VALUES
-- For students
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU001'),
    'Achievement Approved!',
    'Your achievement "International Coding Championship" has been approved and 100 points have been added.',
    'achievement',
    false
),
-- For faculty/admin
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'FAC001'),
    'New Achievement Pending',
    'Student Vikram Singh has submitted "Hackathon Delhi 2024" for approval.',
    'approval_required',
    false
);
