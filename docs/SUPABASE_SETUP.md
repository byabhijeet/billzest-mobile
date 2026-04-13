# Supabase Setup Guide

## Current Configuration

The app is currently configured with hardcoded Supabase credentials in `src/config.ts`:

```typescript
export const CONFIG = {
  SUPABASE_URL: 'https://jjewdwwvgsojvyqkehcx.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
};
```

## Troubleshooting Connection Issues

### 1. Check Supabase Project Status

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Check if your project `jjewdwwvgsojvyqkehcx` exists
3. Verify the project is **Active** (not paused)
4. If paused, click "Restore" to reactivate

### 2. Verify Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Check:
   - **Project URL**: Should match `SUPABASE_URL` in config.ts
   - **anon/public key**: Should match `SUPABASE_ANON_KEY` in config.ts
3. If they don't match, update `src/config.ts` with correct values

### 3. Check Network Connectivity

**For Android Emulator:**
- Use `10.0.2.2` instead of `localhost` if testing locally
- For cloud Supabase, ensure emulator has internet access

**For iOS Simulator:**
- Should work with cloud Supabase URL directly
- Check if simulator has internet access

**For Physical Device:**
- Ensure device is connected to internet
- Check firewall/network restrictions

### 4. Test Connection

Run this in your React Native app console or add to a test screen:

```typescript
import { supabase } from './src/supabase/supabaseClient';

// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('invoices').select('id').limit(1);
    if (error) {
      console.error('Connection Error:', error);
    } else {
      console.log('✅ Connected successfully!', data);
    }
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
};
```

### 5. Common Error Messages

**"Failed to fetch" or Network Error:**
- Check internet connection
- Verify Supabase project is active
- Check if URL is correct (no typos)

**"Invalid API key":**
- Verify `SUPABASE_ANON_KEY` is correct
- Make sure you're using the **anon/public** key, not the service_role key

**"JWT expired" or Auth errors:**
- This is normal for auth operations
- Try logging in again

**"relation does not exist":**
- Database tables might not be created
- Run migrations from `billzestdb.sql`

## Setting Up a New Supabase Project

If you need to create a new project:

### Step 1: Create Project
1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: BillZest Mobile
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

### Step 2: Get Credentials
1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**
   - **anon public** key (NOT service_role)

### Step 3: Update Config
Update `src/config.ts`:

```typescript
export const CONFIG = {
  SUPABASE_URL: 'YOUR_PROJECT_URL_HERE',
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY_HERE',
};
```

### Step 4: Set Up Database
1. Go to **SQL Editor** in Supabase Dashboard
2. Copy contents of `billzestdb.sql`
3. Paste and run in SQL Editor
4. This creates all necessary tables

### Step 5: Configure Row Level Security (RLS)
The database should have RLS policies. Check `billzestdb.sql` for RLS setup.

## Using Environment Variables (Recommended)

For better security, use environment variables:

### Step 1: Install react-native-config (if not installed)
```bash
npm install react-native-config
# or
yarn add react-native-config
```

### Step 2: Create `.env` file
Create `.env` in project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Update `src/config.ts`
```typescript
import Config from 'react-native-config';

export const CONFIG = {
  SUPABASE_URL: Config.SUPABASE_URL || 'https://jjewdwwvgsojvyqkehcx.supabase.co',
  SUPABASE_ANON_KEY: Config.SUPABASE_ANON_KEY || 'fallback-key',
};
```

### Step 4: Add `.env` to `.gitignore`
```
.env
.env.local
```

## Quick Connection Test

Add this to your app temporarily to test:

```typescript
// In App.tsx or any screen
import { supabase } from './src/supabase/supabaseClient';
import { useEffect } from 'react';

useEffect(() => {
  const testConnection = async () => {
    console.log('Testing Supabase connection...');
    console.log('URL:', supabase.supabaseUrl);
    
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('❌ Connection Error:', error.message);
        console.error('Error Code:', error.code);
        console.error('Error Details:', error);
      } else {
        console.log('✅ Connected! Data:', data);
      }
    } catch (err) {
      console.error('❌ Exception:', err);
    }
  };
  
  testConnection();
}, []);
```

## Still Having Issues?

1. **Check Supabase Status**: Visit [status.supabase.com](https://status.supabase.com)
2. **Check Console Logs**: Look for `[Supabase]` prefixed logs
3. **Verify Database Schema**: Ensure tables exist in Supabase Dashboard → Table Editor
4. **Check RLS Policies**: Ensure RLS is configured correctly
5. **Test with curl**:
   ```bash
   curl -X GET 'https://jjewdwwvgsojvyqkehcx.supabase.co/rest/v1/invoices?select=id&limit=1' \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

## Security Notes

⚠️ **Important**: The `SUPABASE_ANON_KEY` is safe to expose in client apps. However:
- Never commit `.env` files with real keys
- Use RLS (Row Level Security) to protect data
- Never use `service_role` key in client apps

