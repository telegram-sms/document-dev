# Data Structure Version Management System

## Overview

This data structure version management system automatically handles application data structure upgrades, ensuring smooth data migration when users update the application.

## Current Data Structure Version

**Current Version: 1**

## Features

1. **Automatic Detection and Upgrade**: Automatically detects data structure version on app startup and executes necessary migrations
2. **Version Tracking**: Records current data structure version for easy management
3. **Backward Compatibility**: Supports upgrading from older data structure versions to newer ones
4. **Data Backup**: Provides data backup functionality to ensure safe migration
5. **Extensibility**: Easy to add new version migration logic

## Usage

### Initialization

The system is automatically initialized in `MainActivity.onCreate()`:

```kotlin
MMKV.initialize(this)
preferences = MMKV.defaultMMKV()

// Data structure migration check
DataMigrationManager.checkAndMigrate(this)
```

### Adding a New Data Structure Version

When you need to modify the data structure (e.g., adding new fields, modifying data formats, removing old fields), follow these steps:

#### Step 1: Increment the Version Number

Modify `CURRENT_DATA_VERSION` in `DataMigrationManager.kt`:

```kotlin
/**
 * Current data structure version
 * Increment this when making breaking changes to data structure
 */
const val CURRENT_DATA_VERSION = 2  // Increment from 1 to 2
```

#### Step 2: Implement Migration Logic

Add handling for the new version in the `when` statement of the `performMigration()` method:

```kotlin
when (nextVersion) {
    1 -> migrateToVersion1(context, MMKV.defaultMMKV())
    2 -> migrateToVersion2(context, MMKV.defaultMMKV())
    3 -> migrateToVersion3(context, MMKV.defaultMMKV())
    // Add new version
    4 -> migrateToVersion4(context, MMKV.defaultMMKV())
}
```

#### Step 3: Write Migration Function

Implement specific migration logic:

```kotlin
/**
 * Migration to version 4
 * Example: Add a new notification setting
 */
private fun migrateToVersion4(context: Context, preferences: MMKV) {
    Log.d(TAG, "Migrating to version 4")
    
    // Add new field with default value
    if (!preferences.contains("new_notification_setting")) {
        preferences.putBoolean("new_notification_setting", false)
    }
    
    // Transform old data format
    val oldValue = preferences.getString("old_format_field", "")
    if (oldValue.isNotEmpty()) {
        val newValue = transformOldFormat(oldValue)
        preferences.putString("new_format_field", newValue)
        // Optional: Remove old field
        preferences.remove("old_format_field")
    }
    
    // Migrate MMKV instance data
    val oldMMKV = MMKV.mmkvWithID(MMKVConst.OLD_ID)
    val newMMKV = MMKV.mmkvWithID(MMKVConst.NEW_ID)
    // ... data migration logic
}

private fun transformOldFormat(oldData: String): String {
    // Implement data format transformation logic
    return oldData.uppercase()
}
```

## Data Structure Version History

### Version 1 (Current Baseline Version)

**Date**: January 2, 2026

**Description**: Established baseline version for the data structure version management system

**Included Data Fields**:

#### Main MMKV (Default):
- `bot_token` (String) - Telegram Bot Token
- `chat_id` (String) - Telegram Chat ID
- `message_thread_id` (String) - Topic ID (for groups)
- `trusted_phone_number` (String) - Trusted phone number
- `fallback_sms` (Boolean) - Fallback to SMS
- `chat_command` (Boolean) - Chat command switch
- `battery_monitoring_switch` (Boolean) - Battery monitoring switch
- `charger_status` (Boolean) - Charger status notification
- `verification_code` (Boolean) - Verification code recognition
- `doh_switch` (Boolean) - DNS over HTTPS
- `initialized` (Boolean) - Initialization flag
- `privacy_dialog_agree` (Boolean) - Privacy policy agreement
- `call_notify` (Boolean) - Call notification
- `hide_phone_number` (Boolean) - Hide phone number
- `version_code` (Int) - App version code
- `api_address` (String) - Telegram API address
- `data_structure_version` (Int) - Data structure version number

