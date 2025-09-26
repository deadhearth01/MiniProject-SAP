-- =============================================
-- SUPABASE DATABASE SCHEMA SETUP
-- Run this FIRST before inserting sample data
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    category VARCHAR(100) NOT NULL CHECK (category IN ('Curricular', 'Co-curricular', 'Extracurricular')),
    level VARCHAR(50) NOT NULL CHECK (level IN ('International', 'National', 'State', 'College')),
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
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
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
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'achievement', 'approval_required', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for proof files (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('proofs', 'proofs', false, 52428800, '{"image/*","application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"}')
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (true);

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (true);

-- Achievements policies
CREATE POLICY "Anyone can view approved achievements" ON public.achievements
    FOR SELECT USING (status = 'approved' OR true);

CREATE POLICY "Users can insert own achievements" ON public.achievements
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own achievements" ON public.achievements
    FOR UPDATE USING (true);

CREATE POLICY "Admins and faculty can manage all achievements" ON public.achievements
    FOR ALL USING (true);

-- Leaderboard policies
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
    FOR SELECT USING (true);

CREATE POLICY "System can manage leaderboard" ON public.leaderboard
    FOR ALL USING (true);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (true);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE USING (true);

CREATE POLICY "System can manage notifications" ON public.notifications
    FOR ALL USING (true);

-- Storage policies for proof files
CREATE POLICY "Users can upload proof files" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'proofs');

CREATE POLICY "Users can view proof files" ON storage.objects
    FOR SELECT USING (bucket_id = 'proofs');

CREATE POLICY "Users can update own proof files" ON storage.objects
    FOR UPDATE USING (bucket_id = 'proofs');

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_roll_number ON public.user_profiles(roll_number_faculty_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin ON public.user_profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_faculty ON public.user_profiles(is_faculty);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_status ON public.achievements(status);
CREATE INDEX IF NOT EXISTS idx_achievements_level ON public.achievements(level);
CREATE INDEX IF NOT EXISTS idx_achievements_category ON public.achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_date ON public.achievements(date);

CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON public.leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_year ON public.leaderboard(year);
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON public.leaderboard(total_points);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON public.leaderboard(rank);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaderboard_updated_at BEFORE UPDATE ON public.leaderboard 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update leaderboard when achievements are approved
CREATE OR REPLACE FUNCTION update_leaderboard_on_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        -- Insert or update leaderboard entry
        INSERT INTO public.leaderboard (user_id, year, month, total_points, rank)
        SELECT 
            NEW.user_id,
            EXTRACT(YEAR FROM CURRENT_DATE),
            EXTRACT(MONTH FROM CURRENT_DATE),
            COALESCE(SUM(a.points), 0),
            1
        FROM public.achievements a
        WHERE a.user_id = NEW.user_id AND a.status = 'approved'
        GROUP BY a.user_id
        ON CONFLICT (user_id, year, month) 
        DO UPDATE SET 
            total_points = EXCLUDED.total_points,
            updated_at = NOW();
        
        -- Update ranks for all users in the same year/month
        WITH ranked_users AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (ORDER BY total_points DESC, updated_at ASC) as new_rank
            FROM public.leaderboard
            WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)
            AND month = EXTRACT(MONTH FROM CURRENT_DATE)
        )
        UPDATE public.leaderboard 
        SET rank = ranked_users.new_rank
        FROM ranked_users
        WHERE public.leaderboard.id = ranked_users.id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatic leaderboard updates
CREATE TRIGGER trigger_update_leaderboard
    AFTER UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_on_approval();

-- Insert default admin user (for testing)
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

COMMIT;
