# 🎓 GITAM Achievement Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8)](https://tailwindcss.com/)

A modern, secure, and mobile-responsive web application for managing student and faculty achievements at GITAM University.

---

## ✨ Features

### 🎯 For Students
- 📝 Submit achievements with certificate uploads
- 📊 Personal dashboard with statistics
- 🏆 Real-time leaderboard rankings
- 🔔 Instant notifications on approval/rejection
- 📱 Mobile-responsive interface
- 📤 Bulk achievement uploads via CSV

### 👨‍🏫 For Faculty
- 🔍 Advanced student search and filtering
- 📈 View student achievement portfolios
- 📊 Track department-wide performance
- ✅ All student features included

### 👨‍💼 For Administrators
- ✔️ Approve/reject achievement submissions
- 📊 Comprehensive analytics dashboard
- 👥 User management system
- 📋 Export reports and data
- 🎯 Configure scoring and ranking rules
- ✅ All faculty and student features

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([Sign up free](https://supabase.com))
- Git

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/deadhearth01/MiniProject-SAP.git
cd MiniProject-SAP
\`\`\`

### 2. Setup Environment Variables

\`\`\`bash
cd frontend
cp .env.example .env.local
\`\`\`

Edit \`.env.local\` with your Supabase credentials:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Setup Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the schema from \`database/FINAL-WORKING-SCHEMA.sql\`
4. (Optional) Run \`database/COMPLETE-SAMPLE-DATA.sql\` for test data

### 4. Install Dependencies

\`\`\`bash
cd frontend
npm install
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/deadhearth01/MiniProject-SAP)

### Manual Deployment

1. **Push to GitHub** (if not already done)
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**
   - Add \`NEXT_PUBLIC_SUPABASE_URL\`
   - Add \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

4. **Deploy!**
   - Click "Deploy"
   - Your app will be live in ~2 minutes

---

## 🔐 Default Test Credentials

**⚠️ Change these in production!**

### Admin
- **Email**: admin@gitam.edu
- **Password**: admin123

### Faculty
- **Email**: rajesh.kumar@gitam.edu
- **Password**: faculty123

### Student
- **Email**: arjun.sharma@gitam.in
- **Password**: student123

---

## 📁 Project Structure

\`\`\`
MiniProject-SAP/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Pages (Next.js 13+ App Router)
│   │   │   ├── dashboard/   # Dashboard page
│   │   │   ├── achievements/# Achievement pages
│   │   │   ├── leaderboard/ # Leaderboard
│   │   │   ├── notifications/
│   │   │   ├── students/    # Student search (faculty)
│   │   │   └── admin/       # Admin panel
│   │   ├── components/      # Reusable React components
│   │   ├── contexts/        # React Context (Auth, etc.)
│   │   ├── lib/            # Utilities (Supabase client)
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets
│   │   └── gitam.png       # GITAM logo
│   ├── .env.example        # Environment template
│   └── package.json        # Dependencies
├── database/               # SQL schemas and migrations
├── documentation/          # Project documentation
├── test-scripts/          # Testing utilities (dev only)
├── vercel.json            # Vercel configuration
└── README.md              # This file
\`\`\`

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.16
- **Icons**: Lucide React 0.548.0
- **State Management**: React Context API

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for certificates)
- **API**: Supabase REST API with Row Level Security

### Security
- ✅ Row Level Security (RLS) policies
- ✅ Role-based access control (RBAC)
- ✅ Secure environment variables
- ✅ Input validation and sanitization
- ✅ XSS and CSRF protection
- ✅ Secure authentication flow

---

## 📱 Mobile Support

Fully responsive design tested on:
- 📱 iPhone SE (375px)
- 📱 iPhone 12/13/14 (390px)
- 📱 Samsung Galaxy (412px)
- 📱 iPad (768px)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1920px+)

---

## 🔒 Security Features

- ✅ Environment variables for sensitive data (never committed)
- ✅ Supabase Row Level Security (RLS) on all tables
- ✅ Role-based access control (Student/Faculty/Admin)
- ✅ Secure password hashing
- ✅ HTTPS enforcement in production
- ✅ Input validation on all forms
- ✅ SQL injection prevention
- ✅ XSS protection (automatic with React)
- ✅ Secure file upload handling

---

## 📚 Documentation

Detailed guides available in \`/documentation\`:
- \`PRODUCTION_DEPLOYMENT_GUIDE.md\` - Complete deployment guide
- \`MANUAL_TESTING_GUIDE.md\` - Testing checklist
- \`MOBILE_OPTIMIZATION_COMPLETE.md\` - Mobile features
- \`QUERY_FIXES_SUMMARY.md\` - Database documentation

---

## 🧪 Testing

Run automated tests:
\`\`\`bash
# Set environment variables first
export SUPABASE_URL='your_url'
export SUPABASE_ANON_KEY='your_key'

cd test-scripts
node test-all-features.js
\`\`\`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

---

## 📋 License

Copyright © 2025 GITAM University. All rights reserved.

---

## 📞 Support

For issues or questions:
- 📧 Email: support@gitam.edu
- 📖 Documentation: \`/documentation\` folder
- 🐛 Issues: [GitHub Issues](https://github.com/deadhearth01/MiniProject-SAP/issues)

---

## 🎯 Quick Deployment Checklist

Before deploying:
- [ ] Setup Supabase project
- [ ] Run database migrations
- [ ] Configure environment variables
- [ ] Test all user roles (Student/Faculty/Admin)
- [ ] Change default passwords
- [ ] Test on mobile devices
- [ ] Run security audit
- [ ] Enable Vercel Analytics (optional)
- [ ] Setup custom domain (optional)

---

## 🌟 Key Highlights

- ⚡ **Blazing Fast**: Built with Next.js 16 and Turbopack
- 🔒 **Secure**: Enterprise-grade security with RLS
- 📱 **Mobile First**: Optimized for all devices
- 🚀 **Easy Deploy**: One-click Vercel deployment
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS
- 📊 **Real-time**: Live updates with Supabase
- ♿ **Accessible**: WCAG compliant design
- 🧪 **Tested**: Comprehensive testing suite

---

**Built with ❤️ using Next.js 16 and Supabase**

---

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Achievements
![Achievements](https://via.placeholder.com/800x400?text=Achievements+Screenshot)

### Leaderboard
![Leaderboard](https://via.placeholder.com/800x400?text=Leaderboard+Screenshot)

---

## 🔄 Recent Updates

- ✅ **v1.0.0** - Initial release with full feature set
- ✅ Mobile optimization complete
- ✅ All security measures implemented
- ✅ Production-ready deployment
- ✅ Comprehensive documentation

---

**Star ⭐ this repo if you find it helpful!**
