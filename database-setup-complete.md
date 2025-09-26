# 🗄️ GITAM Achievement Portal - Complete Database Setup

## Part 1: Complete Database Schema

Copy and run this **complete SQL script** in your Supabase SQL Editor:

```sql
-- =============================================
-- GITAM ACHIEVEMENT PORTAL DATABASE SCHEMA
-- =============================================

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE row_level_security;

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
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
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
    event_photos_paths text[],
    remarks text,
    status text CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    points integer DEFAULT 0,
    submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    approved_at timestamp with time zone,
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
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_status boolean DEFAULT false
);

-- Create Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('achievement-proofs', 'achievement-proofs', true),
  ('event-photos', 'event-photos', true),
  ('profile-photos', 'profile-photos', true);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE row_level_security;
ALTER TABLE public.achievements ENABLE row_level_security;
ALTER TABLE public.leaderboard ENABLE row_level_security;
ALTER TABLE public.notifications ENABLE row_level_security;

-- Users table policies
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

-- Achievements table policies
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

-- Leaderboard table policies
CREATE POLICY "Anyone can view leaderboard" ON public.leaderboard
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage leaderboard" ON public.leaderboard
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- Notifications table policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- =============================================
-- STORAGE POLICIES
-- =============================================

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

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

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

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to calculate achievement points
CREATE OR REPLACE FUNCTION calculate_achievement_points(
    achievement_level text,
    achievement_position text
)
RETURNS integer AS $$
DECLARE
    base_points integer;
    position_multiplier numeric;
BEGIN
    -- Set base points based on level
    CASE achievement_level
        WHEN 'International' THEN base_points := 100;
        WHEN 'National' THEN base_points := 75;
        WHEN 'State' THEN base_points := 50;
        WHEN 'College' THEN base_points := 25;
        ELSE base_points := 10;
    END CASE;
    
    -- Set multiplier based on position
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

-- Trigger to automatically calculate points when achievement is inserted/updated
CREATE OR REPLACE FUNCTION set_achievement_points()
RETURNS trigger AS $$
BEGIN
    NEW.points := calculate_achievement_points(NEW.level, NEW.position);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_achievement_points
    BEFORE INSERT OR UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION set_achievement_points();

-- Function to update leaderboard when achievement is approved
CREATE OR REPLACE FUNCTION update_leaderboard_on_approval()
RETURNS trigger AS $$
BEGIN
    -- Only update if status changed to approved
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
        -- Insert or update leaderboard entry for current year
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
        
        -- Recalculate ranks for the year
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
        
        -- Create notification for user
        INSERT INTO public.notifications (user_id, message, type)
        VALUES (
            NEW.user_id,
            'Your achievement "' || NEW.event_name || '" has been approved and you earned ' || NEW.points || ' points!',
            'approval'
        );
    END IF;
    
    -- Handle rejection
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

CREATE TRIGGER trigger_update_leaderboard
    AFTER UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE FUNCTION update_leaderboard_on_approval();
```

---

## Part 2: User Creation Queries

### 🔧 Step 1: Create Auth Users First

**Important**: You must create users in Supabase Auth Dashboard first, then use their IDs below.

Go to **Supabase Dashboard → Authentication → Users → Add User**

### 🧑‍💼 Step 2: Insert User Profiles

After creating auth users, run these queries **one by one** (replace the UUIDs):

#### Create Admin User
```sql
-- Replace 'REPLACE-WITH-ACTUAL-AUTH-USER-ID' with the UUID from auth.users table
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
    'REPLACE-WITH-ACTUAL-AUTH-USER-ID',  -- ⚠️ REPLACE THIS
    'GITAM Administrator',
    'ADMIN001',
    'School of Technology',
    'Administration',
    'Administrator',
    'admin@gitam.edu',
    '+91-9876543210',
    'managed_by_supabase_auth',  -- This is handled by Supabase Auth
    true,  -- is_admin = true
    true   -- is_faculty = true (admins have faculty privileges too)
);
```

#### Create Faculty User
```sql
-- Replace 'REPLACE-WITH-ACTUAL-AUTH-USER-ID' with the UUID from auth.users table
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
    'REPLACE-WITH-ACTUAL-AUTH-USER-ID',  -- ⚠️ REPLACE THIS
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
```

#### Create Student Users
```sql
-- Student 1
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
    'REPLACE-WITH-ACTUAL-AUTH-USER-ID',  -- ⚠️ REPLACE THIS
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

-- Student 2
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
    'REPLACE-WITH-ACTUAL-AUTH-USER-ID',  -- ⚠️ REPLACE THIS
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

-- Student 3
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
    'REPLACE-WITH-ACTUAL-AUTH-USER-ID',  -- ⚠️ REPLACE THIS
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
```

### 📊 Step 3: Insert Sample Achievements (Optional)
```sql
-- Sample achievement for testing (replace user_id with actual student ID)
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
    'REPLACE-WITH-STUDENT-USER-ID',  -- ⚠️ REPLACE THIS
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
    'Won first place in competitive programming',
    'approved'  -- Set to 'pending' if you want to test approval flow
);
```

---

## 🚀 Frontend Integration Status

✅ **Your frontend is already perfectly integrated!** 

The frontend code in `/frontend/src/lib/supabase.ts` contains:
- Complete TypeScript types matching the database schema
- Supabase client configuration
- All table definitions and relationships

### 🔗 Key Integration Points:

1. **Authentication Context**: `/frontend/src/contexts/AuthContext.tsx`
   - Handles login/logout
   - Manages user sessions
   - Role-based redirects

2. **Database Types**: `/frontend/src/lib/supabase.ts`
   - Complete TypeScript interfaces
   - All table schemas defined
   - Type-safe database operations

3. **Components**: All components use the Supabase client correctly
   - Achievement submission
   - User authentication  
   - Leaderboard queries
   - Admin operations

---

## ⚡ Quick Setup Steps:

1. **Copy the complete schema** (Part 1) and run in Supabase SQL Editor
2. **Create auth users** in Supabase Auth Dashboard
3. **Get the user IDs** from the auth.users table
4. **Replace the UUIDs** in the user insertion queries (Part 2)
5. **Run the user insertion queries** one by one
6. **Test login** with the created users

Your frontend will automatically work with this database setup! 🎉

---

## 🔍 How to Get Auth User IDs:

After creating users in Supabase Auth Dashboard:

```sql
-- Run this query to see all auth users and their IDs
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;
```

Copy the UUIDs and replace them in the user insertion queries above.
