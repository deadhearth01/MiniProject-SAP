-- =============================================
-- SUPABASE DATABASE SETUP - RUN THIS FIRST
-- Copy and paste this into your Supabase SQL Editor
-- =============================================

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    roll_number_faculty_id VARCHAR(50) UNIQUE NOT NULL,
    school VARCHAR(255),
    branch VARCHAR(255),
    specialization VARCHAR(255),
    batch VARCHAR(50),
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    is_faculty BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    event_name VARCHAR(500) NOT NULL,
    category VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    position VARCHAR(50),
    school VARCHAR(255),
    branch VARCHAR(255),
    specialization VARCHAR(255),
    batch VARCHAR(50),
    organizer VARCHAR(500),
    place VARCHAR(500),
    proof_file_path VARCHAR(1000),
    remarks TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    points INTEGER DEFAULT 0,
    approved_by UUID REFERENCES public.user_profiles(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER,
    total_points INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, year, month)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for testing - adjust for production)
CREATE POLICY "Allow all operations on user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on achievements" ON public.achievements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on leaderboard" ON public.leaderboard FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

-- Insert default admin user
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
) VALUES (
    'System Administrator',
    'ADMIN001',
    'Administration',
    'System Administration',
    'Database Management',
    '2020-Present',
    '+91-0000000000',
    true,
    false
) ON CONFLICT (roll_number_faculty_id) DO NOTHING;
