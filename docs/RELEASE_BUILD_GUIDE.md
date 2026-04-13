# Release Build Guide

This guide explains how to create release builds for Android and iOS.

## Prerequisites

- [ ] All tests pass
- [ ] Version numbers updated
- [ ] Environment variables configured
- [ ] Signing certificates ready
- [ ] App icons and splash screens ready

---

## Android Release Build

### Step 1: Update Version

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        versionCode 1  // Increment for each release
        versionName "1.0.0"  // Update version number
    }
}
```

### Step 2: Configure Signing

1. Generate signing key (if not exists):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore billzest-release.keystore -alias billzest-key -keyalg RSA -keysize 2048 -validity 10000
```

2. Create `android/keystore.properties`:
```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=billzest-key
storeFile=../billzest-release.keystore
```

3. Update `android/app/build.gradle`:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 3: Configure ProGuard

Edit `android/app/proguard-rules.pro`:

```proguard
# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# Keep Supabase classes
-keep class io.supabase.** { *; }

# Keep your app classes
-keep class com.billzest.** { *; }
```

### Step 4: Build Release APK

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Step 5: Build Release AAB (for Play Store)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 6: Test Release Build

```bash
# Install on device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or use Android Studio to install
```

---

## iOS Release Build

### Step 1: Update Version

Edit `ios/BillZest/Info.plist`:

```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

### Step 2: Configure Signing

1. Open Xcode: `open ios/BillZest.xcworkspace`
2. Select project → Signing & Capabilities
3. Select your team
4. Xcode will automatically manage provisioning profiles

### Step 3: Configure Build Settings

1. Select project → Build Settings
2. Set:
   - **Code Signing Identity**: Apple Distribution
   - **Provisioning Profile**: Automatic
   - **Deployment Target**: iOS 13.0 (or your minimum)

### Step 4: Archive Build

1. In Xcode, select "Any iOS Device" as target
2. Product → Archive
3. Wait for archive to complete
4. Organizer window opens

### Step 5: Distribute App

1. In Organizer, select your archive
2. Click "Distribute App"
3. Choose distribution method:
   - **App Store Connect**: For App Store submission
   - **Ad Hoc**: For testing on specific devices
   - **Enterprise**: For enterprise distribution
   - **Development**: For development builds

### Step 6: For App Store Submission

1. Select "App Store Connect"
2. Choose upload or export
3. Follow prompts
4. App will be uploaded to App Store Connect

---

## Version Numbering

### Format: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Android Version Code

- Increment for each release (even patch versions)
- Must be unique and increasing
- Example: 1, 2, 3, 4...

### iOS Build Number

- Increment for each release
- Can be same as version code
- Example: 1, 2, 3, 4...

---

## Pre-Release Checklist

### Code
- [ ] All tests pass
- [ ] No console.logs (use logger)
- [ ] No debug code
- [ ] Error handling in place
- [ ] Offline mode tested

### Configuration
- [ ] Environment variables set
- [ ] API endpoints correct
- [ ] Feature flags configured
- [ ] Analytics enabled (if applicable)

### Assets
- [ ] App icons ready
- [ ] Splash screens ready
- [ ] App name correct
- [ ] Version numbers updated

### Testing
- [ ] Smoke tests pass
- [ ] Tested on physical devices
- [ ] Tested on minimum OS versions
- [ ] Performance acceptable
- [ ] No memory leaks

### Documentation
- [ ] Release notes prepared
- [ ] Changelog updated
- [ ] Known issues documented

---

## Post-Build Verification

### Android
- [ ] APK/AAB size is reasonable
- [ ] App installs successfully
- [ ] App launches without crashes
- [ ] All features work
- [ ] Performance is good

### iOS
- [ ] App size is reasonable
- [ ] App installs successfully
- [ ] App launches without crashes
- [ ] All features work
- [ ] Performance is good

---

## Troubleshooting

### Android: Build Fails

**Issue: Signing error**
- Verify keystore file exists
- Check keystore.properties values
- Ensure passwords are correct

**Issue: ProGuard errors**
- Add keep rules for problematic classes
- Check proguard-rules.pro

**Issue: Build too large**
- Enable ProGuard/R8
- Remove unused resources
- Optimize images

### iOS: Build Fails

**Issue: Code signing error**
- Verify certificates in Keychain
- Check provisioning profiles
- Ensure team is selected

**Issue: Archive fails**
- Clean build folder (Cmd+Shift+K)
- Delete derived data
- Rebuild

**Issue: Upload fails**
- Check App Store Connect access
- Verify bundle ID matches
- Check version number is unique

---

## Next Steps

After building:
1. Test release build thoroughly
2. Upload to internal testing track (Android) or TestFlight (iOS)
3. Collect feedback
4. Fix critical issues
5. Submit to production

