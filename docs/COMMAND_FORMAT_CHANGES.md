# Command Format Changes - Dual SIM Support

## Overview

This document describes the changes made to the SMS and USSD command formats to improve dual SIM card support and provide a more consistent user experience.

## Changed Commands

### SMS Commands

**Old Format (Deprecated but still supported):**
- `/sendsms` - Send SMS via default SIM
- `/sendsms1` - Send SMS via SIM card 1
- `/sendsms2` - Send SMS via SIM card 2

**New Format (Recommended):**
- `/sendsms` - Send SMS (interactive mode will prompt for SIM selection on dual SIM devices)
- `/sendsms 1` - Send SMS via SIM card 1
- `/sendsms 2` - Send SMS via SIM card 2

### USSD Commands

**Old Format (Deprecated but still supported):**
- `/sendussd` - Send USSD via default SIM
- `/sendussd1` - Send USSD via SIM card 1
- `/sendussd2` - Send USSD via SIM card 2

**New Format (Recommended):**
- `/sendussd` - Send USSD (interactive mode will prompt for SIM selection on dual SIM devices)
- `/sendussd 1 <code>` - Send USSD code via SIM card 1
- `/sendussd 2 <code>` - Send USSD code via SIM card 2

## Usage Examples

### Sending SMS

#### Direct Command Format

**Single SIM Device:**
```
/sendsms
+1234567890
Hello, this is a test message.
```

**Dual SIM Device - Specify SIM 1:**
```
/sendsms 1
+1234567890
Hello from SIM 1
```

**Dual SIM Device - Specify SIM 2:**
```
/sendsms 2
+1234567890
Hello from SIM 2
```

**Dual SIM Device - Interactive Mode:**
```
/sendsms
```
The bot will prompt you to select which SIM card to use.

#### Trusted Phone SMS Control

From your trusted phone number, you can send:

```
/sendsms 1 +1234567890
Test message content
```

This will send the message via SIM card 1.

### Sending USSD Codes

**Single SIM Device:**
```
/sendussd *123#
```

**Dual SIM Device - Specify SIM 1:**
```
/sendussd 1 *123#
```

**Dual SIM Device - Specify SIM 2:**
```
/sendussd 2 *123#
```

**Dual SIM Device - Interactive Mode:**
```
/sendussd
```
The bot will prompt you to select which SIM card to use, then ask for the USSD code.

## Implementation Details

### Code Changes

The following files were modified to support the new command format:

1. **String Resources** (`strings_chat.xml`)
   - Added `sendsms_dual` and `send_ussd_dual_command` strings

2. **Command Keyboard** (`ChatCommand.kt`)
   - Simplified keyboard to show single buttons for `/sendsms` and `/sendussd`
   - Removed dual button display for dual SIM mode

3. **Command Parser** (`ChatService.kt`)
   - Updated to parse SIM card number from command arguments
   - Added logic to detect format: `/sendsms [1|2]`
   - Interactive mode prompts for SIM selection when needed

4. **SMS Receiver** (`SMSReceiver.kt`)
   - Updated trusted phone command parsing
   - Supports both old and new formats

5. **Language Packs**
   - Created `strings_chat.xml` for all 9 supported languages

### Backward Compatibility

The old command formats (`/sendsms1`, `/sendsms2`, `/sendussd1`, `/sendussd2`) are still supported for backward compatibility. However, users are encouraged to use the new format for a more consistent experience.

### Interactive Mode Behavior

When using `/sendsms` or `/sendussd` on a dual SIM device without specifying a SIM card number:

1. The bot displays a keyboard with "SIM 1" and "SIM 2" buttons
2. User selects the desired SIM card
3. Bot proceeds to the next step (phone number or USSD code input)

This provides a user-friendly way to select the SIM card without remembering specific command syntax.

## Benefits of New Format

1. **Consistency**: All commands follow the same pattern
2. **Simplicity**: Single command button instead of multiple buttons
3. **Flexibility**: Supports both inline and interactive modes
4. **Backward Compatible**: Old commands still work
5. **Better UX**: Interactive mode guides users through the process

## Migration Guide

For users currently using the old format:

### Old Format
```
/sendsms1
+1234567890
Test message
```

### New Format (Equivalent)
```
/sendsms 1
+1234567890
Test message
```

### Interactive Alternative
```
/sendsms
```
Then follow the prompts to select SIM card and enter phone number.

## Testing Checklist

When testing the new command format, verify:

- [ ] `/sendsms` works on single SIM devices
- [ ] `/sendsms` shows SIM selection on dual SIM devices
- [ ] `/sendsms 1` sends via SIM 1 on dual SIM devices
- [ ] `/sendsms 2` sends via SIM 2 on dual SIM devices
- [ ] `/sendsms1` still works (backward compatibility)
- [ ] `/sendsms2` still works (backward compatibility)
- [ ] `/sendussd` works with similar behavior
- [ ] Trusted phone SMS commands support new format
- [ ] All language packs have correct translations

## Future Considerations

- Consider deprecating old format in a future major version
- Add command aliases for common operations
- Improve error messages when invalid SIM number is provided
- Add support for named SIM cards (e.g., "Work", "Personal")

## Related Documentation

- [User Manual](../../document/docs/user-manual.md)
- [String Resources Organization](./STRING_RESOURCES.md)
- [Project Instructions](./instructions/project.instructions.md)

