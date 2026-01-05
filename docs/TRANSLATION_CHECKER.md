# Translation Checker GitHub Action

This GitHub Action automatically checks the completeness of all language pack translations.

## Quick Start

### Automatic Check
The action runs automatically on:
- Pull requests affecting `app/language_pack/**`
- Pushes to main/master branch
- Manual trigger from GitHub Actions page

### Local Testing

```bash
# Install dependencies
pip install lxml

# Run check from project root directory
python .github/scripts/check_translations.py
```

## Files Created

1. **`.github/workflows/check-translations.yml`** - GitHub Action workflow
2. **`.github/scripts/check_translations.py`** - Python script that performs the check

## What It Does

- Uses the `app/src/main/res/values/strings.xml` file from the current repository as reference
- Scans all language packs in `app/language_pack/`
- Identifies missing strings for each language
- Generates a detailed report
- Fails CI if translations are incomplete

## Report Format

The report shows for each language pack:
- Translation completeness percentage
- List of missing strings (⚠️)
- List of extra strings (not in reference)
- Overall status (✅ Complete or ⚠️ Incomplete)

## Example Output

```
Language: values-zh-rTW
Total strings: 163
Completeness: 100.0%
✅ All strings present!

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

