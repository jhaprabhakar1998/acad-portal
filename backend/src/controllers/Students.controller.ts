import { Request, Response, NextFunction } from 'express';
const _ = require('lodash');
const StudentModel = require('@/models/Students');

function deleteUnwantedKeys(data: any[]) {
    const filteredData = data.map((student: any) => {
        /* Delete unwanted keys which are used by mongodb internally */
        // delete student._id;
        delete student.__v;
        return student;
    });
    return filteredData;
}

export default {
    async getAllStudent(req: Request, res: Response, next: NextFunction) {
        try {
            const phone = req.query?.phone;
            const name = req.query?.name;
            const email = req.query?.email;
            let students;

            /* Why using lean() - https://stackoverflow.com/questions/28442920/mongoose-find-method-returns-object-with-unwanted-properties */

            if (phone) {
                students = await StudentModel.find({ phone }).lean();
            } else if (name) {
                students = await StudentModel.find({ name }).lean();
            } else if (email) {
                students = await StudentModel.find({ email }).lean();
            }
            else {
                students = await StudentModel.find({}).lean();
            }

            const filteredStudentsData = deleteUnwantedKeys(students);
            return res.status(200).json(filteredStudentsData);
        } catch (error) {
            next(error);
        }
    },

    async getStudentById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.id;
            const students = await StudentModel.find({ _id: id }).lean();
            const filteredStudentsData = deleteUnwantedKeys(students);

            return res.status(200).json(filteredStudentsData);
        } catch (error) {
            next(error);
        }
    },

    async createStudent(req: Request, res: Response, next: NextFunction) {
        try {
            const student = new StudentModel(req.body);
            await student.save();
            res.send(student);
        } catch (error) {
            next(error);
        }
    },

    async updateStudent(req: Request, res: Response, next: NextFunction) {
        try {

            const id = req.params.id;
            const student = await StudentModel.findOne({ _id: id });
            if (student) {
                const className = req.body.class; /* Cannot directly access class due to it being a reserved word and resulting in typescript error */
                const { name, age, email, section, phone, address } = req.body;
                student.name = name;
                student.age = age;
                student.class = className;
                student.section = section;
                student.email = email;
                student.phone = phone;
                student.address = address;

                const updatedStudent = await student.save();
                return res.status(200).json(updatedStudent);
            }
            else {
                throw new Error('Id does not exist');
            }
        } catch (error) {
            next(error);
        }
    },

    async patchStudent(req: Request, res: Response, next: NextFunction) {
        try {

            const id = req.params.id;
            const updateFields = req.body;

            const student = await StudentModel.findByIdAndUpdate(id, updateFields, { new: true });
            if (!student) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json({ student });
        } catch (error) {
            next(error);
        }
    },

    async deleteStudent(req: Request, res: Response, next: NextFunction) {
        try {

            const id = req.params.id;
            const user = await StudentModel.findByIdAndDelete(id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    },
};