# Android Emulator Network Fix

## Issue: "Network request failed" on Android Emulator

This is a common issue with Android emulator network configuration.

## Solutions (Try in order)

### Solution 1: Check Emulator Internet Access

1. **Open browser in Android emulator**
2. **Try to visit**: https://www.google.com
3. **If it doesn't load**, the emulator has no internet access

**Fix:**
- Restart Android emulator
- Check your computer's internet connection
- Try a different emulator (create new AVD)

### Solution 2: Add Network Security Config (For HTTPS)

Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

Then update `AndroidManifest.xml` to reference it:

```xml
<application
    ...
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

### Solution 3: Check AndroidManifest.xml

Ensure you have:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

And in `<application>` tag:

```xml
android:usesCleartextTraffic="true"
```

### Solution 4: Rebuild the App

After making changes:

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Solution 5: Use Physical Device

If emulator continues to have issues:
1. Enable USB debugging on your Android phone
2. Connect via USB
3. Run: `npm run android`

### Solution 6: Check Firewall/Antivirus

- Temporarily disable Windows Firewall
- Check if antivirus is blocking network requests
- Add React Native/Metro to firewall exceptions

### Solution 7: Cold Boot Emulator

1. Close emulator completely
2. In Android Studio → AVD Manager
3. Click "Cold Boot Now" (not just start)
4. This resets network stack

## Quick Test

Test if emulator has internet:

```bash
# In Android emulator terminal (adb shell)
adb shell ping -c 3 8.8.8.8
```

If ping fails, emulator has network issues.

## Alternative: Use Genymotion or Physical Device

If Android emulator continues to have issues:
- Use **Genymotion** emulator (better network support)
- Use **physical Android device** (most reliable)

