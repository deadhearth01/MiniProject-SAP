# 🔐 GITAM Achievement Portal - Sample Login Credentials

## 🚀 Quick Setup Instructions

### Step 1: Run Database Schema
1. Go to **Supabase Dashboard → SQL Editor**
2. Copy and paste the entire content from `supabase-database.sql`
3. Click **"Run"** to create all tables, policies, and functions

### Step 2: Create Sample Users
Go to **Supabase Dashboard → Authentication → Users** and create these users:

---

## 👥 Sample User Accounts

### 🛡️ **ADMIN USER**
- **Email**: `admin@gitam.edu`
- **Password**: `Admin@123`
- **Role**: Administrator (Can approve achievements, view analytics)
- **Access**: All features + Admin panel

### 👨‍🏫 **FACULTY USER** 
- **Email**: `rajesh.kumar@gitam.edu`
- **Password**: `Faculty@123`
- **Role**: Faculty Member (Can search students, export data)
- **Access**: All student features + Faculty tools

### 🎓 **STUDENT USERS**

#### Student 1
- **Email**: `arjun.sharma@gitam.in`
- **Password**: `Student@123`
- **Role**: Student (Submit achievements, view leaderboard)
- **Profile**: 3rd Year CSE, AI Specialization

#### Student 2
- **Email**: `priya.patel@gitam.in`
- **Password**: `Student@123`
- **Role**: Student 
- **Profile**: 3rd Year ECE, VLSI Design Specialization

#### Student 3
- **Email**: `kiran.reddy@gitam.in`
- **Password**: `Student@123`
- **Role**: Student
- **Profile**: 3rd Year Mechanical, Robotics Specialization

---

## ⚡ After Creating Auth Users

### Step 3: Get User IDs and Create Profiles

1. **Get the User IDs** from Supabase:
   ```sql
   SELECT id, email FROM auth.users ORDER BY created_at DESC;
   ```

2. **Insert User Profiles** (Replace UUIDs with actual IDs from Step 1):

#### Admin Profile
```sql
INSERT INTO public.users (
    id, name, roll_number_faculty_id, school, branch, year_designation, 
    email, contact, password_hash, is_admin, is_faculty
) VALUES (
    'REPLACE-WITH-ADMIN-UUID',
    'GITAM Administrator',
    'ADMIN001',
    'School of Technology',
    'Administration',
    'Administrator',
    'admin@gitam.edu',
    '+91-9876543210',
    'managed_by_supabase_auth',
    true, true
);
```

#### Faculty Profile  
```sql
INSERT INTO public.users (
    id, name, roll_number_faculty_id, school, branch, year_designation,
    email, contact, password_hash, is_admin, is_faculty
) VALUES (
    'REPLACE-WITH-FACULTY-UUID',
    'Dr. Rajesh Kumar',
    'FAC001',
    'School of Technology', 
    'Computer Science Engineering',
    'Assistant Professor',
    'rajesh.kumar@gitam.edu',
    '+91-9876543211',
    'managed_by_supabase_auth',
    false, true
);
```

#### Student Profiles
```sql
-- Student 1: Arjun Sharma
INSERT INTO public.users (
    id, name, roll_number_faculty_id, batch, school, branch, specialization,
    year_designation, email, contact, password_hash, is_admin, is_faculty
) VALUES (
    'REPLACE-WITH-STUDENT1-UUID',
    'Arjun Sharma', '22UCS001', '2022-2026', 'School of Technology',
    'Computer Science Engineering', 'Artificial Intelligence', '3rd Year',
    'arjun.sharma@gitam.in', '+91-9876543212', 'managed_by_supabase_auth', false, false
);

-- Student 2: Priya Patel  
INSERT INTO public.users (
    id, name, roll_number_faculty_id, batch, school, branch, specialization,
    year_designation, email, contact, password_hash, is_admin, is_faculty
) VALUES (
    'REPLACE-WITH-STUDENT2-UUID',
    'Priya Patel', '22UEC002', '2022-2026', 'School of Technology',
    'Electronics and Communication Engineering', 'VLSI Design', '3rd Year',
    'priya.patel@gitam.in', '+91-9876543213', 'managed_by_supabase_auth', false, false
);

-- Student 3: Kiran Reddy
INSERT INTO public.users (
    id, name, roll_number_faculty_id, batch, school, branch, specialization,
    year_designation, email, contact, password_hash, is_admin, is_faculty  
) VALUES (
    'REPLACE-WITH-STUDENT3-UUID',
    'Kiran Reddy', '22UME003', '2022-2026', 'School of Technology',
    'Mechanical Engineering', 'Robotics', '3rd Year',
    'kiran.reddy@gitam.in', '+91-9876543214', 'managed_by_supabase_auth', false, false
);
```

---

## 🧪 **Testing the Application**

### Login and Test Features:

1. **Start your application**: `npm run dev` (in frontend folder)
2. **Visit**: http://localhost:3000
3. **Test each role**:

#### 🛡️ **As Admin** (`admin@gitam.edu` / `Admin@123`):
- View admin dashboard with analytics
- Go to Admin → Approvals to approve/reject achievements  
- See all user statistics and data

#### 👨‍🏫 **As Faculty** (`rajesh.kumar@gitam.edu` / `Faculty@123`):
- Search and view all students
- Browse all achievements
- Access export functionality

#### 🎓 **As Student** (`arjun.sharma@gitam.in` / `Student@123`):
- Submit new achievements with file uploads
- View personal dashboard and statistics
- Check leaderboard rankings
- View notifications

---

## 📊 **Sample Achievement Data** (Optional)

After setting up users, you can add sample achievements for testing:

```sql
-- Sample achievement (replace user_id with actual student UUID)
INSERT INTO public.achievements (
    user_id, event_name, category, level, date, position,
    school, branch, batch, organizer, place, remarks, status
) VALUES (
    'REPLACE-WITH-STUDENT-UUID',
    'National Programming Contest 2024',
    'Co-curricular', 'National', '2024-08-15', '1st',
    'School of Technology', 'Computer Science Engineering', '2022-2026',
    'IEEE Computer Society', 'Delhi, India', 
    'Won first place in competitive programming', 'approved'
);
```

---

## 🎯 **Ready to Use!**

Your GITAM Achievement Portal is now ready with:
- ✅ Complete database with all tables and security
- ✅ Sample user accounts for all roles  
- ✅ Frontend perfectly integrated
- ✅ Authentication system working
- ✅ File upload capabilities
- ✅ Real-time notifications
- ✅ Leaderboard system

**Just create the auth users, insert the profiles, and start testing!** 🚀
