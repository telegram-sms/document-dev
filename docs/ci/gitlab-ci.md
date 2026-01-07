# GitLab CI/CD Configuration

## Overview

The Telegram SMS project uses GitLab CI/CD for automated building, testing, and releasing. This document provides a comprehensive guide to understanding and maintaining the CI/CD pipeline.

**Configuration File**: `.reallsys/.gitlab-ci.yml`

## Pipeline Architecture

### Stages

The pipeline consists of two stages:

1. **build**: Compiles the Android application
2. **deploy**: Deploys artifacts to GitHub releases

### Build Variants

Three build types are supported:

- **Release Build** (`build_release`): Production builds for `master` branch
- **Nightly Build** (`build_nightly`): Pre-release builds for `nightly` branch  
- **Debug Build** (`build_debug`): Manual debug builds for testing

## Environment Configuration

### Docker Image

**Base Image**: `alvrme/alpine-android:android-36-jdk21`

This image includes:
- Alpine Linux (lightweight)
- Android SDK 36 (compileSdk)
- JDK 21
- Essential build tools

### Global Variables

```yaml
variables:
  OWNER: telegram-sms                    # GitHub organization/user
  REPO: telegram-sms                     # Repository name
  GIT_DEPTH: 0                          # Full git history
  GIT_SUBMODULE_STRATEGY: recursive     # Clone submodules
  GHR_VERSION: "0.17.0"                 # GitHub release tool version
  GRADLE_USER_HOME: "${CI_PROJECT_DIR}/.gradle"
  GRADLE_OPTS: "-Dorg.gradle.daemon=false -Dorg.gradle.parallel=true -Dorg.gradle.caching=true"
```

### Global Settings

```yaml
default:
  timeout: 30m              # Maximum job duration
  interruptible: true       # Allow cancellation when new pipeline starts
```

## Caching Strategy

### Cache Configuration

```yaml
cache:
  key:
    files:
      - .reallsys/scripts/requirements.txt  # Python dependencies
      - app/build.gradle                    # Android dependencies
    prefix: ${CI_PROJECT_ID}
  paths:
    - .gradle/caches/        # Gradle build cache
    - .gradle/wrapper/       # Gradle wrapper
    - .cache/pip/           # Python pip cache
  policy: pull-push
```

**Benefits**:
- Speeds up builds by reusing dependencies
- Reduces network bandwidth
- Cache invalidates when dependencies change

## Job Templates

### Environment Setup (`.setup_environment`)

A reusable template that all jobs inherit. It performs:

#### 1. Dependency Installation
```bash
apk --summary --no-cache add git openssl bash curl wget ca-certificates zip unzip
```

#### 2. Keystore Setup
```bash
# Decode base64-encoded keystore from CI variable
echo -n "${KEYSTORE}" | base64 -d > app/keys.jks

# Validate keystore integrity
keytool -list -keystore app/keys.jks -storepass "${KEYSTORE_PASSWORD}"
```

#### 3. Git Configuration
```bash
git config --global user.email "ci-bot@telegram-sms.com"
git config --global user.name "GitLab CI Bot"
git config --global http.postBuffer 524288000
```

#### 4. Gradle Setup
```bash
# Configure Gradle for optimal CI performance
cat >> gradle.properties << EOF
org.gradle.jvmargs=-Xmx2048m -XX:+HeapDumpOnOutOfMemoryError
org.gradle.parallel=true 
org.gradle.caching=true
org.gradle.configureondemand=true
EOF
```

#### 5. Version Generation

**For `master` branch** (Ubuntu-style versioning):
```bash
# Format: YY.MM or YY.MM.PATCH
UBUNTU_VERSION="$(date +%y.%m)"  # e.g., 26.01

# Check for existing versions this month
EXISTING_TAGS=$(git tag -l "${UBUNTU_VERSION}*")

# Increment patch number if needed
# 26.01 -> 26.01.1 -> 26.01.2, etc.

VERSION_NAME="${UBUNTU_VERSION}.${PATCH_NUM}"
VERSION_CODE="${CI_PIPELINE_ID}"
RELEASE_TAG="${VERSION_NAME}-${CI_COMMIT_REF_NAME}-${CI_COMMIT_SHORT_SHA}"
```

**For other branches** (timestamp-based):
```bash
RELEASE_TAG="$(date +%Y%m%d%H%M)-${CI_COMMIT_REF_NAME}-${CI_COMMIT_SHORT_SHA}"
VERSION_CODE="${CI_PIPELINE_ID}"
VERSION_NAME="${RELEASE_TAG}"
```

