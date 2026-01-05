---
applyTo: '**'
description: 'description'
---
# Telegram SMS - Project Introduction

## Project Overview

Telegram SMS is an Android application that forwards SMS messages, call notifications, and device status to Telegram as a bot. It enables users to remotely monitor and control their Android device through Telegram chat commands.

**Package Name**: `com.qwe7002.telegram_sms`  
**License**: BSD 3-Clause License  
**Min Android Version**: Android 6.0 (API 23)  
**Target Android Version**: Android 14+ (API 36)

## Core Features

1. **SMS Forwarding**: Forward received SMS messages to Telegram bot
2. **Call Notifications**: Notify missed or incoming calls
3. **Battery Monitoring**: Send battery status change notifications
4. **Carbon Copy (CC)**: Configure forward destinations (e.g., Bark, PushDeer, Gotify)
5. **Remote Control**: Control device via Telegram chat commands or SMS
6. **Self-hosted Bot API**: Support for custom Telegram Bot API servers
7. **USSD Support**: Execute USSD codes remotely
8. **Spam Filtering**: Filter and block spam messages
9. **Dual SIM Support**: Handle dual SIM card devices

## Technology Stack

### Language & Platform
- **Primary Language**: Kotlin 2.2.21
- **Platform**: Android (Gradle-based)
- **JDK Version**: 21
- **Build Tools**: Gradle 8.x with Android Gradle Plugin

### Key Dependencies
- **AndroidX**: AppCompat, ConstraintLayout, Material Design, Browser
- **Networking**: OkHttp 5.3.2 (with DNS-over-HTTPS support), OkIO 3.16.4
- **Security**: Conscrypt 2.5.3, Lazysodium 5.2.0 (libsodium for Android)
- **Data Storage**: MMKV 2.3.0 (by Tencent - high-performance key-value storage)
- **JSON Processing**: Gson 2.13.2
- **QR Code**: code-scanner 2.1.0, AwesomeQRCode (custom implementation)
- **JNI**: JNA 5.18.1

### Build Configuration
- **compileSdk**: 36
- **minSdk**: 23
- **targetSdk**: 36
- **Java Compatibility**: Source/Target 21
- **Build Variants**:
    - `debug` - Debug build with `.debug` suffix
    - `release` - Production build with signing
    - `nightly` - Nightly build with `.nightly` suffix (branch-specific)

## Project Structure

