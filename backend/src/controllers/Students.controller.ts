import { Request, Response, NextFunction } from 'express';
const _ = require('lodash');
const StudentModel = require('@/models/Students');
const { getDatabase } = require('@/database');

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
};