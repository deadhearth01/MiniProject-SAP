-- =============================================
-- SAMPLE ACHIEVEMENTS DATA FOR SUPABASE (FIXED WITH REAL UUIDS)
-- ✅ Insert this after creating users in your database
-- =============================================

-- First, let's create some sample users in auth.users (for testing purposes)
-- Note: In production, users would be created through Supabase Auth

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
    'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- User 1
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
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8', -- User 2
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
    'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- User 1, multiple achievements
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
    '6ba7b811-9dad-11d1-80b4-00c04fd430c8', -- User 3
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
    '6ba7b812-9dad-11d1-80b4-00c04fd430c8', -- User 4
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
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8', -- User 2, multiple achievements
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
    '6ba7b813-9dad-11d1-80b4-00c04fd430c8', -- User 5
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
    '6ba7b814-9dad-11d1-80b4-00c04fd430c8', -- User 6
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
    '6ba7b811-9dad-11d1-80b4-00c04fd430c8', -- User 3, multiple achievements
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
    '6ba7b815-9dad-11d1-80b4-00c04fd430c8', -- User 7
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
    'GITAM Campus',
    'proofs/debate-championship.pdf',
    'Won inter-school debate competition',
    'approved'
),
(
    '6ba7b816-9dad-11d1-80b4-00c04fd430c8', -- User 8
    'GITAM Innovation Challenge',
    'Co-curricular',
    'College',
    '2024-09-15',
    '2nd',
    'School of Technology',
    'Electronics and Communication',
    'VLSI Design',
    '2022-2026',
    'GITAM Innovation Cell',
    'GITAM Campus',
    'proofs/innovation-challenge.pdf',
    'Developed IoT-based smart campus solution',
    'approved'
),

-- 📝 PENDING ACHIEVEMENTS (for testing approval workflow)
(
    '6ba7b817-9dad-11d1-80b4-00c04fd430c8', -- User 9
    'Hackathon Delhi 2024',
    'Co-curricular',
    'National',
    '2024-12-01',
    '1st',
    'School of Technology',
    'Computer Science Engineering',
    'Data Science',
    '2023-2027',
    'TechCorp India',
    'New Delhi',
    'proofs/hackathon-delhi.pdf',
    'Developed machine learning model for traffic optimization',
    'pending'
),
(
    '6ba7b818-9dad-11d1-80b4-00c04fd430c8', -- User 10
    'Research Paper Publication',
    'Curricular',
    'International',
    '2024-11-15',
    '1st',
    'School of Science',
    'Physics',
    'Quantum Physics',
    '2022-2026',
    'International Journal of Physics',
    'Online Publication',
    'proofs/research-paper.pdf',
    'Published paper on quantum computing applications',
    'pending'
),

-- 🎨 EXTRACURRICULAR ACHIEVEMENTS
(
    '6ba7b819-9dad-11d1-80b4-00c04fd430c8', -- User 11
    'National Dance Competition',
    'Extracurricular',
    'National',
    '2024-10-20',
    '1st',
    'School of Fine Arts',
    'Performing Arts',
    'Classical Dance',
    '2021-2025',
    'Indian Classical Dance Association',
    'Mumbai',
    'proofs/dance-competition.pdf',
    'Won first place in Bharatanatyam category',
    'approved'
),
(
    '6ba7b820-9dad-11d1-80b4-00c04fd430c8', -- User 12
    'Inter-University Cricket Championship',
    'Extracurricular',
    'State',
    '2024-09-30',
    '2nd',
    'School of Physical Education',
    'Sports Management',
    'Cricket Coaching',
    '2022-2026',
    'Andhra Pradesh University Sports',
    'Tirupati',
    'proofs/cricket-championship.pdf',
    'Key player in university team that reached finals',
    'approved'
);

-- Insert corresponding user profiles (this would normally be handled by Supabase Auth)
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
(
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    'Rajesh Kumar',
    'STU001',
    'School of Technology',
    'Computer Science Engineering',
    'Artificial Intelligence',
    '2022-2026',
    '+91-9876543210',
    false,
    false
),
(
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    'Priya Sharma',
    'STU002',
    'School of Technology', 
    'Mechanical Engineering',
    'Robotics',
    '2021-2025',
    '+91-9876543211',
    false,
    false
),
(
    '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
    'Amit Patel',
    'STU003',
    'School of Science',
    'Biotechnology',
    'Medical Biotechnology', 
    '2023-2027',
    '+91-9876543212',
    false,
    false
),
(
    '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
    'Sneha Reddy',
    'STU004',
    'School of Science',
    'Mathematics',
    'Applied Mathematics',
    '2022-2026',
    '+91-9876543213',
    false,
    false
),
(
    '6ba7b813-9dad-11d1-80b4-00c04fd430c8',
    'Vikram Singh',
    'STU005',
    'School of Humanities',
    'English Literature',
    'Creative Writing',
    '2023-2027',
    '+91-9876543214',
    false,
    false
),
(
    '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
    'Anita Gupta',
    'STU006',
    'School of Physical Education',
    'Sports Science',
    'Athletic Performance',
    '2022-2026',
    '+91-9876543215',
    false,
    false
),
(
    '6ba7b815-9dad-11d1-80b4-00c04fd430c8',
    'Rohit Mehta',
    'STU007',
    'School of Law',
    'Law',
    'Corporate Law',
    '2021-2026',
    '+91-9876543216',
    false,
    false
),
(
    '6ba7b816-9dad-11d1-80b4-00c04fd430c8',
    'Kavya Nair',
    'STU008',
    'School of Technology',
    'Electronics and Communication',
    'VLSI Design',
    '2022-2026',
    '+91-9876543217',
    false,
    false
),
(
    '6ba7b817-9dad-11d1-80b4-00c04fd430c8',
    'Arjun Rao',
    'STU009',
    'School of Technology',
    'Computer Science Engineering',
    'Data Science',
    '2023-2027',
    '+91-9876543218',
    false,
    false
),
(
    '6ba7b818-9dad-11d1-80b4-00c04fd430c8',
    'Deepika Joshi',
    'STU010',
    'School of Science',
    'Physics',
    'Quantum Physics',
    '2022-2026',
    '+91-9876543219',
    false,
    false
),
(
    '6ba7b819-9dad-11d1-80b4-00c04fd430c8',
    'Ravi Krishnan',
    'STU011',
    'School of Fine Arts',
    'Performing Arts',
    'Classical Dance',
    '2021-2025',
    '+91-9876543220',
    false,
    false
),
(
    '6ba7b820-9dad-11d1-80b4-00c04fd430c8',
    'Siddharth Bose',
    'STU012',
    'School of Physical Education',
    'Sports Management',
    'Cricket Coaching',
    '2022-2026',
    '+91-9876543221',
    false,
    false
);