#### MMKV Instances:
- `MMKVConst.PROXY_ID` - Proxy settings
- `MMKVConst.CHAT_ID` - Chat data
- `MMKVConst.CHAT_INFO_ID` - Chat information
- `MMKVConst.RESEND_ID` - Resend queue
- `MMKVConst.CARBON_COPY_ID` - Carbon copy service configuration
- `MMKVConst.UPDATE_ID` - Update check data
- `MMKVConst.NOTIFY_ID` - Notification settings
- `MMKVConst.TEMPLATE_ID` - Message templates
- `MMKVConst.LOG_ID` - Log data

### Version 2 (Example - Not Implemented)

When you need to upgrade to version 2, document the changes here.

**Change Details**:
- Add XXX field
- Modify XXX data format
- Remove XXX deprecated field

## API Reference

### DataMigrationManager

#### Public Methods

##### `checkAndMigrate(context: Context)`
Check and execute necessary data migrations. Should be called on app startup.

##### `getCurrentVersion(): Int`
Get the currently saved data structure version.

##### `isMigrationNeeded(): Boolean`
Check if migration is needed.

##### `backupData(context: Context): Boolean`
Backup all MMKV data. Recommended to call before major migrations.

##### `resetDataVersion()`
Reset data structure version. **Warning**: Use with caution, may cause data inconsistency.

## Best Practices

1. **Incremental Version Numbers**: Version number should increment by 1 each time the data structure is modified
2. **Maintain Backward Compatibility**: Migration logic should handle all possible older version data
3. **Detailed Documentation**: Each version change should be documented in detail in this document
4. **Thorough Testing**: Test migration from all old versions to the new version before release
5. **Data Backup**: Consider backing up data before major changes
6. **Logging**: Migration process should log detailed information for troubleshooting

## Example Scenarios

### Scenario 1: Adding New Feature Requiring New Field

```kotlin
// Version 2: Adding message encryption feature
private fun migrateToVersion2(context: Context, preferences: MMKV) {
    Log.d(TAG, "Migrating to version 2: Adding encryption support")
    
    // Add encryption switch, default off
    preferences.putBoolean("enable_encryption", false)
    
    // Add encryption key storage location
    preferences.putString("encryption_key", "")
}
```

### Scenario 2: Modifying Data Format

```kotlin
// Version 3: Migrating chat_id from String to Long
private fun migrateToVersion3(context: Context, preferences: MMKV) {
    Log.d(TAG, "Migrating to version 3: Converting chat_id to Long")
    
    val oldChatId = preferences.getString("chat_id", "")
    if (oldChatId.isNotEmpty()) {
        try {
            val chatIdLong = oldChatId.toLong()
            preferences.putLong("chat_id_long", chatIdLong)
            // Keep old field for a while to allow rollback
            // preferences.remove("chat_id")
        } catch (e: NumberFormatException) {
            Log.e(TAG, "Failed to convert chat_id to Long: $oldChatId")
        }
    }
}
```

### Scenario 3: Reorganizing Data to New MMKV Instance

```kotlin
// Version 4: Separating settings to dedicated MMKV instance
private fun migrateToVersion4(context: Context, preferences: MMKV) {
    Log.d(TAG, "Migrating to version 4: Separating settings")
    
    // Create new settings MMKV
    val settingsMMKV = MMKV.mmkvWithID("settings")
    
    // Migrate settings-related fields
    val fieldsToMigrate = listOf(
        "doh_switch",
        "battery_monitoring_switch",
        "charger_status",
        "call_notify",
        "verification_code"
    )
    
    for (field in fieldsToMigrate) {
        val value = preferences.getBoolean(field, false)
        settingsMMKV.putBoolean(field, value)
        // Optional: Remove from main MMKV
        // preferences.remove(field)
    }
}
```

## Troubleshooting

### Issue: Migration Failed

**Solution**:
1. Check error messages in logs
2. Verify correctness of migration logic
3. Ensure all required fields have default values
4. Consider using `backupData()` to restore data

### Issue: Data Loss

**Solution**:
1. Check if fields were accidentally deleted
2. Review backup data
3. Ensure migration logic correctly handles all old versions

### Issue: Version Number Mismatch

**Solution**:
1. Check if `CURRENT_DATA_VERSION` is correctly updated
2. Ensure migration functions for all versions are implemented
3. Verify migration logic executes in sequence

## Contact

For issues or suggestions, please provide feedback through GitHub Issues.

