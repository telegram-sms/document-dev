# Data Structure Version Management System - Quick Guide

## Current Version: 1

## Quick Start

The system is automatically integrated into the application, no additional configuration required. Data migration checks and execution happen automatically on each app startup.

## When to Upgrade Version?

You should upgrade the data structure version when you need to:

1. ✅ Add new configuration fields
2. ✅ Modify existing field data types (e.g., String → Long)
3. ✅ Remove unused fields
4. ✅ Reorganize data to different storage locations
5. ✅ Modify data formats or structures

## How to Add a New Version (3 Steps)

### Step 1: Update Version Number

Edit `DataMigrationManager.kt`:

```kotlin
const val CURRENT_DATA_VERSION = 2  // Change from 1 to 2
```

### Step 2: Add Migration Case

Add in `performMigration()`:

```kotlin
when (nextVersion) {
    1 -> migrateToVersion1(context, MMKV.defaultMMKV())
    2 -> migrateToVersion2(context, MMKV.defaultMMKV())  // Add this line
}
```

### Step 3: Implement Migration Logic

```kotlin
private fun migrateToVersion2(context: Context, preferences: MMKV) {
    Log.d(TAG, "Migrating to version 2")
    
    // Add new field
    if (!preferences.contains("new_setting")) {
        preferences.putBoolean("new_setting", false)
    }
    
    // Data format conversion
    val oldData = preferences.getString("old_field", "")
    if (oldData.isNotEmpty()) {
        preferences.putString("new_field", oldData.uppercase())
    }
}
```

## Common Migration Patterns

### 1. Add New Field

```kotlin
if (!preferences.contains("new_field")) {
    preferences.putBoolean("new_field", false)
}
```

### 2. Data Type Conversion

```kotlin
val oldValue = preferences.getString("chat_id", "")
if (oldValue.isNotEmpty()) {
    val newValue = oldValue.toLong()
    preferences.putLong("chat_id_long", newValue)
}
```

### 3. Remove Old Field

```kotlin
preferences.remove("deprecated_field")
```

### 4. Migrate to New MMKV Instance

```kotlin
val mainMMKV = MMKV.defaultMMKV()
val settingsMMKV = MMKV.mmkvWithID("settings")

val value = mainMMKV.getString("setting_key", "")
settingsMMKV.putString("setting_key", value)
```

## Important Notes

⚠️ **Important**:
- Version number must be incremented each time the data structure is modified
- Migration logic must handle all possible old versions
- Thoroughly test the migration process
- Document each version's changes

## View Examples

For more migration examples, refer to:
- `MigrationExamples.kt` - Practical examples
- `DATA_STRUCTURE_VERSION.md` - Complete documentation

## Data Backup

To backup data (before major changes):

```kotlin
DataMigrationManager.backupData(context)
```

## Troubleshooting

### Migration Failed?
1. Check "DataMigration" tag in Logcat
2. Verify version number is correctly updated
3. Verify migration function is correctly implemented

### Data Loss?
1. Check if fields were accidentally deleted
2. Ensure migration logic correctly handles old versions
3. Use backup feature to restore data

