---
title: Project Introduction
description: Architecture and source-tree overview of the Telegram SMS Android app
---

# Telegram SMS - Project Introduction

## Project Overview

Telegram SMS is an Android application that forwards SMS messages, missed/incoming call notifications, and device status (battery, network, SIM info) to a Telegram bot, and accepts remote commands back. It lets users monitor and control an Android device through Telegram chat — or via SMS commands when there is no data connection.

It is a single Gradle module (`:app`), written entirely in Kotlin, with no project-owned native (C/C++) code.

| | |
|---|---|
| **Package name** | `com.qwe7002.telegram_sms` |
| **License** | BSD 3-Clause |
| **Min Android** | 6.0 (API 23) |
| **Target / Compile SDK** | 36 |
| **JDK** | 21 |

## Core Features

1. **SMS forwarding** — forward received SMS to the Telegram bot
2. **Call notifications** — notify on missed / incoming calls
3. **Battery monitoring** — send battery level and charging-state changes
4. **Carbon Copy (CC)** — mirror events to third-party services (Bark, PushDeer, Gotify, generic webhooks)
5. **Remote control** — drive the device via Telegram chat commands or inbound SMS commands
6. **Self-hosted Bot API** — point the app at a custom Telegram Bot API server
7. **USSD support** — run USSD codes remotely (dual-SIM aware)
8. **Spam filtering** — block messages by configurable rules
9. **Dual-SIM support** — per-slot behaviour, never assuming slot 0

## Technology Stack

### Language & Build

- **Language**: Kotlin (`kotlin-stdlib` 2.2.10)
- **Build system**: Gradle (Kotlin DSL) with Android Gradle Plugin **9.0.0**
- **JDK**: 21 (source/target compatibility 21)
- **compileSdk / targetSdk**: 36 · **minSdk**: 23
- **ABIs**: `armeabi-v7a`, `arm64-v8a` — these `abiFilters` exist **only** to package the transitive native libraries (libsodium, Conscrypt, MMKV) into the APK. The project itself ships no native code, so no NDK build is required.

### Key Dependencies

| Library | Version | Purpose |
|---|---|---|
| OkHttp + okhttp-dnsoverhttps | 5.3.2 | HTTP client with DNS-over-HTTPS |
| Conscrypt | 2.5.3 | Modern TLS security provider |
| Lazysodium (libsodium) | 5.2.0 | SecretBox encryption |
| JNA | 5.18.1 | Native access for Lazysodium |
| MMKV (Tencent) | 2.3.0 | High-performance key-value storage |
| Gson | 2.13.2 | JSON (de)serialization of DTOs |
| code-scanner | 2.1.0 | QR / barcode scanning |
| AwesomeQRCode | vendored | QR code rendering (embedded source) |

### Build Variants

| Variant | Application ID suffix | Notes |
|---|---|---|
| `debug` | `.debug` | always; parallel-installable |
| `release` | *(none)* | signed only if `app/keys.jks` exists |
| `release` on `nightly` branch | `.nightly` | parallel-installable prerelease |

`versionCode` / `versionName` are **not** in `build.gradle.kts`; they come from the `VERSION_CODE` / `VERSION_NAME` environment variables (default `1` / `"Debug"` locally). Release tags use Ubuntu-style `YY.MM[.N]` on `master`; nightly uses a timestamp scheme.

## Architecture

### Process model

`MainApplication.onCreate()` does almost nothing but `MMKV.initialize(this)`. The app is **receiver- and service-driven**, not Activity-driven — the Activities are only configuration UI.

- **Broadcast receivers** capture device events: `SMSReceiver`, `WAPReceiver` (MMS WAP push), `CallReceiver`, `BootReceiver`, `SMSSendResultReceiver` (send-result callback), `USSDCallBack`.
- **Foreground services** (`foregroundServiceType="specialUse"`):
  - **`ChatService`** — the brain. Long-polls Telegram `getUpdates`, routes inbound commands to handlers in `static_class/ChatCommand.kt`, and holds a `WakeLock` + `WifiLock`.
  - **`BatteryService`** — battery monitoring and respond-via-message handling.
  - **`NotificationService`** — a `NotificationListenerService` that forwards app notifications to Telegram (a Carbon Copy source).
- **JobServices**: `ReSendJob` (retry failed SMS sends), `CcSendJob` (Carbon Copy delivery), `KeepAliveJob` (keep services alive).
- **Activities** (config UI): `MainActivity`, `CcActivity`, `TemplateActivity`, `SpamActivity`, `ScannerActivity`, `TransferConfigActivity`, `LogActivity`, `NotifyActivity`.

Outbound notifications originate in the receivers / `BatteryService` / `NotificationService`, all calling into `static_class.TelegramApi`. **All** Telegram Bot API traffic goes through `TelegramApi`; nothing hits `api.telegram.org` directly.

