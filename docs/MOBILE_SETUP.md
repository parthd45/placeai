# Android & APK Build Guide - PlaceAI

This document provides instructions for compiling, testing, and distributing the native Android APK for PlaceAI using Capacitor.

---

## 🛠️ Prerequisites

- **Node.js**: v18.x or v20.x
- **Java Development Kit (JDK)**: OpenJDK 17
- **Android Studio**: Flamingo (2022.2) or newer with Android SDK Platform 33+
- **Capacitor CLI**: `@capacitor/cli` v5.7+

---

## 🔄 Synchronization Workflow

Whenever changes are made to frontend files (`index.html`, `dashboard.html`, `css/`, `js/`), sync them into the Android asset pipeline:

```bash
# 1. Sync web source to www/ distribution directory
node scratch/sync_www.js

# 2. Sync web assets into Android Capacitor project
npx cap sync android
```

---

## 📱 Building the APK

### Debug APK Build:
```bash
cd android
./gradlew assembleDebug
```
The output APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### Release Signed APK Build:
```bash
./gradlew assembleRelease
```
The output APK will be generated at:
`android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## 🚀 Live Testing via ADB

To install and run directly on a connected Android device or emulator:
```bash
npx cap run android
```
