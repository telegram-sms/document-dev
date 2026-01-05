# Update Check System

## Overview

The Telegram SMS app includes an automatic update checking system that uses GitHub Releases to detect and notify users of available updates. The system uses `output-metadata.json` for accurate version comparison based on `versionCode`.

## Purpose

The update checking system:
1. **Detects new releases** from the GitHub repository
2. **Compares versions** using `versionCode` from `output-metadata.json`
3. **Notifies users** when updates are available
4. **Provides direct download links** to the latest APK

## How It Works

### Version Comparison Strategy

The update checker uses a two-tier approach:

1. **Primary Method**: Compare `versionCode` from `output-metadata.json`
   - Downloads the `output-metadata.json` file from the release assets
   - Parses the `versionCode` (integer) from the metadata
   - Compares with `BuildConfig.VERSION_CODE`
   - Only shows update if remote `versionCode` > current `versionCode`

2. **Fallback Method**: Compare `tagName` (version string)
   - Used if `output-metadata.json` is not found in release assets
   - Used if downloading or parsing metadata fails
   - Compares `release.tagName` with `BuildConfig.VERSION_NAME`

### Why versionCode?

Using `versionCode` for comparison is more reliable than version strings because:
- **Integer comparison**: Simple numeric comparison (e.g., 2026 > 2025)
- **No parsing errors**: Avoids issues with version string formats
- **Always incremental**: Version codes always increase with each build
- **CI/CD friendly**: Automatically generated from CI pipeline ID

## Technical Details

### Data Structures

#### OutputMetadata

The `output-metadata.json` file structure:

```kotlin
data class OutputMetadata(
    val version: Int,                    // Metadata format version
    val artifactType: ArtifactType,      // Build artifact type
    val applicationId: String,           // Package name
    val variantName: String,             // Build variant (release/debug)
    val elements: List<Element>          // Output elements
)

data class Element(
    val type: String,                    // Output type (e.g., "SINGLE")
    val versionCode: Int,                // App version code
    val versionName: String,             // App version name
    val enabled: Boolean,                // Whether this output is enabled
    val outputFile: String               // APK filename
)
```

Example `output-metadata.json`:
```json
{
  "version": 3,
  "artifactType": {
    "type": "APK",
    "kind": "Directory"
  },
  "applicationId": "com.qwe7002.telegram_sms",
  "variantName": "release",
  "elements": [
    {
      "type": "SINGLE",
      "versionCode": 2026,
      "versionName": "26.01",
      "enabled": true,
      "outputFile": "app-release.apk"
    }
  ]
}
```

### Update Check Flow

```
User triggers check
       ↓
Fetch latest release from GitHub API
       ↓
Parse GitHubRelease JSON
       ↓
Search for output-metadata.json in assets
       ↓
   Found? ──No──→ Fallback to tagName comparison
       ↓ Yes
Download output-metadata.json
       ↓
Parse OutputMetadata
       ↓
Compare versionCode: remote > current?
       ↓ Yes
Find APK asset in release
       ↓
Show update dialog with download link
```

### Code Implementation

The update check is triggered from `MainActivity`:

```kotlin
private fun checkUpdate() {
    // Check for debug builds
    if (BuildConfig.DEBUG) {
        showErrorDialog("Debug version can not check update.")
        return
    }
    
    // Determine app identifier (main or nightly)
    var appIdentifier = applicationContext.getString(R.string.app_identifier)
    if(BuildConfig.VERSION_NAME.contains("nightly")){
        appIdentifier += "-nightly"
    }
    
    // Fetch latest release from GitHub
    val requestUri = String.format(
        "https://api.github.com/repos/telegram-sms/%s/releases/latest",
        appIdentifier
    )
    
    // ... OkHttp request handling ...
    
    // Look for output-metadata.json in release assets
    val metadataAsset = release.assets.find { it.name == "output-metadata.json" }
    if (metadataAsset != null) {
        checkVersionFromMetadata(release, metadataAsset.browserDownloadUrl, okhttpObj)
    } else {
        // Fallback to tagName comparison
    }
}

private fun checkVersionFromMetadata(
    release: GitHubRelease, 
    metadataUrl: String, 
    okhttpObj: OkHttpClient
) {
    // Download metadata
    // Parse JSON
    val metadata = gson.fromJson(metadataJson, OutputMetadata::class.java)
    
    // Compare versionCode
    val remoteVersionCode = metadata.elements.firstOrNull()?.versionCode
    if (remoteVersionCode != null && remoteVersionCode > BuildConfig.VERSION_CODE) {
        // Show update dialog
    }
}
```

## Repository Support

The update checker works with both main and nightly repositories:

- **Main Repository**: `telegram-sms/telegram-sms`
  - For stable releases
  - Version format: `YY.MM` (e.g., "26.01")

