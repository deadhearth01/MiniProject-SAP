# Database Setup Instructions

## Step 1: Create Tables in Supabase

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor** 
3. Copy and paste the contents of `step1-create-tables.sql`
4. Click **RUN** and wait for completion

## Step 2: Insert Sample Data

1. After Step 1 completes successfully
2. Copy and paste the contents of `step2-insert-data.sql` 
3. Click **RUN** and wait for completion

## Test Login Credentials

After running both SQL files, you can test with:

### Admin Access:
- **Username**: `ADMIN001`
- **Password**: `any password` (testing mode)

### Faculty Access:
- **Username**: `FAC001` 
- **Password**: `any password` (testing mode)

### Student Access:
- **Username**: `STU001`, `STU002`, `STU003`, `STU004`, `STU005`
- **Password**: `any password` (testing mode)

## Navigation Fix Applied

✅ **Selected tab styling fixed** - Active tabs now show:
- Highlighted background (25% white opacity)
- Bottom border in GITAM accent color
- Better visibility against the green header

## What You'll Get

- **7 User Profiles** (1 admin, 1 faculty, 5 students)
- **Sample Achievements** (approved and pending)
- **Leaderboard Data** with proper rankings
- **Sample Notifications** for testing
- **Fixed Navigation** with proper selected tab highlighting

## Troubleshooting

If you get errors:
1. Make sure to run `step1-create-tables.sql` FIRST
2. Wait for it to complete before running `step2-insert-data.sql`  
3. Check your Supabase project has sufficient permissions

The admin panel navigation should now display properly with all menu items visible on the right side!
