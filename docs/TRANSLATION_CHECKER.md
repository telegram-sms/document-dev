# Translation Checker GitHub Action

This GitHub Action automatically checks the completeness of all language pack translations across multiple categorized string resource files.

## Quick Start

### Automatic Check
The action runs automatically on:
- Pull requests affecting `language_pack/**`
- Pushes to main/master branch
- Manual trigger from GitHub Actions page

### Local Testing

```bash
# Install dependencies
pip install lxml

# Run check from project root directory
python .github/scripts/check_translations.py

# Split monolithic strings.xml files into categorized files (one-time migration)
python .github/scripts/split_language_packs.py
```

## Files Created

1. **`.github/workflows/check-translations.yml`** - GitHub Action workflow
2. **`.github/scripts/check_translations.py`** - Python script that performs the check
3. **`.github/scripts/split_language_packs.py`** - Python script to split language packs into categorized files

## What It Does

- Uses the string resource files from `app/src/main/res/values/` as reference (12 categorized files)
- Scans all language packs in `app/language_pack/` 
- Identifies missing strings for each language and each file
- Identifies missing files in language packs
- Generates a detailed report
- Fails CI if translations are incomplete

## String Resource Files

The checker validates translations across these categorized files:

- **strings.xml**: Base configuration (Lang, time_format)
- **strings_battery.xml**: Battery monitoring
- **strings_telegram.xml**: Telegram API and bot commands
- **strings_sms.xml**: SMS forwarding and management
- **strings_call.xml**: Phone call notifications
- **strings_ussd.xml**: USSD codes
- **strings_network.xml**: Network and connectivity
- **strings_cc.xml**: Carbon Copy services
- **strings_notification.xml**: Notification listener
- **strings_scanner.xml**: QR code scanner
- **strings_privacy_about.xml**: Privacy and app info
- **strings_common.xml**: Common UI elements

### File Merging

The checker automatically merges these additional reference files:
- `strings_chat.xml` → merged into `strings_telegram.xml`
- `strings_sms_manage.xml` → merged into `strings_sms.xml`

## Report Format

The report shows for each language pack:
- Overall translation completeness percentage
- List of missing files
- Per-file missing strings (⚠️)
- Per-file extra strings (not in reference)
- Overall status (✅ Complete or ⚠️ Incomplete)

## Example Output

```
================================================================================
Translation Completeness Report
================================================================================

Reference files contain 170 strings across 12 files.

--------------------------------------------------------------------------------
Language: values-zh-rCN
Directory: C:\...\app\language_pack\values-zh-rCN
Total strings: 163
Completeness: 95.9%

File-specific issues:

  [strings_common.xml]
    ⚠️  Missing 5 string(s):
      - cancel_button
      - delete_button
      - ok_button
      - send_button
      - reset_button

  [strings_ussd.xml]
    ⚠️  Missing 2 string(s):
      - enter_ussd_code
      - invalid_ussd_code

================================================================================
⚠️  Some language packs have missing strings or files.
================================================================================
```

## Migration from Single strings.xml

If you have a monolithic `strings.xml` file in your language pack:

1. Run the split script:
   ```bash
   python .github/scripts/split_language_packs.py
   ```

2. The script will:
   - Parse your existing `strings.xml`
   - Categorize strings into appropriate files
   - Create 12 categorized XML files
   - Report any uncategorized strings

3. Review and translate any missing strings reported by the checker

## Supported Languages

- `values-zh-rCN/` - Simplified Chinese
- `values-zh-rTW/` - Traditional Chinese
- `values-zh-rHK/` - Hong Kong Chinese
- `values-yue-rCN/` - Cantonese (China)
- `values-yue-rHK/` - Cantonese (Hong Kong)
- `values-ja-rJP/` - Japanese
- `values-es-rES/` - Spanish
- `values-ru/` - Russian
- `values-vi/` - Vietnamese

Language: values-yue-rCN
Total strings: 162
Completeness: 99.4%
⚠️  Missing 1 string(s):
  - system_message_head
```

## For Contributors

Before submitting a PR with translation changes:
1. Run the local test
2. Ensure your language pack has 100% completeness
3. Check the generated report for any issues

