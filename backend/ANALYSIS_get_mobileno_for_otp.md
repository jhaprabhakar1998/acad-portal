# Analysis: get_mobileno_for_otp Method

## Overview
This document provides a thorough analysis of the `get_mobileno_for_otp` method from the PHP StudentsController and its implementation requirements for Node.js.

## Database Information

### Database Connection
- **PHP Connection Name**: `mysql_vmc_test`
- **Node.js Connection Name**: `vmcTest` (as configured in app.ts)
- **Environment Variables**:
  - `DB_HOST_VMC_TEST`
  - `DB_USERNAME_VMC_TEST`
  - `DB_PASSWORD_VMC_TEST`
  - `DB_DATABASE_VMC_TEST`

### Table Information
- **Table Name**: `student`
- **Database**: As specified in `DB_DATABASE_VMC_TEST`

## Method Logic Analysis

### Input
- **Parameter**: `roll_number` (from request input)
- **Type**: String

### Process Flow
1. **Query Student**: 
   - Query the `student` table by `roll_number`
   - Select columns: `phone_number`, `guardian_phone_number`, `father_no`, `mother_no`

2. **Collect Phone Numbers**:
   - Collect all 4 phone numbers into an array
   - Filter out empty/null values
   - Get unique values (remove duplicates)

3. **Generate Radio Buttons**:
   - For each unique phone number:
     - Mask the number (show first 3 and last 2 digits)
     - Generate HTML radio button
     - First number is checked by default

4. **Masking Logic**:
   - Keep first 3 digits visible
   - Mask middle digits with asterisks
   - Keep last 2 digits visible
   - Example: `9876543210` → `987******10`

### Output Format
```json
{
  "msg": "OTP sent successfully",
  "deatil_rollnumber": "ROLL123",
  "rtadioHtml": "<label><input type='radio' name='selected_phone' value='9876543210' checked>987******10</label><br>...",
  "errcode": 0
}
```

### Error Case
If student not found:
```json
{
  "msg": "Rollno does not exist.",
  "errcode": 1
}
```

## Required Table Schema

### Student Table Structure
Based on the code analysis, the `student` table should have at minimum:

```sql
CREATE TABLE IF NOT EXISTS `student` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `roll_number` VARCHAR(50) NOT NULL UNIQUE,
  `phone_number` VARCHAR(15) NULL,
  `guardian_phone_number` VARCHAR(15) NULL,
  `father_no` VARCHAR(15) NULL,
  `mother_no` VARCHAR(15) NULL,
  -- Other columns may exist but not required for this method
  INDEX `idx_roll_number` (`roll_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Key Implementation Points

1. **Database Connection**: Use `vmcTest` database connection (already configured)
2. **Query**: Simple SELECT query with WHERE clause on `roll_number`
3. **Data Processing**: 
   - Filter null/empty values
   - Remove duplicates
   - Maintain order (first number is default checked)
4. **Phone Masking**: Implement masking function
5. **HTML Generation**: Generate radio button HTML
6. **Response**: Return JSON with proper error codes

## Edge Cases to Handle

1. **No student found**: Return error response
2. **All phone numbers null/empty**: Return error (shouldn't happen in practice)
3. **Duplicate phone numbers**: Remove duplicates
4. **Empty roll_number**: Validate input

## Testing Requirements

1. Test with valid roll_number
2. Test with non-existent roll_number
3. Test with student having all 4 phone numbers
4. Test with student having some null phone numbers
5. Test with duplicate phone numbers
6. Test masking function with various phone number formats

