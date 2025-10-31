# 🛠️ GITAM Achievement Portal - Technology Stack

## 📋 Overview

The GITAM Achievement Portal is a modern web application built with cutting-edge technologies to provide a seamless experience for managing student and faculty achievements at Gandhi Institute of Technology and Management.

## 🏗️ Architecture

### **Frontend Architecture**
- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.16
- **State Management**: React Context API
- **Routing**: Next.js App Router (File-based routing)

### **Backend Architecture**
- **Platform**: Supabase (PostgreSQL + Auth + Storage + Functions)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with JWT tokens
- **File Storage**: Supabase Storage for achievement proofs
- **API**: Supabase REST API with real-time subscriptions

### **Deployment Architecture**
- **Platform**: Vercel
- **Build Tool**: Turbopack (Next.js 16)
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain support

---

## 📚 Core Technologies

### **Frontend Framework**
```json
{
  "next": "^16.0.1",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "typescript": "^5.9.3"
}
```

**Why Next.js 16?**
- Latest App Router for better performance
- Server Components for improved SEO
- Built-in API routes (though we use Supabase)
- Automatic code splitting and optimization
- Turbopack for faster development builds

### **UI & Styling**
```json
{
  "@heroui/react": "^2.8.4",
  "@heroui/theme": "^2.4.22",
  "tailwindcss": "^4.1.16",
  "lucide-react": "^0.548.0",
  "autoprefixer": "^10.4.21"
}
```

**UI Component Library**: Hero UI
- Modern, accessible components
- Built on top of Tailwind CSS
- Consistent design system
- Dark mode support

**Icons**: Lucide React
- Consistent icon set
- Tree-shakable imports
- Customizable styling

### **Forms & Validation**
```json
{
  "react-hook-form": "^7.63.0",
  "@hookform/resolvers": "^5.2.2",
  "zod": "^4.1.11"
}
```

**Form Management**: React Hook Form
- Performance optimized
- Minimal re-renders
- Built-in validation

**Schema Validation**: Zod
- TypeScript-first validation
- Runtime type checking
- Excellent developer experience

### **Data Visualization**
```json
{
  "recharts": "^3.2.1"
}
```

**Charts Library**: Recharts
- React components for charts
- Responsive design
- Customizable styling
- Multiple chart types

### **File Processing**
```json
{
  "xlsx": "^0.18.5"
}
```

**Excel Export**: SheetJS (xlsx)
- Client-side Excel generation
- Multiple format support
- Lightweight and fast

### **Date Handling**
```json
{
  "date-fns": "^4.1.0"
}
```

**Date Utilities**: date-fns
- Modular date functions
- Tree-shakable
- Immutable operations

---

## 🔧 Development Tools

### **Build & Development**
```json
{
  "@types/node": "^24.9.2",
  "@types/react": "^19.2.2",
  "@types/react-dom": "^19.2.2",
  "eslint": "^9.38.0",
  "eslint-config-next": "^16.0.1"
}
```

**TypeScript**: Full type safety across the application
**ESLint**: Code quality and consistency
**Next.js ESLint Config**: Framework-specific rules

### **Package Management**
- **npm**: Primary package manager
- **Monorepo Structure**: Frontend in subdirectory
- **Lockfiles**: Separate lockfiles for root and frontend

---

## 🗄️ Database Schema

### **Core Tables**

#### **Users Table**
```sql
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
    academic_year_id uuid REFERENCES public.academic_years,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
```

#### **Achievements Table**
```sql
CREATE TABLE public.achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    event_name text NOT NULL,
    category text NOT NULL,
    level text NOT NULL,
    date date NOT NULL,
    position text,
    school text,
    branch text,
    specialization text,
    batch text,
    organizer text,
    place text,
    proof_file_path text,
    remarks text,
    status text DEFAULT 'pending',
    points integer DEFAULT 0,
    approved_by uuid,
    approved_at timestamp with time zone,
    submitted_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
```

#### **Academic Years Table**
```sql
CREATE TABLE public.academic_years (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    year_name text NOT NULL UNIQUE,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_current boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);
```

#### **Faculty Info Table**
```sql
CREATE TABLE public.faculty_info (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE UNIQUE NOT NULL,
    designation text,
    department text,
    research_interests text[],
    editorial_memberships text[],
    reviewer_for text[],
    awards_received text[],
    guest_lectures text[],
    created_at timestamp with time zone DEFAULT now()
);
```

#### **Leaderboard Table**
```sql
CREATE TABLE public.leaderboard (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users ON DELETE CASCADE,
    total_points integer DEFAULT 0,
    achievement_count integer DEFAULT 0,
    rank integer,
    last_updated timestamp with time zone DEFAULT now()
);
```

---

## 🔐 Security & Authentication

### **Supabase Auth Configuration**
```typescript
{
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'gitam-auth-token',
  }
}
```

### **Row Level Security (RLS) Policies**
- **Users**: Can only access their own data
- **Achievements**: Users see their own, admins/faculty see all
- **Faculty Info**: Faculty-only access
- **Admin Data**: Admin-only access

### **Security Features**
- JWT token-based authentication
- Automatic token refresh
- Secure password hashing
- Session persistence with localStorage
- PKCE flow for enhanced security

