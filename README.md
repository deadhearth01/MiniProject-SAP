# GITAM Achievement Portal

A comprehensive web portal for managing student and faculty achievements at Gandhi Institute of Technology and Management (GITAM).

## 🚀 Features

### For Students
- **Submit Achievements**: Easy form to submit achievements with file uploads
- **Personal Dashboard**: View your achievements, points, and leaderboard position
- **Achievement Showcase**: Browse all approved achievements from the community
- **Leaderboard**: Compete with peers and track your ranking
- **Notifications**: Get notified when achievements are approved/rejected

### For Faculty
- **Student Search**: Search and view specific student achievements
- **Achievement Management**: View detailed achievement information
- **Data Export**: Export achievement data for analysis
- **All features available to students**

### For Admins
- **Approval System**: Review and approve/reject achievement submissions
- **Analytics Dashboard**: View comprehensive statistics and trends
- **User Management**: Manage user roles and permissions
- **Leaderboard Management**: Configure scoring rules and rankings
- **Data Export**: Export comprehensive reports
- **All features available to faculty and students**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Functions)
- **UI Components**: Hero UI, Lucide React Icons
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics
- **File Uploads**: Supabase Storage
- **Authentication**: Supabase Auth with Row Level Security

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MiniProject
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create `.env.local` in the frontend directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://uabapzejhthbsahxtikh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhYmFwemVqaHRoYnNhaHh0aWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NzI3MzUsImV4cCI6MjA3NDQ0ODczNX0.iBaqblA6_yJxevCXTgr7s22uJQLvpCRV0IMkmm2L81o
```

### 4. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from `backend/supabase-setup.md`
4. Set up storage buckets for file uploads
5. Configure authentication settings

### 5. Run the Application
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🎨 GITAM Branding

The application uses GITAM's official color scheme:
- **Primary**: #007367 (Teal Green)
- **Accent**: #f0e0c1 (Light Gold)
- **Dark**: #005a52 (Dark Teal)
- **Light**: #f7f2e8 (Light Cream)

## 📱 Responsive Design

The portal is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🔐 Authentication & Authorization

### User Roles
1. **Student**: Can submit and view achievements, access leaderboard
2. **Faculty**: Student features + search students, view all achievements, export data
3. **Admin**: All features + approve/reject submissions, analytics, user management

### Security Features
- Row Level Security (RLS) with Supabase
- Role-based access control
- Secure file uploads
- Protected routes
- Data validation and sanitization

## 📊 Achievement Scoring System

Points are calculated based on:
- **Level**: International (100), National (75), State (50), College (25)
- **Position**: 1st (100%), 2nd (80%), 3rd (60%), Participation (30%), Other (50%)

Example: 1st place in National competition = 75 × 100% = 75 points

## 📈 Leaderboard System

- **Time-based rankings**: All-time, yearly, semester, monthly
- **Category filtering**: Filter by achievement categories
- **Real-time updates**: Automatic rank recalculation
- **Gamification**: Badges and trophies for top performers

## 🗃️ Database Schema

### Tables
- `users`: User profiles and role management
- `achievements`: Achievement submissions and approvals
- `leaderboard`: Ranking and points calculation
- `notifications`: User notifications and alerts

### Storage Buckets
- `achievement-proofs`: Certificate/proof documents
- `event-photos`: Event photos and media
- `profile-photos`: User profile pictures

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Supabase)
- Database: Already hosted on Supabase
- Storage: Configured in Supabase dashboard
- Functions: Deploy via Supabase CLI if needed

## 📝 API Endpoints

The application uses Supabase's auto-generated REST API:

### Authentication
- `POST /auth/login` - User login
- `GET /auth/user` - Get current user
- `POST /auth/logout` - User logout

### Achievements
- `GET /achievements` - List achievements (filtered by role)
- `POST /achievements` - Submit new achievement
- `PUT /achievements/:id` - Update achievement (admin only)
- `GET /achievements/:id` - Get achievement details

### Leaderboard
- `GET /leaderboard` - Get leaderboard data
- `GET /leaderboard/user/:id` - Get user ranking

### Admin
- `GET /achievements/pending` - Get pending approvals
- `PUT /achievements/:id/approve` - Approve achievement
- `PUT /achievements/:id/reject` - Reject achievement

## 🧪 Testing

### Running Tests
```bash
npm run test
```

### Test Accounts
Create test accounts for different roles:
1. Student account (roll number format: 22UCS001)
2. Faculty account (faculty ID format: FAC001)  
3. Admin account (set is_admin = true in database)

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Error**
   - Check Supabase URL and anon key
   - Verify user exists in both auth.users and public.users tables

2. **File Upload Issues**
   - Check storage bucket permissions
   - Verify RLS policies for storage

3. **Database Permission Errors**
   - Review RLS policies
   - Check user roles in database

4. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

## 📞 Support

For technical support or questions about the GITAM Achievement Portal:
- Email: support@gitam.edu
- Documentation: Check the `/backend/supabase-setup.md` for database setup
- Issues: Create an issue in the project repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is developed for Gandhi Institute of Technology and Management (GITAM) and is intended for internal use.

## 🙏 Acknowledgments

- GITAM University for the opportunity
- Supabase for the excellent backend platform
- The open-source community for the amazing tools and libraries

---

**Built with ❤️ for GITAM University**
