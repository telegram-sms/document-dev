# String Resources Organization

This document describes how string resources are organized in the Telegram SMS project to improve maintainability and clarity.

## Overview

String resources are split into multiple XML files based on their functional area, rather than having all strings in a single `strings.xml` file. This modular approach makes it easier for developers and translators to locate and manage strings.

## File Structure

All string resource files are located in:
- `app/src/main/res/values/` (English - default)
- `app/language_pack/values-{locale}/` (Translated versions)

### Core Files

#### `strings.xml`
Contains only base configuration strings:
- `Lang`: Language identifier
- `time_format`: Date/time format string

#### `strings_battery.xml`
Battery monitoring related strings:
- Battery level notifications
- Charger status messages
- Battery monitoring service names

#### `strings_telegram.xml`
Telegram API and bot related strings:
- Bot token configuration
- Chat ID setup
- API connection messages
- Chat command responses
- Privacy mode settings

#### `strings_sms.xml`
SMS related strings:
- SMS forwarding settings
- Trusted phone numbers
- Verification code detection
- SMS templates
- SMS blocklist/spam filtering
- Reply message prompts

#### `strings_call.xml`
Phone call related strings:
- Incoming call notifications
- Missed call notifications
- Call receiver settings
- Phone number display options

#### `strings_ussd.xml`
USSD code related strings:
- USSD execution messages
- USSD code input prompts
- USSD format validation

#### `strings_network.xml`
Network and connectivity related strings:
- Network status messages
- Airplane mode detection
- DNS over HTTPS settings
- Proxy configuration (Socks5)

#### `strings_cc.xml`
Carbon Copy (CC) service related strings:
- CC service configuration
- CC service enable/disable states
- CC service management UI

#### `strings_notification.xml`
Notification listener related strings:
- Notification listener service
- Notification forwarding settings
- App name and title display

#### `strings_scanner.xml`
QR code scanner and configuration transfer strings:
- QR code scanning UI
- Configuration encryption/decryption
- Configuration transfer messages
- Camera permission requests

#### `strings_privacy_about.xml`
App information and privacy related strings:
- User manual links
- Privacy policy
- Donation information
- About dialog content
- Update check messages

#### `strings_common.xml`
Common UI elements and general strings:
- Button labels (OK, Cancel, Delete, Send, Reset)
- Status messages (Success, Failed, Sending)
- Log viewer
- Error messages
- System message headers

## Translation Workflow

When adding new strings:

1. **Add to English default** (`app/src/main/res/values/`)
   - Choose the appropriate category file
   - Use descriptive string IDs
   - Add the English text

2. **Update language pack** (`app/language_pack/`)
   - Create or update the same XML file in each locale folder
   - Ensure the string ID matches the English version
   - Translate the content

3. **Supported Languages**:
   - `values-zh-rCN/` - Simplified Chinese
   - `values-zh-rTW/` - Traditional Chinese
   - `values-zh-rHK/` - Hong Kong Chinese
   - `values-yue-rCN/` - Cantonese (China)
   - `values-yue-rHK/` - Cantonese (Hong Kong)
   - `values-ja-rJP/` - Japanese
   - `values-es-rES/` - Spanish
   - `values-ru/` - Russian
   - `values-vi/` - Vietnamese

## Best Practices

### String Naming Convention

Use descriptive prefixes to indicate string purpose:
- Feature-specific: `sms_`, `call_`, `ussd_`, `battery_`, `cc_`
- UI elements: `button_`, `title_`, `message_`
- Status: `status_`, `error_`, `success_`

### File Selection Guidelines

When deciding which file to add a new string to:

1. **Identify the feature**: What component uses this string?
2. **Check existing strings**: Look for similar strings in category files
3. **Consider dependencies**: If a string is used by multiple features, put it in `strings_common.xml`
4. **Avoid duplication**: Reuse existing strings when possible

### Examples

#### Good: Feature-specific placement
```xml
<!-- strings_sms.xml -->
<string name="send_sms_title">Send SMS</string>
<string name="receive_sms_title">Receive SMS</string>
```

#### Good: Common element in common file
```xml
<!-- strings_common.xml -->
<string name="ok_button">OK</string>
<string name="cancel_button">Cancel</string>
```

#### Bad: Wrong category
```xml
<!-- Don't put SMS strings in battery file -->
<!-- strings_battery.xml -->
<string name="send_sms_title">Send SMS</string>  <!-- WRONG! -->
```

## Migration from Single File

The original `strings.xml` file has been split into multiple category files. This was done to:
- Improve code organization
- Make translation easier
- Reduce merge conflicts
- Enable better code navigation

All string IDs remain unchanged, so no code modifications are required. Android's resource system automatically merges all string XML files at build time.

## Verification

To verify all strings are properly organized:

1. **Build the project**: `./gradlew assembleDebug`
2. **Check for duplicate IDs**: The build will fail if string IDs are duplicated across files
3. **Test all features**: Ensure all strings are displayed correctly in the app

## Future Considerations

- Consider splitting `strings_sms.xml` further if SMS features expand significantly
- Add automated tools to check string coverage across all locales
- Implement string usage analysis to identify unused strings

