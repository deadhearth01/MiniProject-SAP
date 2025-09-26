-- =============================================
-- GITAM ACHIEVEMENT PORTAL DATABASE SCHEMA
-- ✅ CORRECTED VERSION FOR SUPABASE
-- =============================================

-- Create Users table
CREATE TABLE public.users (
    id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name text NOT NULL,
    roll_number_faculty_id text UNIQUE NOT NULL,
    batch text,
    school text NOT NULL,
    branch text NOT NULL,
    specialization text,
    year_designation text NOT NULL,
    email text NOT NULL,
    contact text,
    profile_photo text,
    password_hash text NOT NULL,
    is_admin boolean DEFAULT false,
    is_faculty boolean DEFAULT false,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- Create Achievements table
CREATE TABLE public.achievements (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    event_name text NOT NULL,
    category text CHECK (category IN ('Curricular', 'Co-curricular', 'Extracurricular', 'Other')) NOT NULL,
    level text CHECK (level IN ('College', 'State', 'National', 'International')) NOT NULL,
    date date NOT NULL,
    position text CHECK (position IN ('1st', '2nd', '3rd', 'Participation', 'Other')) NOT NULL,
    school text NOT NULL,
    branch text NOT NULL,
    specialization text,
    batch text,
    organizer text NOT NULL,
    place text NOT NULL,
    proof_file_path text,
    event_photos_paths text,
    remarks text,
    status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    points integer DEFAULT 0,
    submitted_at timestamptz DEFAULT now() NOT NULL,
    approved_at timestamptz,
    approved_by uuid REFERENCES public.users
);

-- Create Leaderboard table
CREATE TABLE public.leaderboard (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    month integer,
    semester integer,
    year integer NOT NULL,
    total_points integer DEFAULT 0,
    rank integer DEFAULT 0,
    UNIQUE(user_id, year)
);

-- Create Notifications table
CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE NOT NULL,
    message text NOT NULL,
    type text CHECK (type IN ('badge', 'approval', 'highlight', 'rejection')) NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    read_status boolean DEFAULT false
);

-- Insert storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('achievement-proofs', 'achievement-proofs', true),
  ('event-photos', 'event-photos', true),
  ('profile-photos', 'profile-photos', true);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Faculty and admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND (is_faculty = true OR is_admin = true)
        )
    );

-- Achievement policies
CREATE POLICY "Users can view their own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements" ON public.achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view approved achievements" ON public.achievements
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Faculty and admins can view all achievements" ON public.achievements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND (is_faculty = true OR is_admin = true)
        )
    );

CREATE POLICY "Admins can update achievement status" ON public.achievements
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Leaderboard policies
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage leaderboard" ON public.leaderboard
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Notification policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Storage policies
CREATE POLICY "Users can upload achievement proofs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'achievement-proofs' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view achievement proofs" ON storage.objects
    FOR SELECT USING (bucket_id = 'achievement-proofs');

CREATE POLICY "Users can upload event photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'event-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view event photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'event-photos');

CREATE POLICY "Users can upload profile photos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view profile photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'profile-photos');

-- Performance indexes
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_achievements_status ON public.achievements(status);
CREATE INDEX idx_achievements_date ON public.achievements(date);
CREATE INDEX idx_achievements_level ON public.achievements(level);
CREATE INDEX idx_achievements_category ON public.achievements(category);
CREATE INDEX idx_leaderboard_user_id ON public.leaderboard(user_id);
CREATE INDEX idx_leaderboard_year ON public.leaderboard(year);
CREATE INDEX idx_leaderboard_rank ON public.leaderboard(rank);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read_status ON public.notifications(read_status);
CREATE INDEX idx_users_roll_number ON public.users(roll_number_faculty_id);
CREATE INDEX idx_users_is_admin ON public.users(is_admin);
CREATE INDEX idx_users_is_faculty ON public.users(is_faculty);

-- Points calculation function
CREATE OR REPLACE FUNCTION calculate_achievement_points(
    achievement_level text,
    achievement_position text
)
RETURNS integer AS $$
DECLARE
    base_points integer;
    position_multiplier numeric;
BEGIN
    CASE achievement_level
        WHEN 'International' THEN base_points := 100;
        WHEN 'National' THEN base_points := 75;
        WHEN 'State' THEN base_points := 50;
        WHEN 'College' THEN base_points := 25;
        ELSE base_points := 10;
    END CASE;
    
    CASE achievement_position
        WHEN '1st' THEN position_multiplier := 1.0;
        WHEN '2nd' THEN position_multiplier := 0.8;
        WHEN '3rd' THEN position_multiplier := 0.6;
        WHEN 'Participation' THEN position_multiplier := 0.3;
        WHEN 'Other' THEN position_multiplier := 0.5;
        ELSE position_multiplier := 0.3;
    END CASE;
    
    RETURN ROUND(base_points * position_multiplier);
END;
$$ LANGUAGE plpgsql;

-- Trigger function for points
CREATE OR REPLACE FUNCTION set_achievement_points()
RETURNS trigger AS $$
BEGIN
    NEW.points := calculate_achievement_points(NEW.level, NEW.position);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_set_achievement_points
    BEFORE INSERT OR UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION set_achievement_points();

-- Leaderboard update function
CREATE OR REPLACE FUNCTION update_leaderboard_on_approval()
RETURNS trigger AS $$
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        INSERT INTO public.leaderboard (user_id, year, total_points, month)
        VALUES (
            NEW.user_id,
            EXTRACT(year FROM NEW.date)::integer,
            NEW.points,
            EXTRACT(month FROM NEW.date)::integer
        )
        ON CONFLICT (user_id, year) 
        DO UPDATE SET 
            total_points = public.leaderboard.total_points + NEW.points,
            month = EXTRACT(month FROM NEW.date)::integer;
        
        WITH ranked_users AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (ORDER BY total_points DESC) as new_rank
            FROM public.leaderboard
            WHERE year = EXTRACT(year FROM NEW.date)::integer
        )
        UPDATE public.leaderboard 
        SET rank = ranked_users.new_rank
        FROM ranked_users
        WHERE public.leaderboard.id = ranked_users.id
        AND year = EXTRACT(year FROM NEW.date)::integer;
        
        INSERT INTO public.notifications (user_id, message, type)
        VALUES (
            NEW.user_id,
            'Your achievement "' || NEW.event_name || '" has been approved and you earned ' || NEW.points || ' points!',
            'approval'
        );
    END IF;
    
    IF NEW.status = 'rejected' AND (OLD.status IS NULL OR OLD.status != 'rejected') THEN
        INSERT INTO public.notifications (user_id, message, type)
        VALUES (
            NEW.user_id,
            'Your achievement "' || NEW.event_name || '" has been rejected. Please review and resubmit if necessary.',
            'rejection'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create leaderboard trigger
CREATE TRIGGER trigger_update_leaderboard
    AFTER UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_on_approval();