### Networking

All outbound HTTP is built by `Network.getOkhttpObj()`, which wires up:

- DNS-over-HTTPS via Cloudflare (`1.1.1.1`)
- Optional SOCKS/HTTP proxy from the `proxy` MMKV namespace (with an `Authenticator` for authenticated proxies)
- Conscrypt as the security provider

Do not construct `OkHttpClient` directly — use this builder so proxy and DoH settings stay consistent everywhere.

### Carbon Copy

`CcSendJob` is an extensible forwarder. Each destination is a `CcSendService` holding a **HAR** (HTTP Archive Request) blob that is replayed for delivery — this is how Bark, PushDeer, Gotify and generic webhooks are supported without per-provider code. When the user enables encryption, payloads use `Crypto.encrypt`/`decrypt` (libsodium SecretBox, 24-byte nonce prepended to the ciphertext). Configuration UI is `CcActivity`. See [Carbon Copy Provider Implementation](../CarbonCopyProvider).

## Source Tree

```
telegram-sms/
├── app/
│   ├── src/main/
│   │   ├── java/com/qwe7002/telegram_sms/
│   │   │   ├── MainApplication.kt              # Application class (MMKV init)
│   │   │   ├── MainActivity.kt                 # Primary config UI
│   │   │   ├── CcActivity.kt                   # Carbon Copy config UI
│   │   │   ├── TemplateActivity.kt             # Message template config UI
│   │   │   ├── SpamActivity.kt                 # Spam filter rules UI
│   │   │   ├── ScannerActivity.kt              # QR config scanner
│   │   │   ├── TransferConfigActivity.kt       # Import/export config (QR)
│   │   │   ├── NotifyActivity.kt               # Notification-listener config
│   │   │   ├── LogActivity.kt                  # In-app log viewer
│   │   │   ├── FakeStatusBar.kt                # Custom status-bar helper
│   │   │   ├── ChatService.kt                  # Telegram long-poll loop (brain)
│   │   │   ├── BatteryService.kt               # Battery monitoring service
│   │   │   ├── NotificationService.kt          # NotificationListenerService
│   │   │   ├── SMSReceiver.kt                  # Incoming SMS
│   │   │   ├── SMSSendResultReceiver.kt        # SMS send-result callback
│   │   │   ├── WAPReceiver.kt                  # MMS WAP push
│   │   │   ├── CallReceiver.kt                 # Call state changes
│   │   │   ├── BootReceiver.kt                 # Auto-start on boot
│   │   │   ├── USSDCallBack.kt                 # USSD response callback
│   │   │   ├── KeepAliveJob.kt                 # Keep services alive
│   │   │   ├── ReSendJob.kt                    # Retry failed SMS sends
│   │   │   ├── CcSendJob.kt                    # Carbon Copy delivery
│   │   │   ├── static_class/                   # object singletons (Java-style statics)
│   │   │   │   ├── TelegramApi.kt              # Single point for Telegram Bot API
│   │   │   │   ├── Network.kt                  # OkHttp builder (DoH + proxy)
│   │   │   │   ├── ChatCommand.kt              # Inbound command dispatch
│   │   │   │   ├── SMS.kt                      # SMS helpers
│   │   │   │   ├── Phone.kt                    # Phone/SIM helpers
│   │   │   │   ├── USSD.kt                     # USSD helpers
│   │   │   │   ├── CcSend.kt                   # Carbon Copy sender
│   │   │   │   ├── Resend.kt                   # Resend logic
│   │   │   │   ├── Crypto.kt                   # libsodium SecretBox
│   │   │   │   ├── Template.kt                 # Template rendering
│   │   │   │   ├── Mustache.kt                 # Mustache template engine
│   │   │   │   ├── SnowFlake.kt                # Snowflake ID generation
│   │   │   │   ├── Service.kt                  # Service helpers
│   │   │   │   └── Other.kt                    # Misc (dual-SIM getActiveCard/getSubId)
│   │   │   ├── data_structure/                 # Gson-serialized DTOs
│   │   │   │   ├── telegram/                   # Telegram payloads
│   │   │   │   │   ├── PollingBody.kt
│   │   │   │   │   ├── RequestMessage.kt
│   │   │   │   │   └── ReplyMarkupKeyboard.kt
│   │   │   │   ├── config/
│   │   │   │   │   └── CarbonCopy.kt
│   │   │   │   ├── CcSendService.kt            # CC destination (holds HAR)
│   │   │   │   ├── HAR.kt                      # HTTP Archive Request blob
│   │   │   │   ├── SMSRequestInfo.kt
│   │   │   │   ├── ScannerJson.kt
│   │   │   │   ├── GithubRelease.kt
│   │   │   │   └── OutputMetadata.kt
│   │   │   ├── MMKV/
│   │   │   │   └── MMKVKey.kt                  # All MMKV namespace IDs (consts)
│   │   │   ├── migration/
│   │   │   │   ├── DataMigrationManager.kt     # CURRENT_DATA_VERSION + migrate steps
│   │   │   │   └── MigrationExamples.kt
│   │   │   ├── value/                          # Constants & enums
│   │   │   │   ├── Const.kt                    # JSON MediaType, request codes, TAG
│   │   │   │   ├── LogTags.kt                  # LogActivity tag allow-list
│   │   │   │   ├── CcType.kt                   # SMS=0 CALL=1 BATTERY=2 NOTIFICATION=3
│   │   │   │   └── Notify.kt                   # Notification types
│   │   │   └── com/github/sumimakito/          # Vendored third-party source
│   │   │       ├── awesomeqrcode/              # AwesomeQrRenderer (submodule)
│   │   │       └── codeauxlib/                 # CodeauxLibPortable (submodule)
│   │   ├── res/                                # Android resources (strings_*.xml etc.)
│   │   └── AndroidManifest.xml
│   ├── language_pack/                          # Translations (git submodule)
│   │   ├── values-zh-rCN/   values-zh-rTW/   values-zh-rHK/
│   │   ├── values-yue-rCN/  values-yue-rHK/
│   │   ├── values-ja-rJP/   values-es-rES/   values-ru/   values-vi/
│   │   └── ...
│   └── build.gradle.kts                        # Module build config
├── .github/                                    # GitHub mirror config / instructions
├── .reallsys/.gitlab-ci.yml                    # GitLab CI (authoritative)
├── build.gradle.kts                            # Root build config
├── settings.gradle.kts                         # Gradle settings
└── gradlew / gradlew.bat                       # Gradle wrapper
```