---

## 🚀 Deployment & DevOps

### **Vercel Configuration**
```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### **Middleware Configuration**
```typescript
// Route protection and caching control
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
```

### **Environment Variables**
```bash
# Required Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📊 Performance Optimizations

### **Next.js Optimizations**
- **App Router**: File-based routing with layouts
- **Server Components**: Improved performance and SEO
- **Automatic Code Splitting**: Optimized bundle sizes
- **Image Optimization**: Built-in Next.js Image component
- **Turbopack**: Faster development builds

### **Database Optimizations**
- **Indexes**: Optimized queries with proper indexing
- **Pagination**: Limited result sets for performance
- **Parallel Queries**: Promise.all for concurrent data fetching
- **Caching**: Appropriate cache headers in middleware

### **Frontend Optimizations**
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Debounced Search**: Optimized search performance
- **Virtual Scrolling**: For large lists (future enhancement)

---

## 🧪 Testing Strategy

### **Current Testing**
- **Manual Testing**: Comprehensive user flow testing
- **Build Testing**: Automated build verification
- **Type Checking**: TypeScript strict mode

### **Future Testing Enhancements**
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Supabase testing utilities
- **E2E Tests**: Playwright or Cypress
- **Performance Tests**: Lighthouse CI

---

## 📈 Monitoring & Analytics

### **Error Tracking**
- **Console Logging**: Comprehensive error logging
- **Auth Debugging**: Auth state monitoring
- **Performance Monitoring**: Build and runtime metrics

### **Analytics (Future)**
- **User Analytics**: Vercel Analytics
- **Performance Metrics**: Core Web Vitals
- **Error Monitoring**: Sentry integration

---

## 🔄 Development Workflow

### **Local Development**
```bash
# Install dependencies
npm run install-frontend

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### **Code Quality**
```bash
# Lint code
npm run lint

# Type checking
npm run build # Includes TypeScript checking
```

### **Git Workflow**
- **Main Branch**: Production deployments
- **Feature Branches**: New features and fixes
- **Pull Requests**: Code review process
- **Automated Deployment**: Vercel auto-deployment on main

---

## 📚 Key Dependencies Breakdown

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.0.1 | React framework with App Router |
| `react` | 19.2.0 | UI library |
| `@supabase/supabase-js` | 2.78.0 | Backend-as-a-Service client |
| `@heroui/react` | 2.8.4 | UI component library |
| `tailwindcss` | 4.1.16 | Utility-first CSS framework |
| `react-hook-form` | 7.63.0 | Form state management |
| `zod` | 4.1.11 | Schema validation |
| `recharts` | 3.2.1 | Data visualization |
| `xlsx` | 0.18.5 | Excel file processing |
| `lucide-react` | 0.548.0 | Icon library |

---

## 🎯 Architecture Decisions

### **Why Supabase?**
- **Integrated Solution**: Database + Auth + Storage + Functions
- **PostgreSQL**: Robust, scalable database
- **Real-time**: Live updates for collaborative features
- **Security**: Built-in RLS and authentication
- **Developer Experience**: Excellent DX with TypeScript support

### **Why Next.js 16?**
- **Performance**: App Router with Server Components
- **SEO**: Server-side rendering capabilities
- **Developer Experience**: Hot reload, TypeScript support
- **Ecosystem**: Large community and extensive tooling

### **Why Hero UI + Tailwind?**
- **Consistency**: Design system with Tailwind utilities
- **Accessibility**: Built-in ARIA support
- **Performance**: Optimized components
- **Customization**: Extensive theming capabilities

### **Why Vercel?**
- **Next.js Integration**: Seamless deployment
- **Performance**: Global CDN and edge functions
- **Developer Experience**: Preview deployments, analytics
- **Scalability**: Automatic scaling and optimization

---

## 🚀 Future Enhancements

### **Short Term**
- [ ] Add unit tests with Jest
- [ ] Implement error monitoring with Sentry
- [ ] Add performance monitoring
- [ ] Implement dark mode toggle

### **Medium Term**
- [ ] Add real-time notifications
- [ ] Implement advanced search filters
- [ ] Add bulk operations for admins
- [ ] Mobile app with React Native

### **Long Term**
- [ ] AI-powered achievement categorization
- [ ] Advanced analytics dashboard
- [ ] Integration with university systems
- [ ] Multi-language support

---

## 📞 Support & Maintenance

### **Technology Support**
- **Next.js**: Active LTS support until 2026
- **Supabase**: Enterprise-grade reliability
- **React**: Long-term support with 18+ months notice
- **TypeScript**: Stable with regular updates

### **Security Updates**
- **Automated Updates**: Dependabot for dependency updates
- **Security Audits**: Regular security scanning
- **Vulnerability Patching**: Prompt security updates

### **Performance Monitoring**
- **Build Metrics**: Vercel build analytics
- **Runtime Performance**: Core Web Vitals tracking
- **Error Tracking**: Comprehensive error logging

---

*This documentation is maintained alongside the codebase. Last updated: October 31, 2025*</content>
<parameter name="filePath">/Volumes/SSD_1TB/vscode/MiniProject-SAP/TECH_STACK.md