```
telegram-sms/
├── app/
│   ├── src/main/
│   │   ├── java/com/qwe7002/telegram_sms/
│   │   │   ├── MainActivity.kt                    # Main UI entry point
│   │   │   ├── MainApplication.kt                 # Application class
│   │   │   ├── ChatService.kt                     # Telegram chat polling service
│   │   │   ├── BatteryService.kt                  # Battery monitoring service
│   │   │   ├── NotificationService.kt             # Notification listener
│   │   │   ├── SMSReceiver.kt                     # SMS broadcast receiver
│   │   │   ├── CallReceiver.kt                    # Call broadcast receiver
│   │   │   ├── WAPReceiver.kt                     # WAP push receiver
│   │   │   ├── BootReceiver.kt                    # Boot complete receiver
│   │   │   ├── USSDCallBack.kt                    # USSD callback handler
│   │   │   ├── KeepAliveJob.kt                    # Keep services alive
│   │   │   ├── ReSendJob.kt                       # Resend failed messages
│   │   │   ├── CcSendJob.kt                       # Carbon copy send job
│   │   │   ├── ScannerActivity.kt                 # QR code scanner
│   │   │   ├── QrcodeActivity.kt                  # QR code generator
│   │   │   ├── LogActivity.kt                     # Log viewer
│   │   │   ├── SpamActivity.kt                    # Spam filter management
│   │   │   ├── CcActivity.kt                      # Carbon copy config
│   │   │   ├── TemplateActivity.kt                # Message templates
│   │   │   ├── NotifyActivity.kt                  # Notification config
│   │   │   ├── FakeStatusBar.kt                   # Custom status bar
│   │   │   ├── static_class/                      # Utility classes
│   │   │   │   ├── TelegramApi.kt                 # Telegram API wrapper
│   │   │   │   ├── SMS.kt                         # SMS utilities
│   │   │   │   ├── Phone.kt                       # Phone utilities
│   │   │   │   ├── Network.kt                     # Network utilities
│   │   │   │   ├── Crypto.kt                      # Encryption utilities
│   │   │   │   ├── ChatCommand.kt                 # Command parser
│   │   │   │   ├── CcSend.kt                      # Carbon copy sender
│   │   │   │   ├── Service.kt                     # Service utilities
│   │   │   │   ├── Resend.kt                      # Resend logic
│   │   │   │   ├── USSD.kt                        # USSD utilities
│   │   │   │   ├── Template.kt                    # Template engine
│   │   │   │   ├── SnowFlake.kt                   # ID generator
│   │   │   │   └── Other.kt                       # Misc utilities
│   │   │   ├── data_structure/                    # Data models
│   │   │   │   ├── telegram/                      # Telegram API models
│   │   │   │   ├── config/                        # Config models
│   │   │   │   ├── ScannerJson.kt                 # Scanner config
│   │   │   │   ├── SMSRequestInfo.kt              # SMS request
│   │   │   │   ├── CcSendService.kt               # CC service model
│   │   │   │   ├── GithubRelease.kt               # Release info
│   │   │   │   └── HAR.kt                         # HTTP archive
│   │   │   ├── MMKV/                              # Data migration
│   │   │   │   ├── DataMigrationManager.kt        # Migration manager
│   │   │   │   ├── MMKVConst.kt                   # MMKV constants
│   │   │   │   └── MigrationExamples.kt           # Migration examples
│   │   │   ├── value/                             # Constants & enums
│   │   │   │   ├── Const.kt                       # App constants
│   │   │   │   ├── Notify.kt                      # Notification types
│   │   │   │   └── CcType.kt                      # Carbon copy types
│   │   │   └── com/github/sumimakito/             # Third-party code
│   │   │       ├── awesomeqrcode/                 # QR code renderer
│   │   │       └── codeauxlib/                    # CodeauxLib portable
│   │   ├── res/                                   # Android resources
│   │   └── AndroidManifest.xml                    # App manifest
│   ├── language_pack/                             # Translations
│   │   ├── values-zh-rCN/                         # Simplified Chinese
│   │   ├── values-zh-rTW/                         # Traditional Chinese
│   │   ├── values-zh-rHK/                         # Hong Kong Chinese
│   │   ├── values-yue-rCN/                        # Cantonese (CN)
│   │   ├── values-yue-rHK/                        # Cantonese (HK)
│   │   ├── values-ja-rJP/                         # Japanese
│   │   ├── values-es-rES/                         # Spanish
│   │   ├── values-ru/                             # Russian
│   │   └── values-vi/                             # Vietnamese
│   ├── language_pack/                             # Translations
│   │   ├── values-zh-rCN/                         # Simplified Chinese
├── docs/                                          # Developer documentation
├── document/                                      # User documentation
├── .github/workflows/                             # GitHub Actions CI
│   └── android.yml                                # Android build workflow
├── .reallsys/                                     # GitLab CI configs
│   └── .gitlab-ci.yml                             # GitLab CI workflow
├── build.gradle                                   # Root build config
├── settings.gradle                                # Gradle settings
└── gradle.properties                              # Gradle properties
```

## Repository Information

### Main Repository
- **telegram-sms**: https://github.com/telegram-sms/telegram-sms
    - Main Android application repository

### Related Repositories
- **telegram-sms-nightly**: https://github.com/telegram-sms/telegram-sms-nightly
    - Pre-release/nightly builds
- **telegram-sms-compat**: https://github.com/telegram-sms/telegram-sms-compat
    - Legacy version for Android 5.0 and lower

### Documentation Repositories
These are standalone VitePress documentation sites (not git submodules):