### `static_class/` convention

Anything cross-cutting lives in `static_class/` as a Kotlin `object` singleton — the project's idiom for a Java-style static utility class. Individual methods are often annotated `@JvmStatic`.

### MMKV namespaces

All MMKV namespace IDs are top-level `const`s in `MMKV/MMKVKey.kt` — use `MMKV.mmkvWithID(CHAT_ID)` and friends, never hard-coded strings. Namespaces include: `proxy`, `chat`, `chat_info`, `carbon_copy`, `resend`, `update`, `notify`, `template`, `log`.

When you change the on-disk shape of anything stored in MMKV, bump `CURRENT_DATA_VERSION` in `migration/DataMigrationManager.kt` and add a `migrateToVersionN` step. See [Data Structure Version Management](../DATA_STRUCTURE_VERSION).

### Logging

Use `Log.d/i/w(logTag, …)` with `private const val logTag = "${TAG}.<ClassName>"`. For a class's logs to surface in the in-app `LogActivity` viewer, its short tag must be listed in `TAG_FILTER` (or `DEBUG_TAG_FILTER` for debug-only) in `value/LogTags.kt`.

## Repositories & Submodules

### Application repositories

- **telegram-sms** — main app: <https://github.com/telegram-sms/telegram-sms>
- **telegram-sms-nightly** — prerelease APK publishing target: <https://github.com/telegram-sms/telegram-sms-nightly>
- **telegram-sms-compat** — legacy build for older Android: <https://github.com/telegram-sms/telegram-sms-compat>

### Git submodules (in the app repo)

1. **language_pack** → `app/language_pack/` — <https://github.com/telegram-sms/language_pack> — all non-English `values-<locale>/` resource dirs. Staged into `res/` at build time by the `copy_language_pack` Gradle task.
2. **AwesomeQrRenderer** → `app/src/main/java/com/github/sumimakito/awesomeqrcode/` — vendored QR renderer source (no copy step).
3. **CodeauxLibPortable** → `app/src/main/java/com/github/sumimakito/codeauxlib/` — vendored helper source (no copy step).

```bash
# Clone with all submodules
git clone --recursive https://github.com/telegram-sms/telegram-sms.git

# Or, after a plain clone
git submodule update --init --recursive

# Update submodules to their latest tracked commits
git submodule update --remote
```

### Documentation repositories (separate, not submodules)

Documentation lives outside the app repo as two standalone VitePress sites:

- **document-dev** (this site, dev.telegram-sms.com) — developer/technical docs, **English only**.
- **document** (telegram-sms.com) — end-user docs (manual, getting started, Q&A, privacy policy) in 6 languages.

## Language Support

The app ships 9 translated locales via the `language_pack` submodule: Simplified Chinese (`zh-rCN`), Traditional Chinese (`zh-rTW`, `zh-rHK`), Cantonese (`yue-rCN`, `yue-rHK`), Japanese (`ja-rJP`), Spanish (`es-rES`), Russian (`ru`), and Vietnamese (`vi`), plus English as the default.

