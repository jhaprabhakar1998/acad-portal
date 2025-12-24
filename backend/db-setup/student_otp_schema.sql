-- Student OTP Table Schema
-- This table stores OTPs for student login authentication
-- Database: vmcTest (mysql_vmc_test)

CREATE TABLE IF NOT EXISTS `student_otp` (
  `id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `roll_number` VARCHAR(50) NOT NULL COMMENT 'Student roll number',
  `mobile_number` VARCHAR(15) NOT NULL COMMENT 'Mobile number (without country code)',
  `otp` VARCHAR(6) NOT NULL COMMENT '6-digit OTP',
  `is_used` TINYINT(1) DEFAULT 0 COMMENT '0 = unused, 1 = used',
  `expires_at` DATETIME NOT NULL COMMENT 'OTP expiration timestamp',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_roll_mobile` (`roll_number`, `mobile_number`),
  INDEX `idx_expires` (`expires_at`),
  INDEX `idx_is_used` (`is_used`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Student login OTP storage';

-- Cleanup old expired OTPs (can be run periodically)
-- DELETE FROM student_otp WHERE expires_at < NOW() OR is_used = 1;

