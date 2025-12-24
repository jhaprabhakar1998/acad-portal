-- 1. Create the Primary Database
CREATE DATABASE IF NOT EXISTS `vmc_student_portal`;

-- 2. Create the Test Database
CREATE DATABASE IF NOT EXISTS `mysql_vmc_test`;

-- 3. Create the Admission Portal Database
CREATE DATABASE IF NOT EXISTS `vmc_admission_portal`;

-- 4. Configure Root User
-- This ensures 'root' can connect from any host ('%') with no password
-- Note: In MySQL 8.0, we use ALTER USER to ensure the password is empty
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- 5. Finalize
FLUSH PRIVILEGES;