### Build APK Template (`.build_apk`)

```yaml
.build_apk:
  script:
    - ./gradlew clean assembleRelease --stacktrace --no-daemon
```

## Build Jobs

### 1. Release Build (`build_release`)

**Trigger**: Pushes to `master` branch

**Workflow**:

1. **Environment Setup** (inherited from template)
2. **Keystore Validation**
   ```bash
   keytool -list -keystore app/keys.jks -storepass "${KEYSTORE_PASSWORD}"
   ```
3. **Language Pack Copy**
   ```bash
   ./gradlew app:copy_language_pack --no-daemon
   ```
4. **Build APK**
   ```bash
   ./gradlew clean assembleRelease --stacktrace --no-daemon
   ```
5. **Download GitHub Release Tool (ghr)**
   ```bash
   wget "https://github.com/tcnksm/ghr/releases/download/v${GHR_VERSION}/ghr_v${GHR_VERSION}_linux_amd64.tar.gz"
   tar -xzf ghr.tar.gz
   ```
6. **Sync to GitHub**
   ```bash
   git push "https://${GITHUB_ACCESS_KEY}@github.com/${OWNER}/${REPO}.git" \
     "HEAD:refs/heads/${CI_COMMIT_REF_NAME}"
   ```
7. **Generate Changelog** (with Breaking Changes detection)
   ```bash
   # Fetch tags from source repository
   git remote add source https://github.com/telegram-sms/telegram-sms
   git fetch source --tags
   
   # Install Python dependencies
   pip3 install -r .reallsys/scripts/requirements.txt
   
   # Run AI-powered changelog generator
   python3 .reallsys/scripts/changelogGenerate.py
   
   # Read generated changelog
   RELEASE_CHANGELOG=$(cat CHANGELOG.md)
   ```
   
   See [Breaking Changes Detection](./BREAKING_CHANGES_DETECTION.md) for details.

8. **Create GitHub Release**
   ```bash
   ghr -t "${GITHUB_ACCESS_KEY}" \
       -u "${OWNER}" \
       -r "${REPO}" \
       -n "${RELEASE_TAG}" \
       -b "${RELEASE_CHANGELOG}" \
       -prerelease \
       "${RELEASE_TAG}" \
       "./app/build/outputs/apk/release/"
   ```

**Retry Policy**:
- Max retries: 2
- Retry on: `runner_system_failure`, `stuck_or_timeout_failure`

### 2. Nightly Build (`build_nightly`)

**Trigger**: Pushes to `nightly` branch

**Differences from Release Build**:
- No language pack copying (uses embedded)
- No keystore validation (uses debug signing)
- Deploys to `telegram-sms-nightly` repository
- Uses `-generatenotes` instead of AI changelog
- Includes commit hash in version name

**Workflow**:
1. Environment Setup
2. Build APK
3. Download ghr
4. Sync to GitHub nightly repository
5. Create pre-release with auto-generated notes

**Retry Policy**:
- Max retries: 2
- Retry on: `runner_system_failure`, `stuck_or_timeout_failure`, `script_failure`

### 3. Debug Build (`build_debug`)

**Trigger**: Manual web trigger only

**Purpose**: Testing and debugging

**Workflow**:
1. Environment Setup
2. Build Debug APK
   ```bash
   ./gradlew assembleDebug --stacktrace --no-daemon
   ```

**Artifacts**:
- **Name**: `telegram-sms-debug-${CI_COMMIT_SHORT_SHA}`
- **Path**: `app/build/outputs/apk/debug/*.apk`
- **Retention**: 3 days

**Cache Policy**: `pull` only (no push)

## Required CI/CD Variables

### Secrets (Protected & Masked)

Configure in GitLab: **Settings > CI/CD > Variables**

| Variable | Description | Example | Required For |
|----------|-------------|---------|--------------|
| `KEYSTORE` | Base64-encoded keystore file | `MIIJrQIBA...` | Release only |
| `KEYSTORE_PASSWORD` | Keystore password | `your-password` | Release only |
| `ALIAS_NAME` | Key alias name | `telegram_sms_key` | Release only |
| `ALIAS_PASS` | Key password | `your-key-password` | Release only |
| `GITHUB_ACCESS_KEY` | GitHub Personal Access Token | `ghp_xxxxx` | All builds |
| `ONEAPI_BASE_URL` | OneAPI endpoint URL | `https://api.example.com/v1/chat/completions` | Release only |
| `ONEAPI_API_KEY` | OneAPI authentication key | `sk-xxxxx` | Release only |

### Built-in Variables

GitLab provides these automatically:

