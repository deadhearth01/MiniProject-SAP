    -- =============================================
    -- GET YOUR REAL UUIDs - RUN THIS FIRST
    -- =============================================

    -- 🔍 STEP 1: Run this query to see your actual auth users:
    SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

    -- 📋 STEP 2: You should see something like this (but with YOUR real UUIDs):
    -- id                                   | email                     | created_at
    -- -------------------------------------|---------------------------|-------------------------
    -- a1b2c3d4-e5f6-7890-abcd-ef1234567890 | admin@gitam.edu          | 2024-09-26 10:30:00
    -- b2c3d4e5-f6g7-8901-bcde-f12345678901 | rajesh.kumar@gitam.edu   | 2024-09-26 10:31:00
    -- c3d4e5f6-g7h8-9012-cdef-123456789012 | arjun.sharma@gitam.in    | 2024-09-26 10:32:00

    -- 🎯 STEP 3: If you DON'T see any users, you need to create them first!
    -- Go to: Supabase Dashboard → Authentication → Users → "Add User"
    -- Create these users:

    -- Email: admin@gitam.edu, Password: Admin@123
    -- Email: rajesh.kumar@gitam.edu, Password: Faculty@123  
    -- Email: arjun.sharma@gitam.in, Password: Student@123
    -- Email: priya.patel@gitam.in, Password: Student@123
    -- Email: kiran.reddy@gitam.in, Password: Student@123

    -- 🔄 STEP 4: After creating users, run the SELECT query again to get real UUIDs

    -- =============================================
    -- EXAMPLE: USING REAL UUIDs (REPLACE WITH YOURS)
    -- =============================================

    -- ❌ DON'T USE THESE - THEY'RE JUST EXAMPLES:
    -- '12345678-1234-1234-1234-123456789abc'  <- This is fake!
    -- '87654321-4321-4321-4321-cba987654321'  <- This is fake!

    -- ✅ USE YOUR ACTUAL UUIDs FROM THE SELECT QUERY ABOVE!

    -- Example with real format (you'll get different UUIDs):
    -- INSERT INTO public.users (id, name, ...) VALUES (
    --     'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  <- Your real admin UUID
    --     'GITAM Administrator',
    --     ...
    -- );

    -- =============================================
    -- QUICK TEST: Check if you have auth users
    -- =============================================
    SELECT COUNT(*) as total_auth_users FROM auth.users;

    -- If this returns 0, you need to create users in Supabase Dashboard first!
    -- If this returns 5, you have all the users and can proceed with INSERT queries.

    -- =============================================
    -- TROUBLESHOOTING
    -- =============================================

    -- ❌ Error: "Key (id)=(xyz) is not present in table users"
    -- Solution: The UUID doesn't exist in auth.users. Check your SELECT results.

    -- ❌ Error: "invalid input syntax for type uuid"  
    -- Solution: Make sure UUID is in quotes and proper format: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

    -- ❌ Error: "duplicate key value violates unique constraint"
    -- Solution: User already exists, skip that INSERT or DELETE first.

    -- =============================================
    -- NEXT STEPS
    -- =============================================

    -- 1. Run: SELECT id, email FROM auth.users ORDER BY created_at DESC;
    -- 2. Copy your REAL UUIDs (not the examples!)  
    -- 3. Replace the UUIDs in your INSERT queries
    -- 4. Run each INSERT query one by one