- **docs/**: Developer documentation (English only)
    - Contains: API docs, Carbon Copy Provider guide, Crypto documentation, Data structure guides, String Resources Organization
    - Built with VitePress
    - Hosted separately from main repository

- **document/**: User documentation (Multi-language)
    - Contains: User manual, Q&A, Privacy policy
    - Supported languages: English, Spanish, Japanese, Russian, Simplified Chinese, Traditional Chinese
    - Built with VitePress
    - Hosted separately from main repository

### Git Submodules
The following are included as git submodules in the main repository:

1. **language_pack** (app/language_pack/)
    - Repository: https://github.com/telegram-sms/language_pack.git
    - Purpose: Translations for app strings (9 languages)
    - Languages: zh-CN, zh-TW, zh-HK, yue-CN, yue-HK, ja-JP, es-ES, ru, vi
2. **AwesomeQrRenderer** (app/src/main/java/com/github/sumimakito/awesomeqrcode/)
    - Repository: https://github.com/telegram-sms/AwesomeQrRenderer.git
    - Purpose: QR code rendering library (custom fork)
    - Type: Embedded Kotlin source code

3. **CodeauxLibPortable** (app/src/main/java/com/github/sumimakito/codeauxlib/)
    - Repository: https://github.com/telegram-sms/CodeauxLibPortable.git
    - Purpose: Portable version of CodeauxLib for compatibility
    - Type: Embedded Kotlin source code

### Submodule Management
```bash
# Initialize and summary all submodules
git submodule summary --init --recursive

# Update submodules to latest commits
git submodule summary --remote

# Clone repository with all submodules
git clone --recursive https://github.com/telegram-sms/telegram-sms.git
```

## Key Components

### Services
- **ChatService**: Long-polling service that continuously checks for new Telegram messages and processes commands
- **BatteryService**: Monitors battery level changes and charging status
- **NotificationService**: Notification listener that forwards app notifications to Telegram

### Broadcast Receivers
- **SMSReceiver**: Intercepts incoming SMS messages for forwarding
- **CallReceiver**: Monitors phone call states (incoming, missed, etc.)
- **WAPReceiver**: Handles WAP push messages (MMS notifications)
- **BootReceiver**: Starts services on device boot

### Job Schedulers
- **KeepAliveJob**: Ensures services remain running
- **ReSendJob**: Retries failed message deliveries
- **CcSendJob**: Handles carbon copy forwarding

### Activities
- **MainActivity**: Primary configuration interface
- **ScannerActivity**: QR code scanner for quick configuration
- **QrcodeActivity**: Generates configuration QR codes
- **LogActivity**: Displays application logs
- **SpamActivity**: Manages spam filter rules
- **CcActivity**: Configures carbon copy destinations
- **TemplateActivity**: Manages message templates
- **NotifyActivity**: Configures notification settings

## Data Storage

The app uses **MMKV** (Tencent's high-performance key-value storage) for configuration persistence. Key data includes:
- Bot token and chat ID
- Spam filter rules
- Carbon copy configurations
- Message templates
- User preferences

The `DataMigrationManager` handles version migrations when upgrading from SharedPreferences or older MMKV schemas.

## Security Features

1. **Encryption**: Uses libsodium (via Lazysodium) for end-to-end encryption of sensitive data
2. **Conscrypt**: Modern TLS provider for secure communications
3. **DNS-over-HTTPS**: OkHttp DoH support for DNS privacy
4. **Network Security Config**: Custom network security configuration

## Permissions Required

- `RECEIVE_SMS`, `SEND_SMS`, `READ_SMS`, `WRITE_SMS`: SMS operations
- `READ_PHONE_STATE`, `READ_CALL_LOG`, `READ_PHONE_NUMBERS`: Phone state monitoring
- `CALL_PHONE`: Execute USSD codes
- `RECEIVE_BOOT_COMPLETED`: Auto-start on boot
- `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_SPECIAL_USE`: Background services
- `POST_NOTIFICATIONS`: Android 13+ notification permission
- `CAMERA`: QR code scanning
- `INTERNET`, `ACCESS_NETWORK_STATE`: Network access
- `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`: Battery optimization exemption

## Build Variants & Versioning

### Version Naming
- **Release**: Ubuntu-style versioning `YY.MM` (e.g., `26.01`)
- **Nightly**: Timestamp-based `YYYYMMDDHHMM-branch-sha`
- **Debug**: `Debug`

### Build Types
1. **Release**: Production build with signing, minification disabled, ARM ABI filters
2. **Debug**: Development build with `.debug` package suffix
3. **Nightly** (branch-specific): Pre-release with `.nightly` package suffix

### Signing Configuration
Release builds require keystore configuration via environment variables:
- `KEYSTORE_PASS`: Keystore password
- `ALIAS_NAME`: Key alias
- `ALIAS_PASS`: Key password

## Continuous Integration

### GitLab CI (`.reallsys/.gitlab-ci.yml`)
- **Stages**: build, deploy
- **Docker Image**: `alvrme/alpine-android:android-36-jdk21`
- **Build Jobs**:
    - `build_nightly`: Nightly branch builds
    - `build_release`: Master branch builds (with keystore validation)
- **Features**: Gradle caching, language pack copying, Ubuntu versioning

### GitHub Actions (`.github/workflows/android.yml`)
- **Trigger**: Manual workflow dispatch
- **Build Types**: Debug or Release (unsigned)
- **Artifacts**: APK files with 30-day retention
- **No NDK required**: Project has no native code compilation

## Language Support

The app supports 9 languages through the `language_pack/` system:
- English (default)
- Simplified Chinese (zh-CN)
- Traditional Chinese (zh-TW, zh-HK)
- Cantonese (yue-CN, yue-HK)
- Japanese (ja-JP)
- Spanish (es-ES)
- Russian (ru)
- Vietnamese (vi)

Language packs are copied during build via the `copy_language_pack` Gradle task.

## Third-Party Libraries

### Embedded Libraries (in source tree)
- **AwesomeQRCode**: QR code rendering (custom port)
- **CodeauxLib**: Portable version for compatibility

### External Dependencies
- **OkHttp**: HTTP client with DNS-over-HTTPS
- **Gson**: JSON serialization
- **MMKV**: Key-value storage
- **Conscrypt**: TLS/SSL provider
- **Lazysodium**: libsodium crypto wrapper
- **JNA**: Java Native Access
- **code-scanner**: QR/barcode scanner

## Development Guidelines

### Code Style
- Primary commit language: Simplified Chinese
- English commits are welcome for contributions
- Kotlin coding conventions

### String Resources Organization
String resources are split into multiple category-based XML files for better maintainability:
- **strings.xml**: Base configuration (Lang, time_format)
- **strings_battery.xml**: Battery monitoring
- **strings_telegram.xml**: Telegram API and bot
- **strings_sms.xml**: SMS forwarding and management
- **strings_call.xml**: Phone call notifications
- **strings_ussd.xml**: USSD codes
- **strings_network.xml**: Network and connectivity
- **strings_cc.xml**: Carbon Copy services
- **strings_notification.xml**: Notification listener
- **strings_scanner.xml**: QR code scanner
- **strings_privacy_about.xml**: Privacy and app info
- **strings_common.xml**: Common UI elements

See [STRING_RESOURCES.md](../STRING_RESOURCES.md) for detailed guidelines on adding and organizing strings.

### Branch Strategy
- `master`: Stable releases
- `nightly`: Pre-release/nightly builds
- Feature branches as needed

### Build Commands
```bash
# Copy language pack
# Copy language pack

# Build debug APK
./gradlew assembleRelease

# Clean build
./gradlew clean
```

### Environment Variables for CI
- `VERSION_CODE`: Build number (e.g., CI pipeline ID)
- `VERSION_NAME`: Version string (e.g., "26.01")
- `CI_COMMIT_REF_NAME`: Git branch name (GitLab)
- `CI_COMMIT_SHORT_SHA`: Short commit SHA (GitLab)
- `KEYSTORE`: Base64-encoded keystore file (GitLab)
- `KEYSTORE_PASS`: Keystore password
- `ALIAS_NAME`: Key alias name
- `ALIAS_PASS`: Key password

## API Integration

### Telegram Bot API
The app uses Telegram Bot API for:
- Sending messages (SMS content, call notifications, battery status)
- Receiving commands (via long polling)
- Sending files (logs, call recordings if enabled)

### Carbon Copy (CC) System
Extensible notification forwarding to third-party services:
- **Bark**: iOS notification service
- **PushDeer**: Multi-platform push service
- **Gotify**: Self-hosted notification server
- Custom HTTP endpoints

## Remote Commands

Users can send commands via Telegram to:
- Send SMS messages
- Execute USSD codes
- Get device status (battery, network, SIM info)
- Restart services
- Download logs
- Query call history
- Manage spam filters

## Testing & Quality Assurance

- Manual testing required for SMS/Call functionality (requires physical device)
- QR code configuration for easy testing setup
- Log viewing within app for debugging
- Resend mechanism for reliability

## Documentation

- **User Manuals**: Available in `document/docs/` (9 languages)
- **Developer Docs**: Available in `docs/` (technical documentation)
- **Privacy Policy**: Included in documentation
- **Q&A**: Common questions and answers

## Project Links

### Main Project
- **Repository**: https://github.com/telegram-sms/telegram-sms
- **Nightly Builds**: https://github.com/telegram-sms/telegram-sms-nightly
- **Compat Version**: https://github.com/telegram-sms/telegram-sms-compat

### Documentation & Tools
- **Website**: https://telegram-sms.com
- **Config Generator**: https://config.telegram-sms.com

### Submodules
- **Language Pack**: https://github.com/telegram-sms/language_pack
- **AwesomeQrRenderer**: https://github.com/telegram-sms/AwesomeQrRenderer
- **CodeauxLibPortable**: https://github.com/telegram-sms/CodeauxLibPortable

### Community
- **Telegram Channels**:
    - English: https://t.me/tg_sms_changelog_eng
    - Chinese: https://t.me/tg_sms_changelog
- **Issue Tracker**: https://github.com/telegram-sms/telegram-sms/issues

## Notes for AI/Copilot

1. **No Native Code**: Project has no C/C++ code despite NDK filters in build.gradle (filters are for third-party libs)
2. **MMKV Migration**: When modifying data storage, update `DataMigrationManager`
3. **Multi-language**: Always consider i18n when adding UI strings
4. **Permission Changes**: Requires AndroidManifest.xml updates and runtime permission handling
5. **Telegram API**: All bot interactions go through `TelegramApi.kt` wrapper
6. **Background Services**: Must handle Android 8+ background execution limits
7. **Dual SIM**: Code must account for multiple SIM slots
8. **Signing**: Release builds require proper keystore configuration
9. **Version Code**: Automatically generated from CI pipeline ID
10. **Branch-specific Builds**: Nightly branch gets special package suffix and naming

## Documentation Guidelines for AI

### When to Create/Update Documentation

When making significant changes to the codebase, AI assistants should create or update documentation in the `docs/` directory. This includes:

1. **New Features**: When implementing new features, create documentation explaining:
   - Feature purpose and use cases
   - API interfaces and data structures
   - Configuration options
   - Code examples

2. **Architecture Changes**: When modifying system architecture:
   - Update architecture diagrams
   - Document new patterns or approaches
   - Explain rationale for changes

3. **API Changes**: When changing APIs or data structures:
   - Update `DATA_STRUCTURE_VERSION.md` or `DATA_STRUCTURE_VERSION_QUICK.md`
   - Document breaking changes
   - Provide migration guides

4. **New Integrations**: When adding new integrations (e.g., Carbon Copy providers):
   - Update `CarbonCopyProvider.md`
   - Add configuration examples
   - Document API endpoints

5. **Security Changes**: When modifying encryption or security features:
   - Update `CRYPTO_DOC.md`
   - Document security implications
   - Provide usage examples

### Documentation Location and Format

- **Developer Docs**: `docs/docs/` - VitePress Markdown format
- **Language**: English only (developer documentation)
- **Format**: Follow VitePress conventions with proper frontmatter

### Documentation Structure

Each documentation file should include:
```markdown
# Title

## Overview
Brief description of the topic

## Purpose
Why this exists and what problems it solves

## Technical Details
In-depth technical information

## Examples
Practical code examples

## Related
Links to related documentation
```

### When NOT to Update Docs

Do NOT update documentation when:
- Making minor bug fixes that don't change behavior
- Refactoring code without changing interfaces
- Fixing typos in code comments
- Making internal implementation changes

### Documentation Review Checklist

Before creating/updating documentation:
- [ ] Is the documentation in English?
- [ ] Does it follow VitePress Markdown format?
- [ ] Are code examples tested and correct?
- [ ] Are all technical terms explained?
- [ ] Is the documentation placed in the correct location (`docs/docs/`)?
- [ ] Does it link to related documentation?
- [ ] Is the content accurate and up-to-date?

### Example: Adding New Carbon Copy Provider

When adding support for a new Carbon Copy provider:

1. Update `docs/docs/CarbonCopyProvider.md`:
   - Add provider to the list
   - Document configuration format
   - Provide request/response examples
   - Add error handling information

2. Create code example:
```kotlin
// Example configuration
val config = CcSendService(
    type = CcType.NEW_PROVIDER,
    url = "https://api.newprovider.com/push",
    token = "your-token"
)
```

3. Document in data structures if needed

### User Documentation vs Developer Documentation

- **Developer Docs** (`docs/`): Technical documentation for developers contributing to the project
- **User Docs** (`document/`): End-user manuals, Q&A, privacy policy (multi-language)

**Important**: AI should focus on developer documentation in `docs/`. User documentation in `document/` requires multi-language support and should be handled separately.

