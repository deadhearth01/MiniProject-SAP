-- =============================================
-- STEP 2: INSERT SAMPLE DATA (FIXED VERSION)
-- Run this AFTER step 1 completes successfully
-- =============================================

-- Insert Faculty user (Admin already exists from step 1)
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
)
ON CONFLICT (roll_number_faculty_id) DO NOTHING;

-- Insert Student users
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
)
ON CONFLICT (roll_number_faculty_id) DO NOTHING;

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
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU002'),
    'State Robotics Championship', 
    'Co-curricular', 
    'State', 
    '2024-05-10', 
    '1st', 
    'School of Technology', 
    'Mechanical Engineering', 
    'Robotics', 
    '2021-2025', 
    'AP State Government', 
    'Visakhapatnam', 
    'proofs/state-robotics.pdf', 
    'Won state level robotics competition', 
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
    'College Research Symposium', 
    'Curricular', 
    'College', 
    '2024-04-15', 
    '1st', 
    'School of Science', 
    'Biotechnology', 
    'Medical Biotechnology', 
    '2023-2027', 
    'GITAM University', 
    'GITAM Campus', 
    'proofs/college-research.pdf', 
    'Best research presentation award', 
    'approved', 
    25
),
-- STU004 achievements (approved)
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU004'),
    'National Mathematics Olympiad', 
    'Curricular', 
    'National', 
    '2024-03-20', 
    '2nd', 
    'School of Science', 
    'Mathematics', 
    'Applied Mathematics', 
    '2022-2026', 
    'Indian Mathematical Society', 
    'Chennai', 
    'proofs/math-olympiad.pdf', 
    'Secured second position in national mathematics olympiad', 
    'approved', 
    60
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
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU005'),
    'Inter-University Sports Meet', 
    'Extracurricular', 
    'State', 
    '2024-11-10', 
    '1st', 
    'School of Physical Education', 
    'Sports Science', 
    'Athletic Performance', 
    '2022-2026', 
    'Andhra Pradesh Universities', 
    'Guntur', 
    'proofs/sports-meet.pdf', 
    'Won gold medal in 100m sprint', 
    'pending', 
    0
);

-- Insert leaderboard data
INSERT INTO public.leaderboard (user_id, year, total_points, rank, month)
SELECT 
    up.id,
    EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    COALESCE(SUM(a.points), 0)::INTEGER,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(a.points), 0) DESC)::INTEGER,
    EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER
FROM public.user_profiles up
LEFT JOIN public.achievements a ON up.id = a.user_id AND a.status = 'approved'
WHERE up.is_admin = false AND up.is_faculty = false
GROUP BY up.id;

-- Insert sample notifications
INSERT INTO public.notifications (user_id, title, message, type, is_read) VALUES
-- Achievement approval notifications for students
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU001'),
    'Achievement Approved!',
    'Your achievement "International Coding Championship" has been approved and 100 points have been added to your profile.',
    'achievement',
    false
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU001'),
    'Achievement Approved!',
    'Your achievement "Smart India Hackathon" has been approved and 75 points have been added to your profile.',
    'achievement',
    false
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU002'),
    'Achievement Approved!',
    'Your achievement "International Robotics Competition" has been approved and 80 points have been added.',
    'achievement',
    true
),
-- Pending approval notifications for faculty/admin
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'FAC001'),
    'New Achievement Pending Approval',
    'Student Vikram Singh has submitted "Hackathon Delhi 2024" for approval.',
    'approval_required',
    false
),
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'FAC001'),
    'New Achievement Pending Approval',
    'Student Anita Gupta has submitted "Inter-University Sports Meet" for approval.',
    'approval_required',
    false
),
-- General notifications
(
    (SELECT id FROM public.user_profiles WHERE roll_number_faculty_id = 'STU003'),
    'Welcome to GITAM Achievement Portal!',
    'Start tracking your achievements and climb up the leaderboard.',
    'general',
    true
);