- **Nightly Repository**: `telegram-sms/telegram-sms-nightly`
  - For pre-release builds
  - Version format: `YYYYMMDDHHMM-branch-sha`
  - Automatically detected if `BuildConfig.VERSION_NAME.contains("nightly")`

## CI/CD Integration

The update checking system relies on CI/CD pipelines to:

1. **Generate output-metadata.json**: Automatically created by Android Gradle Plugin during build
2. **Upload to GitHub Release**: Both APK and output-metadata.json must be uploaded as release assets
3. **Set version code**: Use CI pipeline ID or build number as `VERSION_CODE` environment variable

### GitLab CI Example

```yaml
build_release:
  stage: build
  script:
    - export VERSION_CODE=$CI_PIPELINE_ID
    - export VERSION_NAME="26.01"
    - ./gradlew assembleRelease
    - cp app/build/outputs/apk/release/app-release.apk ./
    - cp app/build/outputs/apk/release/output-metadata.json ./
  artifacts:
    paths:
      - app-release.apk
      - output-metadata.json
```

### GitHub Actions Example

```yaml
- name: Build Release APK
  run: |
    export VERSION_CODE=${{ github.run_number }}
    export VERSION_NAME="26.01"
    ./gradlew assembleRelease

- name: Upload Release Assets
  uses: actions/upload-release-asset@v1
  with:
    upload_url: ${{ steps.create_release.outputs.upload_url }}
    asset_path: ./app/build/outputs/apk/release/app-release.apk
    asset_name: app-release.apk
    asset_content_type: application/vnd.android.package-archive

- name: Upload Metadata
  uses: actions/upload-release-asset@v1
  with:
    upload_url: ${{ steps.create_release.outputs.upload_url }}
    asset_path: ./app/build/outputs/apk/release/output-metadata.json
    asset_name: output-metadata.json
    asset_content_type: application/json
```

## User Experience

### Update Check Trigger

Users can manually trigger update check from:
- **Main Menu** → Check for Updates

### Update Dialog

When an update is available, users see:
- **Version information**: New version number
- **Download button**: Direct link to download APK
- **Changelog**: Release notes (if available)

### Error Handling

The system handles various error scenarios:
- **Network errors**: Shows error message to user
- **Missing metadata**: Falls back to tagName comparison
- **Parse errors**: Falls back to tagName comparison
- **Debug builds**: Prevents update check (debug builds should not be updated)

## Best Practices

### For Release Maintainers

1. **Always upload output-metadata.json**: Include it as a release asset alongside the APK
2. **Use consistent version codes**: Ensure version code always increases
3. **Test update flow**: Verify update detection works before publishing
4. **Include APK in assets**: Ensure at least one `.apk` file is in release assets

### For Developers

1. **Don't modify version comparison logic**: The current implementation handles edge cases
2. **Test fallback mechanism**: Ensure tagName comparison works if metadata is unavailable
3. **Log debugging info**: Keep `Log.d()` statements for troubleshooting
4. **Handle all exceptions**: Don't let parsing errors crash the app

## Troubleshooting

### Update not detected

**Possible causes**:
- Remote version code is not greater than current version code
- `output-metadata.json` is malformed or missing
- Network connectivity issues
- GitHub API rate limiting

**Solution**:
- Check logs for error messages
- Verify `output-metadata.json` exists in release assets
- Ensure version code in metadata is correct
- Wait and retry if rate limited

### False positive update detection

**Possible causes**:
- Using tagName comparison (fallback mode)
- Version string doesn't match exactly

**Solution**:
- Ensure `output-metadata.json` is uploaded to release
- Verify metadata contains correct version code
- Check that version code increases with each build

### Debug build trying to update

**Expected behavior**:
- Debug builds show error: "Debug version can not check update."
- This is intentional to prevent accidental updates of debug builds

## Related Files

- `MainActivity.kt` - Update check implementation
- `data_structure/OutputMetadata.kt` - Output metadata data structure
- `data_structure/GitHubRelease.kt` - GitHub release API response structure
- `app/build.gradle` - Version code configuration

## Future Improvements

Potential enhancements to consider:
- **Automatic updates**: Download and install updates automatically (with user permission)
- **Update channels**: Stable, beta, nightly channels
- **Delta updates**: Download only changed files
- **In-app changelog**: Display release notes in update dialog
- **Background checks**: Periodic automatic update checks
- **Update preferences**: User-configurable update check frequency

## References

- [Android Gradle Plugin Output Metadata](https://developer.android.com/studio/build/gradle-tips#output-metadata)
- [GitHub Releases API](https://docs.github.com/en/rest/releases/releases)
- [OkHttp Documentation](https://square.github.io/okhttp/)