- `CI_COMMIT_REF_NAME`: Branch name
- `CI_COMMIT_SHORT_SHA`: Short commit hash (8 chars)
- `CI_PIPELINE_ID`: Unique pipeline ID (used as version code)
- `CI_PROJECT_DIR`: Project directory path
- `CI_PROJECT_ID`: GitLab project ID

## Keystore Management

### Creating Keystore

```bash
keytool -genkey -v \
  -keystore keys.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias telegram_sms_key
```

### Encoding for GitLab CI

```bash
base64 -w 0 keys.jks > keys.jks.base64
```

Copy contents of `keys.jks.base64` to GitLab CI variable `KEYSTORE`.

### Security Best Practices

- ✅ Use protected variables (only available on protected branches)
- ✅ Use masked variables (hidden in logs)
- ✅ Store keystore separately (never commit to git)
- ✅ Use strong passwords (min 16 characters)
- ✅ Limit access to keystore file
- ✅ Regular backup of keystore (loss = unable to update app)

## Version Naming Strategy

### Release Builds (master)

**Format**: `YY.MM` or `YY.MM.PATCH`

**Examples**:
- First release in January 2026: `26.01`
- Second release in January 2026: `26.01.1`
- Third release in January 2026: `26.01.2`
- First release in February 2026: `26.02`

**Version Code**: `${CI_PIPELINE_ID}` (auto-incrementing)

### Nightly Builds

**Format**: `YYYYMMDDHHMM-branch-sha`

**Example**: `202601071430-nightly-a1b2c3d4`

### Debug Builds

**Version Name**: `Debug`

## Troubleshooting

### Common Issues

#### 1. Keystore Validation Failed

**Error**: `Keystore validation failed - file may be corrupted or password incorrect`

**Solutions**:
- Verify `KEYSTORE` variable is correctly base64-encoded
- Check `KEYSTORE_PASSWORD` is correct
- Ensure keystore file is not corrupted
- Re-encode keystore: `base64 -w 0 keys.jks`

#### 2. GitHub Push Failed

**Error**: `Failed to push to GitHub`

**Solutions**:
- Verify `GITHUB_ACCESS_KEY` has `repo` and `workflow` scopes
- Check token hasn't expired
- Ensure repository exists and is accessible
- Verify branch protection rules allow force push (if needed)

#### 3. Gradle Build Failed

**Error**: Various Gradle errors

**Solutions**:
- Check `app/build.gradle` syntax
- Verify dependencies are accessible
- Clear cache: Delete `.gradle` cache in GitLab CI settings
- Check JDK version compatibility (requires JDK 21)

#### 4. Language Pack Copy Failed

**Error**: `Task 'copy_language_pack' not found`

**Solutions**:
- Ensure submodule `app/language_pack` is initialized
- Check `GIT_SUBMODULE_STRATEGY: recursive` is set
- Verify `app/build.gradle` has `copy_language_pack` task defined

#### 5. Changelog Generation Failed

**Error**: `API request failed` or `No commit history found`

**Solutions**:
- Verify `ONEAPI_BASE_URL` and `ONEAPI_API_KEY` are set correctly
- Check OneAPI service is accessible from GitLab runner
- Ensure at least one git tag exists
- Verify `GIT_DEPTH: 0` to fetch full history

#### 6. Out of Memory Error

**Error**: `java.lang.OutOfMemoryError: Java heap space`

**Solutions**:
- Increase heap size in `gradle.properties`:
  ```properties
  org.gradle.jvmargs=-Xmx3072m -XX:MaxMetaspaceSize=512m
  ```
- Use incremental builds: `org.gradle.configureondemand=true`
- Enable parallel builds: `org.gradle.parallel=true`

## Performance Optimization

### Cache Strategy

1. **Gradle Dependencies**: Cached per `app/build.gradle` hash
2. **Gradle Wrapper**: Reused across builds
3. **Python Packages**: Cached per `requirements.txt` hash

**Cache Hit Rate Target**: >80%

### Build Time Optimization

**Typical Build Times**:
- **First Build** (cold cache): ~15-20 minutes
- **Incremental Build** (warm cache): ~5-8 minutes
- **Debug Build**: ~3-5 minutes

**Optimization Techniques**:
- Parallel Gradle execution
- Gradle build cache
- Dependency caching
- Incremental compilation
- No Gradle daemon (CI environment)

## Pipeline Monitoring

### Key Metrics

Monitor these in GitLab CI/CD analytics:

