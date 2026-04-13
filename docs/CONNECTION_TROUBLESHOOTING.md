# Connection Troubleshooting

> **Note:** For Android emulator-specific network issues, see [`ANDROID_NETWORK_FIX.md`](./ANDROID_NETWORK_FIX.md)

## Immediate Checks

### 1. Check Console Logs
When the app starts, you should see:
```
[Supabase] Initializing client...
[Supabase] URL: https://jjewdwwvgsojvyqkehcx.supabase.co
[Supabase] Client initialized: true
```

If you see errors here, the config is wrong.

### 2. Common Issues & Solutions

#### Issue: "Failed to fetch" or Network Error
**Possible Causes:**
- Supabase project is paused
- Internet connection issue
- Wrong URL in config

**Solution:**
1. Check [Supabase Dashboard](https://supabase.com/dashboard)
2. Verify project `jjewdwwvgsojvyqkehcx` exists and is active
3. If paused, click "Restore Project"

#### Issue: "Invalid API key" or 401 Unauthorized
**Possible Causes:**
- Wrong anon key
- Key expired (unlikely)
- Using service_role key instead of anon key

**Solution:**
1. Go to Supabase Dashboard → Settings → API
2. Copy the **anon public** key (NOT service_role)
3. Update `src/config.ts` with correct key

#### Issue: "relation does not exist" or Table Not Found
**Possible Causes:**
- Database tables not created
- Wrong database schema

**Solution:**
1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `billzestdb.sql`
3. Verify tables exist in Table Editor

#### Issue: App Crashes on Startup
**Possible Causes:**
- Config file has syntax error
- Missing dependencies

**Solution:**
1. Check `src/config.ts` syntax
2. Run `npm install` or `yarn install`
3. Clear cache: `npm start -- --reset-cache`

## Quick Test

Add this to your LoginScreen or any screen temporarily:

```typescript
import { useEffect } from 'react';
import { testSupabaseConnection } from '../utils/testSupabaseConnection';

// In your component
useEffect(() => {
  testSupabaseConnection().then(result => {
    console.log('Connection Test:', result);
    if (!result.success) {
      Alert.alert('Connection Failed', result.message);
    }
  });
}, []);
```

## Verify Supabase Project

1. **Check Project Status:**
   - Visit: https://supabase.com/dashboard/project/jjewdwwvgsojvyqkehcx
   - Should show "Active" status

2. **Verify Credentials:**
   - Settings → API
   - Project URL should match config
   - Copy anon public key and compare with config

3. **Check Database:**
   - Table Editor → Should see tables like `invoices`, `products`, `parties`, etc.
   - If empty, run `billzestdb.sql` in SQL Editor

## Network-Specific Issues

### Android Emulator
- Use cloud URL (already configured)
- Check emulator has internet: Open browser in emulator

### iOS Simulator
- Should work with cloud URL
- Check simulator network settings

### Physical Device
- Ensure device connected to WiFi/Mobile data
- Check if corporate firewall blocks Supabase

## Still Not Working?

1. **Check Supabase Status Page:**
   - https://status.supabase.com

2. **Test with curl:**
   ```bash
   curl -X GET 'https://jjewdwwvgsojvyqkehcx.supabase.co/rest/v1/invoices?select=id&limit=1' \
     -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY"
   ```

3. **Check React Native Logs:**
   ```bash
   # Android
   npx react-native log-android
   
   # iOS
   npx react-native log-ios
   ```

4. **Create New Project (if current one is broken):**
   - See `docs/SUPABASE_SETUP.md` for instructions

