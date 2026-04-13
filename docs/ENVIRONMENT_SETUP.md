# Environment Variables Setup

This guide explains how to set up environment variables for different environments (development, staging, production).

## Current Setup

The app currently uses hardcoded values in `src/config.ts`. For production, we should use environment variables.

## Option 1: Using react-native-config (Recommended)

### Installation

```bash
npm install react-native-config
# or
yarn add react-native-config
```

### iOS Setup

1. Install pods:
```bash
cd ios && pod install && cd ..
```

2. The library should auto-link. If not, follow [react-native-config iOS setup](https://github.com/lugg/react-native-config#ios-setup).

### Android Setup

The library should auto-link. If not, follow [react-native-config Android setup](https://github.com/lugg/react-native-config#android-setup).

### Create Environment Files

Create `.env` files in the project root:

**.env.development**
```env
ENV=development
SUPABASE_URL=https://your-dev-project.supabase.co
SUPABASE_ANON_KEY=your-dev-anon-key
ENABLE_LOGGING=true
```

**.env.staging**
```env
ENV=staging
SUPABASE_URL=https://your-staging-project.supabase.co
SUPABASE_ANON_KEY=your-staging-anon-key
ENABLE_LOGGING=true
```

**.env.production**
```env
ENV=production
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_ANON_KEY=your-prod-anon-key
ENABLE_LOGGING=false
```

### Create .env.example

**.env.example**
```env
ENV=development
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
ENABLE_LOGGING=true
```

### Update .gitignore

Add to `.gitignore`:
```
.env
.env.local
.env.development
.env.staging
.env.production
```

### Update config.ts

```typescript
import Config from 'react-native-config';

const getEnv = () => {
  // In development, __DEV__ is true
  // In production builds, Config.ENV will be set
  if (__DEV__) {
    return Config.ENV || 'development';
  }
  return Config.ENV || 'production';
};

export const CONFIG = {
  ENV: getEnv(),
  SUPABASE_URL: Config.SUPABASE_URL || 'https://jjewdwwvgsojvyqkehcx.supabase.co',
  SUPABASE_ANON_KEY: Config.SUPABASE_ANON_KEY || 'fallback-key',
  ENABLE_LOGGING: Config.ENABLE_LOGGING === 'true',
};
```

### Build Scripts

Update `package.json`:

```json
{
  "scripts": {
    "android": "react-native run-android",
    "android:dev": "ENVFILE=.env.development react-native run-android",
    "android:staging": "ENVFILE=.env.staging react-native run-android",
    "android:prod": "ENVFILE=.env.production react-native run-android",
    "ios": "react-native run-ios",
    "ios:dev": "ENVFILE=.env.development react-native run-ios",
    "ios:staging": "ENVFILE=.env.staging react-native run-ios",
    "ios:prod": "ENVFILE=.env.production react-native run-ios"
  }
}
```

## Option 2: Manual Configuration (Simpler, but less flexible)

### Update config.ts

```typescript
// src/config.ts

// Determine environment
const getEnvironment = () => {
  if (__DEV__) {
    return 'development';
  }
  // In production builds, you can check for specific build variants
  return 'production';
};

const ENV = getEnvironment();

// Environment-specific configurations
const configs = {
  development: {
    SUPABASE_URL: 'https://your-dev-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-dev-anon-key',
    ENABLE_LOGGING: true,
  },
  staging: {
    SUPABASE_URL: 'https://your-staging-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-staging-anon-key',
    ENABLE_LOGGING: true,
  },
  production: {
    SUPABASE_URL: 'https://your-prod-project.supabase.co',
    SUPABASE_ANON_KEY: 'your-prod-anon-key',
    ENABLE_LOGGING: false,
  },
};

export const CONFIG = {
  ENV,
  ...configs[ENV as keyof typeof configs],
};
```

## Android Build Variants

### Update android/app/build.gradle

```gradle
android {
    ...
    
    buildTypes {
        debug {
            applicationIdSuffix ".dev"
            resValue "string", "app_name", "BillZest Dev"
        }
        staging {
            applicationIdSuffix ".staging"
            resValue "string", "app_name", "BillZest Staging"
            signingConfig signingConfigs.release
        }
        release {
            resValue "string", "app_name", "BillZest"
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## iOS Build Configurations

### Create Build Configurations in Xcode

1. Open Xcode project
2. Select project → Info tab
3. Under Configurations, duplicate Debug and Release
4. Name them: Debug-Dev, Debug-Staging, Release-Staging, Release-Prod

### Add User-Defined Settings

1. Select project → Build Settings
2. Add User-Defined Setting: `SUPABASE_URL`
3. Set different values for each configuration

## Security Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use different Supabase projects** for dev/staging/prod
3. **Rotate keys regularly** - Update keys if compromised
4. **Use RLS policies** - Don't rely on key secrecy alone
5. **Review third-party services** - Ensure they follow security best practices

## Verification

Test environment configuration:

```typescript
// In App.tsx or any screen
import { CONFIG } from './src/config';

console.log('Environment:', CONFIG.ENV);
console.log('Supabase URL:', CONFIG.SUPABASE_URL);
console.log('Logging enabled:', CONFIG.ENABLE_LOGGING);
```

## Troubleshooting

### Issue: Environment variables not loading

**Solution:**
1. Ensure `.env` file is in project root
2. Restart Metro bundler
3. Rebuild app (not just reload)
4. Check file name matches `ENVFILE` in script

### Issue: Different values in dev vs production

**Solution:**
1. Verify build configuration
2. Check if `__DEV__` is correctly set
3. Verify environment file is being read
4. Check for caching issues

### Issue: Keys exposed in bundle

**Solution:**
1. Use ProGuard/R8 for Android (obfuscation)
2. Use environment variables, not hardcoded values
3. Remember: anon keys are safe to expose (RLS protects data)

