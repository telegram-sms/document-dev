# Development Manual

**This document is intended for developers to compile with source code. For content that is not understood in the documentation or if you encounter an error, be sure to use Google Search.**

## How is the Telegram SMS git workflow structured?

git allows tons of flexibility in the workflow of how people work together, so it is important to clearly define the workflow of this community so that people know what to expect. The git workflow the Telegram SMS app uses is relatively simple and based on the very common workflow established by github.com, gitlab.com and others like it. Here's a break down of what that means:

- code is submitted for inclusion via Merge Requests (MRs)
- The master branch must not be merged with any branch that has not been tested on the actual machine
- Merge Requests for a stable release branch can include commits from master
- The compilation package provided to the public can be compiled using the github pipeline.

## How to compile the project

### Prerequisites

- **JDK 21** (Java Development Kit 21 or higher)
- **Android SDK** with the following components:
  - Android SDK Build-Tools
  - Android SDK Platform (API 36 or higher)
  - NDK 21.0.6113669
- **Git** with submodule support

### 1. Download the latest source code

Clone the repository with submodules:

```bash
git clone https://github.com/telegram-sms/telegram-sms.git telegram-sms
cd telegram-sms
git submodule update --init --recursive
```

### 2. Configure the compilation environment

You can compile this project by referring to the compiled script shown in [android.yml](https://github.com/telegram-sms/telegram-sms/blob/master/.github/workflows/android.yml)

#### Install NDK

If you don't have NDK 21.0.6113669 installed, you can install it using:

```bash
echo "y" | ${ANDROID_HOME}/tools/bin/sdkmanager --install "ndk;21.0.6113669"
```

#### Set up signing keys

For release builds, you need to set up a keystore file:

1. Place your keystore file at `app/keys.jks`
2. Configure environment variables:

```bash
export KEYSTORE_PASS=<Your keystore password>
export ALIAS_NAME=<Your key alias name>
export ALIAS_PASS=<Your alias password>
export VERSION_CODE=1
export VERSION_NAME="Debug"
```

#### Copy language pack

The project uses external language pack files that need to be copied before compilation:

```bash
./gradlew app:copy_language_pack
```

This copies language resources from `app/language_pack/` to `app/src/main/res/`.

### 3. Run compilation

#### For Debug build:

```bash
./gradlew assembleDebug
```

The output APK will be at: `app/build/outputs/apk/debug/app-debug.apk`

#### For Release build:

```bash
./gradlew assembleRelease
```

The output APK will be at: `app/build/outputs/apk/release/app-release.apk`

#### Complete build command (as used in CI):

```bash
export KEYSTORE_PASS=<Your password> && \
export ALIAS_NAME=<Your alias> && \
export ALIAS_PASS=<Your password> && \
export VERSION_CODE=1 && \
export VERSION_NAME="1.0.0" && \
./gradlew app:copy_language_pack && \
./gradlew assembleRelease
```

### Build Configuration

The project uses:
- **Compile SDK**: 36
- **Java/Kotlin Target**: JDK 21
- **Gradle**: 8.13.2+
- **Kotlin**: 2.2.21
- **NDK**: 21.0.6113669
- **Supported ABIs**: armeabi-v7a, arm64-v8a

### Branches

- **master**: Main development branch
- **nightly**: Nightly builds with modified package name (`.nightly` suffix)