- **Success Rate**: Should be >95%
- **Average Duration**: Target <10 minutes (with cache)
- **Cache Hit Rate**: Target >80%
- **Retry Rate**: Should be <5%

### Logs and Debugging

**Enable Verbose Logging**:
```yaml
variables:
  CI_DEBUG_TRACE: "true"  # Enable debug mode
```

**Download Artifacts**:
- Navigate to pipeline > job > right sidebar > "Download artifacts"
- APKs available for 30 days (debug) or indefinitely (releases)

## Integration with GitHub

### Release Process Flow

```
GitLab CI (Build) → GitHub Release (Publish) → Users (Download)
```

1. **GitLab**: Builds APK, validates, signs
2. **GitHub**: Hosts releases, provides download links
3. **Users**: Download from GitHub Releases page

### Why Dual Platform?

- **GitLab**: Private CI/CD with better control and caching
- **GitHub**: Public face, community engagement, issue tracking

### Synchronization

- Code synced from GitLab to GitHub after successful build
- Releases published to GitHub using `ghr` tool
- Issues and PRs managed on GitHub

## Maintenance Checklist

### Regular Tasks

- [ ] **Weekly**: Check build success rate
- [ ] **Monthly**: Review cache hit rates
- [ ] **Monthly**: Update base Docker image if needed
- [ ] **Quarterly**: Rotate GitHub access tokens
- [ ] **Quarterly**: Update `ghr` version
- [ ] **Annually**: Review and update keystore backup

### Dependency Updates

- [ ] **JDK**: Follow Android Studio recommendations
- [ ] **Android SDK**: Update when new version stabilizes
- [ ] **Gradle**: Update gradually, test thoroughly
- [ ] **Python packages**: Update `requests` library regularly

### Security Updates

- [ ] Rotate `GITHUB_ACCESS_KEY` if compromised
- [ ] Re-encode keystore if exposed
- [ ] Review CI/CD variable access permissions
- [ ] Monitor GitLab security advisories

## Related Documentation

- [Breaking Changes Detection](./BREAKING_CHANGES_DETECTION.md) - Automated breaking change detection in changelogs
- [Translation Checker](./TRANSLATION_CHECKER.md) - Multi-language translation validation
- [Data Structure Versioning](../DATA_STRUCTURE_VERSION.md) - MMKV schema migrations
- [GitHub Actions Workflow](https://github.com/telegram-sms/telegram-sms/blob/master/.github/workflows/android.yml) - Alternative CI for manual builds

## Advanced Configuration

### Custom Build Variants

To add a new build variant:

1. Define variant in `app/build.gradle`:
   ```gradle
   buildTypes {
       staging {
           applicationIdSuffix ".staging"
           versionNameSuffix "-staging"
           // ... other config
       }
   }
   ```

2. Add CI job in `.reallsys/.gitlab-ci.yml`:
   ```yaml
   build_staging:
     stage: build
     rules:
       - if: $CI_COMMIT_BRANCH == "staging"
     script:
       - ./gradlew assembleStagingRelease
   ```

### Conditional Changelog

Skip AI changelog for specific commits:

```yaml
script:
  - |
    if echo "${CI_COMMIT_MESSAGE}" | grep -q "\[skip changelog\]"; then
      RELEASE_CHANGELOG="No changelog for this release"
    else
      python3 .reallsys/scripts/changelogGenerate.py
      RELEASE_CHANGELOG=$(cat CHANGELOG.md)
    fi
```

### Matrix Builds

Build multiple ABIs in parallel:

```yaml
build_release:
  parallel:
    matrix:
      - ABI: [armeabi-v7a, arm64-v8a, x86, x86_64]
  script:
    - ./gradlew assembleRelease -Pabi=${ABI}
```

## Support and Contribution

### Reporting Issues

If you encounter CI/CD issues:

1. Check this documentation first
2. Review pipeline logs in GitLab
3. Search existing issues on GitHub
4. Create new issue with:
   - Pipeline URL
   - Error logs
   - Environment details

### Contributing

To improve the CI/CD pipeline:

1. Fork the repository
2. Make changes in `.reallsys/.gitlab-ci.yml`
3. Test with manual pipeline trigger
4. Submit pull request with detailed description
5. Reference this documentation in commit message

## Changelog

**v2.0** (2026-01):
- Added breaking changes detection
- Improved keystore validation
- Enhanced error handling
- Updated documentation

**v1.5** (2025-12):
- Added AI-powered changelog generation
- Implemented Ubuntu-style versioning
- Added Python dependency caching

**v1.0** (2025-01):
- Initial GitLab CI/CD setup
- Basic build and release workflow
- GitHub integration

