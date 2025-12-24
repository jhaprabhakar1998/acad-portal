-- Student Table Schema for get_mobileno_for_otp method
-- This table is used in the vmcTest database (mysql_vmc_test connection)
-- The actual table may have additional columns

USE mysql_vmc_test;

CREATE TABLE IF NOT EXISTS `student` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `roll_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Student roll number - unique identifier',
  `phone_number` VARCHAR(15) NULL COMMENT 'Student phone number',
  `guardian_phone_number` VARCHAR(15) NULL COMMENT 'Guardian phone number',
  `father_no` VARCHAR(15) NULL COMMENT 'Father phone number',
  `mother_no` VARCHAR(15) NULL COMMENT 'Mother phone number',
  `first_name` VARCHAR(100) NULL,
  `last_name` VARCHAR(100) NULL,
  `email` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL DEFAULT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  INDEX `idx_roll_number` (`roll_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student table for OTP phone number retrieval';

INSERT INTO `student` (`roll_number`, `phone_number`, `guardian_phone_number`, `father_no`, `mother_no`, `first_name`, `last_name`) VALUES
('ROLL001', '9102448881', '9102448881', '9102448881', '9102448881', 'Test', 'Student');
