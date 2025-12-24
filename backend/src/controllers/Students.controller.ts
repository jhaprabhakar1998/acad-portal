import { Request, Response, NextFunction } from 'express';
const _ = require('lodash');
const StudentModel = require('@/models/Students');
const { getDatabase } = require('@/database');
const otpService = require('../services/otp.service');

function deleteUnwantedKeys(data: any[]) {
    const filteredData = data.map((student: any) => {
        /* Delete unwanted keys which are used by mongodb internally */
        // delete student._id;
        delete student.__v;
        return student;
    });
    return filteredData;
}

/**
 * Mask mobile number - shows first 3 and last 2 digits
 * Example: 9876543210 -> 987******10
 */
function maskMobileNumber(number: string): string {
    if (!number || number.length < 5) {
        return number;
    }
    const firstThree = number.substring(0, 3);
    const lastTwo = number.substring(number.length - 2);
    const maskedLength = number.length - 5;
    return firstThree + '*'.repeat(maskedLength) + lastTwo;
}

export default {

    /**
     * Get mobile numbers for OTP
     * This method retrieves all available phone numbers for a student by roll number
     * and returns them as masked radio button HTML options
     * 
     * @route POST /api/v1/students/get-mobile-for-otp
     * @body {roll_number: string}
     */
    async getMobileForOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const rollNumber = req.body.roll_number || req.query.roll_number;

            if (!rollNumber) {
                return res.status(400).json({
                    msg: 'Roll number is required',
                    errcode: 1
                });
            }

            // Get the vmcTest database connection
            const db = getDatabase('vmcTest');

            // Query student by roll_number
            const [students] = await db.query(
                'SELECT phone_number, guardian_phone_number, father_no, mother_no FROM student WHERE roll_number = ? LIMIT 1',
                [rollNumber]
            );

            if (!Array.isArray(students) || students.length === 0) {
                return res.status(200).json({
                    msg: 'Rollno does not exist.',
                    errcode: 1
                });
            }

            const student = students[0] as any;

            // Collect all phone numbers
            const phoneNumbers = [
                student.phone_number,
                student.guardian_phone_number,
                student.father_no,
                student.mother_no
            ];

            // Filter out null, undefined, and empty strings, then get unique values
            const uniqueNumbers = Array.from(
                new Set(
                    phoneNumbers.filter(num => num && num.toString().trim() !== '')
                )
            );

            if (uniqueNumbers.length === 0) {
                return res.status(200).json({
                    msg: 'No phone numbers found for this student.',
                    errcode: 1
                });
            }

            // Generate radio button HTML
            let radioHtml = '';
            uniqueNumbers.forEach((phoneNumber, index) => {
                const masked = maskMobileNumber(phoneNumber.toString());
                const checked = index === 0 ? 'checked' : '';
                radioHtml += `<label>
                    <input type="radio" name="selected_phone" value="${phoneNumber}" ${checked}>
                    ${masked}
                </label><br>`;
            });

            return res.status(200).json({
                msg: 'OTP sent successfully',
                deatil_rollnumber: rollNumber,
                rtadioHtml: radioHtml,
                errcode: 0
            });

        } catch (error: any) {
            console.error('Error in getMobileForOtp:', error);
            next(error);
        }
    },

    /**
     * Send OTP to mobile number
     * This method generates and sends OTP to the selected mobile number
     * 
     * @route POST /api/v1/students/send-otp
     * @body {roll_number: string, mobile_number: string}
     */
    async sendOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { roll_number, mobile_number } = req.body;

            if (!roll_number || !mobile_number) {
                return res.status(400).json({
                    msg: 'Roll number and mobile number are required',
                    errcode: 1
                });
            }

            // Verify that the mobile number belongs to this roll number
            const db = getDatabase('vmcTest');
            const [students] = await db.query(
                'SELECT id FROM student WHERE roll_number = ? AND (phone_number = ? OR guardian_phone_number = ? OR father_no = ? OR mother_no = ?) LIMIT 1',
                [roll_number, mobile_number, mobile_number, mobile_number, mobile_number]
            );

            if (!Array.isArray(students) || students.length === 0) {
                return res.status(200).json({
                    msg: 'Mobile number does not belong to this roll number',
                    errcode: 1
                });
            }

            // Send OTP
            const result = await otpService.sendOtp(roll_number, mobile_number);

            if (!result.success) {
                return res.status(200).json({
                    msg: result.error || 'Failed to send OTP',
                    errcode: 1
                });
            }

            return res.status(200).json({
                msg: result.message || 'OTP sent successfully',
                errcode: 0
            });

        } catch (error: any) {
            console.error('Error in sendOtp:', error);
            next(error);
        }
    },

    /**
     * Verify OTP and create session
     * This method verifies the OTP and creates a user session
     * 
     * @route POST /api/v1/students/verify-otp
     * @body {roll_number: string, mobile_number: string, otp: string}
     */
    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        try {
            const { roll_number, mobile_number, otp } = req.body;

            if (!roll_number || !mobile_number || !otp) {
                return res.status(400).json({
                    msg: 'Roll number, mobile number, and OTP are required',
                    errcode: 1
                });
            }

            // Verify OTP
            const result = await otpService.verifyOtp(roll_number, mobile_number, otp);

            if (!result.success) {
                return res.status(200).json({
                    msg: result.error || 'OTP verification failed',
                    errcode: 1
                });
            }

            // Fetch student from database
            const db = getDatabase('vmcTest');
            const [students] = await db.query(
                'SELECT * FROM student WHERE roll_number = ? LIMIT 1',
                [roll_number]
            );

            if (!Array.isArray(students) || students.length === 0) {
                return res.status(200).json({
                    msg: 'Student not found',
                    errcode: 1
                });
            }

            const student = students[0];

            // Create session (stored in req.session by express-session middleware)
            (req.session as any)._user = student;

            return res.status(200).json({
                msg: 'OTP Verified, Thanks',
                errcode: 0
            });

        } catch (error: any) {
            console.error('Error in verifyOtp:', error);
            next(error);
        }
    },
};