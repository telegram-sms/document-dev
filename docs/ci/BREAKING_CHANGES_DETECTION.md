# Breaking Changes Detection in CI/CD

## Overview

The GitLab CI/CD pipeline now includes automatic detection of breaking changes when generating changelogs for releases. This helps maintainers and users identify releases that may require migration steps or attention.

## How It Works

### 1. Commit Message Detection

The changelog generator (`changelogGenerate.py`) scans commit messages for breaking change indicators:

- `BREAKING CHANGE:` or `breaking change:` in commit body
- `BREAKING:` or `breaking:` prefix
- Conventional commit with `!` marker (e.g., `feat!:`, `fix!:`, `refactor!:`, `perf!:`)

### 2. AI-Powered Analysis

The changelog generator uses AI (via One API) to:
- Analyze commit messages for semantic breaking changes
- Detect API changes that break backward compatibility
- Identify removed features or deprecated functionality
- Recognize changes to data structures, configuration formats, or interfaces
- Detect database schema changes requiring migration

### 3. Changelog Format

When breaking changes are detected, they appear prominently in the changelog:

```markdown
## Summary
Brief overview of the release

## ⚠️ Breaking Changes
- [commit-hash] Description of what breaks and migration steps
- [commit-hash] Another breaking change

## Features
- [commit-hash] New feature

## Bug Fixes
- [commit-hash] Bug fix
```

## CI/CD Pipeline Output

When the pipeline runs, you'll see:

### No Breaking Changes
```
✓ No breaking changes detected in commit messages.
```

### Breaking Changes Detected
```
⚠️  WARNING: Potential BREAKING CHANGES detected in commits!
    Please review the changelog carefully.

⚠️  BREAKING CHANGES DETECTED IN CHANGELOG!
    This release contains breaking changes that may affect users.
```

## Best Practices for Commits

### Marking Breaking Changes

Use conventional commit format with `!` marker:

```bash
# Feature with breaking change
git commit -m "feat!: change SMS forwarding API to use new format"

# Fix with breaking change
git commit -m "fix!: remove deprecated configuration keys"

# With body explanation
git commit -m "refactor!: restructure data storage

BREAKING CHANGE: MMKV schema changed, requires data migration.
Users must update DataMigrationManager version."
```

### What Constitutes a Breaking Change?

- **API Changes**: Changing method signatures, removing public APIs
- **Data Format Changes**: Modifying data structures, JSON formats, database schemas
- **Configuration Changes**: Removing or renaming configuration keys
- **Dependency Changes**: Major version updates with incompatibilities
- **Behavioral Changes**: Significant changes in how features work
- **Permission Changes**: Adding new required permissions in AndroidManifest
- **Removed Features**: Deprecating or removing functionality

### What is NOT a Breaking Change?

- Bug fixes that correct incorrect behavior
- Adding new optional features
- Internal refactoring without API changes
- Performance improvements
- Documentation updates
- Adding new configuration options (that are optional)

## Example Commits

### ✅ Good Examples

```bash
# Clear breaking change marker
git commit -m "feat!: change bot token storage to encrypted format

BREAKING CHANGE: Existing bot tokens will need to be re-entered.
Users must reconfigure their bot in Settings."

# Conventional commit with explanation
git commit -m "refactor!: restructure Carbon Copy configuration API

BREAKING CHANGE: CcSendService constructor parameters changed.
Old: CcSendService(url, token)
New: CcSendService(type, url, token, options)

Migration: Update all CcSendService instantiations to include type parameter."

# Minor breaking change
git commit -m "fix!: remove deprecated SMSReceiver.sendToBot() method"
```

### ❌ Avoid These

```bash
# Too vague - doesn't explain what breaks
git commit -m "feat!: update API"

# Not actually breaking (adding optional feature)
git commit -m "feat!: add new notification sound option"

# Missing explanation for complex change
git commit -m "BREAKING CHANGE: refactor data layer"
```

## Technical Implementation

### Changelog Generator Script

Location: `.reallsys/scripts/changelogGenerate.py`

Key methods:
- `detect_breaking_changes(commits)`: Scans commit messages for indicators
- `build_prompt(commits)`: Instructs AI to detect and categorize breaking changes
- `generate(repo_path)`: Orchestrates detection and reporting

### GitLab CI Configuration

Location: `.reallsys/.gitlab-ci.yml`

The `build_release` job:
1. Fetches commit history from last tag to HEAD
2. Runs Python changelog generator
3. Outputs warnings if breaking changes detected
4. Includes breaking changes prominently in GitHub release notes

## Reviewing Breaking Changes

Before merging to `master`:

1. **Check Pipeline Output**: Review CI logs for breaking change warnings
2. **Read Generated Changelog**: Ensure breaking changes are clearly documented
3. **Update Documentation**: Add migration guides if needed
4. **Consider Versioning**: Breaking changes may warrant a major version bump
5. **Communicate**: Notify users through appropriate channels (Telegram, GitHub)

## Updating Detection Logic

To modify breaking change detection:

1. Edit `.reallsys/scripts/changelogGenerate.py`
2. Update `detect_breaking_changes()` method for new indicators
3. Modify `build_prompt()` to adjust AI instructions
4. Test locally: `python3 .reallsys/scripts/changelogGenerate.py`

## Related Documentation

- [GitLab CI/CD Configuration](./gitlab-ci.md)
- [Data Structure Versioning](../DATA_STRUCTURE_VERSION.md)
- [MMKV Data Migration](../DATA_STRUCTURE_VERSION.md)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)

## Questions?

If you have questions about breaking change detection or need to update the detection logic, please:
1. Review this documentation
2. Check existing commit history for examples
3. Open an issue on GitHub for discussion