**Adding strings**: put new UI strings in the English category files under `app/src/main/res/values/` (`strings_sms.xml`, `strings_telegram.xml`, `strings_battery.xml`, `strings_call.xml`, `strings_cc.xml`, `strings_chat.xml`, `strings_network.xml`, `strings_notification.xml`, `strings_privacy_about.xml`, `strings_scanner.xml`, `strings_sms_manage.xml`, `strings_update.xml`, `strings_ussd.xml`). Translations go into the **language_pack submodule**, not into `values-*` directly — those staged copies are gitignored and are clobbered by `copy_language_pack`. See [String Resources Organization](../STRING_RESOURCES).

```bash
git submodule update --init --recursive   # first checkout
./gradlew app:copy_language_pack          # stage translations into res/
./gradlew app:clean_language_pack         # remove the staged values-* dirs
```

## Building

See the [Development Manual](../) for full prerequisites and steps. In short:

```bash
git submodule update --init --recursive
./gradlew assembleDebug                   # debug APK -> app/build/outputs/apk/debug/
./gradlew assembleRelease                 # release APK (needs keystore, see below)
./gradlew test                            # JUnit unit tests
./gradlew clean
```

Release builds are signed only if `app/keys.jks` is present and these env vars are set:

```bash
export KEYSTORE_PASS=<keystore password>
export ALIAS_NAME=<key alias>
export ALIAS_PASS=<alias password>
```

Without the keystore, a release build produces an **unsigned** APK and will not pass `keytool` validation in CI.

## Continuous Integration

GitLab CI ([.reallsys/.gitlab-ci.yml](../ci/gitlab-ci)) is authoritative; GitHub is a mirror. Three pipelines:

- **build_nightly** (`nightly` branch) → publishes a prerelease APK to `telegram-sms-nightly`.
- **build_release** → `release_publish` (Gemini CLI generates `CHANGELOG.md` + `SUMMARY_ZH.txt`) → `telegram_notify` (posts EN + ZH summaries to two Telegram channels); fires on `master`.
- **build_debug** — manual web-trigger.

Required CI variables (Protected + Masked): `KEYSTORE` (base64-encoded jks), `KEYSTORE_PASS`, `ALIAS_NAME`, `ALIAS_PASS`, `GITHUB_ACCESS_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID_EN`, `TELEGRAM_CHANNEL_ID_ZH`.

GitHub Actions (`.github/workflows/android.yml`) is a manual `workflow_dispatch` fallback that builds debug or unsigned-release APKs.

## Security

- **Encryption**: libsodium SecretBox via Lazysodium (`Crypto.kt`), 24-byte nonce prepended to ciphertext, used for Carbon Copy payloads when enabled. See [Crypto Module Documentation](../CRYPTO_DOC).
- **TLS**: Conscrypt as the security provider.
- **DNS privacy**: DNS-over-HTTPS through Cloudflare (`1.1.1.1`).
- **Network Security Config**: custom configuration in the manifest.

## Key Permissions

| Permission | Why |
|---|---|
| `RECEIVE_SMS`, `SEND_SMS`, `READ_SMS` | SMS forwarding and remote send |
| `READ_PHONE_STATE`, `READ_CALL_LOG`, `READ_PHONE_NUMBERS` | call / SIM monitoring (dual-SIM) |
| `CALL_PHONE` | execute USSD codes |
| `RECEIVE_BOOT_COMPLETED` | auto-start services on boot |
| `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_SPECIAL_USE` | long-running services |
| `POST_NOTIFICATIONS` | Android 13+ notification permission |
| `CAMERA` | QR config scanning |
| `INTERNET`, `ACCESS_NETWORK_STATE` | network access |
| `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | survive battery optimization |

## Conventions

- **Commit language: English** (per `.github/git-commit-instructions.md`). Simplified Chinese is the historical primary language of the README, but new commits should be English.
- Kotlin `object` singletons are the idiom for static utility namespaces (`static_class/`).
- Dual-SIM is a real concern — gate per-slot behaviour through `Other.getActiveCard(context)` / `getSubId`; never assume slot 0.
- All Telegram traffic goes through `static_class.TelegramApi`; all HTTP clients come from `Network.getOkhttpObj()`.

## Related Documentation

- [Development Manual](../) — build prerequisites and steps
- [Crypto Module Documentation](../CRYPTO_DOC)
- [Data Structure Version Management](../DATA_STRUCTURE_VERSION)
- [Self-hosted Bot API](../self_hosted_bot_api)
- [Carbon Copy Provider Implementation](../CarbonCopyProvider)
- [String Resources Organization](../STRING_RESOURCES)
- [Update Check System](../UPDATE_CHECK)
- [GitLab CI Overview](../ci/gitlab-ci)
