# 🚀 Production Deployment Guide

## Pre-Deployment Security Checklist

### ✅ Environment Variables
- [x] `.env.local` is in `.gitignore`
- [x] `.env.example` created with template
- [x] No hardcoded API keys in source code
- [ ] Production Supabase keys configured
- [ ] Environment variables added to deployment platform

### ✅ Authentication & Authorization
- [x] Supabase Row Level Security (RLS) enabled
- [x] Role-based access control implemented
- [ ] Default passwords changed
- [ ] Password complexity enforced
- [x] Secure session management

### ✅ Database Security
- [x] RLS policies for all tables
- [x] Secure foreign key relationships
- [ ] Regular database backups configured
- [x] SQL injection prevention (using Supabase client)

### ✅ Code Security
- [x] No console.logs with sensitive data in production
- [x] Error messages don't expose system details
- [x] Input validation on all forms
- [x] XSS protection (React automatic escaping)
- [x] CSRF protection (Supabase handles this)

### ✅ File Security
- [x] No sensitive files committed to git
- [x] `.DS_Store` in `.gitignore`
- [x] `node_modules` in `.gitignore`
- [x] Test scripts organized separately
- [ ] Production build tested

---

## 🔧 Deployment Steps

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git status

# Update .gitignore if needed
cat frontend/.gitignore

# Remove any accidental commits of sensitive files
git rm --cached frontend/.env.local  # if accidentally committed
```

### Step 2: Set Up Environment Variables

**For Vercel:**
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

**For Other Platforms:**
- Create `.env.production` or use platform's env variable interface
- Never commit `.env.production` to git

### Step 3: Build and Test

```bash
cd frontend
npm run build
npm start  # Test production build locally
```

### Step 4: Deploy

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Or connect via GitHub
# 1. Push to GitHub
# 2. Import on vercel.com
# 3. Add environment variables
# 4. Deploy
```

#### Option B: Self-Hosted
```bash
# Build
cd frontend
npm run build

# Start with PM2
pm2 start npm --name "gitam-portal" -- start
pm2 save
pm2 startup
```

### Step 5: Configure Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

**Self-Hosted:**
1. Configure Nginx/Apache reverse proxy
2. Set up SSL with Let's Encrypt
3. Configure DNS A/CNAME records

---

## 🔐 Post-Deployment Security

### 1. Change Default Passwords

```sql
-- Run in Supabase SQL Editor
UPDATE public.users
SET password_hash = crypt('new_secure_password', gen_salt('bf'))
WHERE email = 'admin@gitam.edu';

UPDATE public.users
SET password_hash = crypt('new_secure_password', gen_salt('bf'))
WHERE email LIKE '%@gitam.edu';
```

**Or use Supabase Auth Dashboard:**
1. Go to Authentication → Users
2. Click on each user
3. Send password reset email

### 2. Review Supabase Security

**RLS Policies:**
```sql
-- Verify RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

**API Keys:**
- Ensure using `anon` key for frontend (not `service_role`)
- `service_role` key should NEVER be exposed to client
- Keep `service_role` key only on backend services

### 3. Configure CORS

**In Supabase Dashboard:**
- Settings → API
- Add your production domain to allowed origins
- Example: `https://portal.gitam.edu`

### 4. Enable Rate Limiting

**Supabase automatically provides:**
- Rate limiting on API calls
- Connection pooling
- DDoS protection

**Additional (if needed):**
- Use Vercel's Edge Functions for additional rate limiting
- Implement API request throttling

---

## 📊 Monitoring & Maintenance

### Performance Monitoring

**Vercel Analytics:**
```bash
# Add to package.json
npm install @vercel/analytics
```

**Supabase Monitoring:**
- Dashboard → Usage
- Track API calls, storage, database queries
- Set up alerts for quota limits

### Error Tracking

**Sentry Integration (Optional):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### Backup Strategy

**Database Backups:**
1. Supabase automatic daily backups (Pro plan)
2. Manual exports via SQL Editor
3. Download as CSV for data backup

**File Backups:**
- Achievement certificates in Supabase Storage
- Enable versioning in Storage settings
- Regular exports to cloud storage

---

## 🧪 Production Testing

### Automated Tests
```bash
cd test-scripts
node test-all-features.js
```

### Manual Testing Checklist
- [ ] Login with all user roles
- [ ] Submit achievement as student
- [ ] Approve achievement as admin
- [ ] Search students as faculty
- [ ] Check leaderboard
- [ ] Test notifications
- [ ] Mobile responsiveness
- [ ] File upload
- [ ] Bulk upload
- [ ] Error handling

### Performance Testing
```bash
# Use Lighthouse
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

---

## 🚨 Troubleshooting

### Common Issues

**1. Environment Variables Not Working**
```bash
# Verify variables are set
echo $NEXT_PUBLIC_SUPABASE_URL

# Rebuild after changing env vars
npm run build
```

**2. Supabase Connection Fails**
- Check Supabase project status
- Verify API keys are correct
- Check network/firewall settings
- Review Supabase logs

**3. 404 on Routes**
- Check `vercel.json` configuration
- Verify all pages are built
- Check middleware configuration

**4. Slow Performance**
- Enable Next.js Image Optimization
- Check database query efficiency
- Review Supabase indexes
- Enable caching

---

## 📈 Scaling Considerations

### When to Scale

**Supabase:**
- Free tier: Up to 500MB database
- Pro tier: Unlimited database, better performance
- Enterprise: Custom scaling

**Vercel:**
- Hobby: Good for testing
- Pro: Production sites with analytics
- Enterprise: High traffic sites

### Optimization Tips

**1. Database Indexes**
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_status ON achievements(status);
```

**2. Image Optimization**
- Use Next.js Image component
- Compress certificates before upload
- Use WebP format

**3. Code Splitting**
- Already implemented with Next.js App Router
- Lazy load heavy components

**4. Caching**
```typescript
// In Next.js 13+, use cache
import { cache } from 'react'

export const getAchievements = cache(async () => {
  // Fetching logic
})
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      - run: cd frontend && npm test
```

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Weekly:**
- [ ] Review Supabase logs
- [ ] Check error rates
- [ ] Monitor storage usage

**Monthly:**
- [ ] Database backup verification
- [ ] Security updates
- [ ] Performance audit
- [ ] User feedback review

**Quarterly:**
- [ ] Full security audit
- [ ] Dependency updates
- [ ] Feature usage analysis
- [ ] Infrastructure review

---

## 🎯 Production Checklist Summary

### Pre-Launch
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Default passwords changed
- [ ] Database backups configured
- [ ] Error tracking enabled
- [ ] Performance optimized (Lighthouse > 90)
- [ ] Mobile tested on real devices
- [ ] SSL certificate configured
- [ ] Custom domain configured
- [ ] Monitoring set up

### Post-Launch
- [ ] Monitor for 24 hours
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Document any issues
- [ ] Plan first updates

---

## 📄 Important URLs

**Production:**
- Frontend: `https://your-domain.com`
- Supabase Dashboard: `https://app.supabase.com/project/[project-id]`
- Vercel Dashboard: `https://vercel.com/[username]/[project]`

**Documentation:**
- `/documentation/` - All project docs
- `/database/` - SQL schemas
- `/test-scripts/` - Test utilities

---

**Last Updated:** October 31, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
