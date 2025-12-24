import express from 'express';

import StudentsController from '@/controllers/Students.controller';
import CreateStudentsMiddleware from '@/middlewares/CreateStudents.middleware';

import {} from '@/types';

class RoutesManager {
    public setupRoutes(app: express.Application) {
        const router = express.Router();

        router.get('/students', StudentsController.getAllStudent);
        router.get('/students/:id', StudentsController.getStudentById);

        router.put('/students/:id', CreateStudentsMiddleware, StudentsController.updateStudent);
        router.patch('/students/:id', StudentsController.patchStudent);
        
        router.post('/students', StudentsController.createStudent);
        
        router.delete('/students/:id', StudentsController.deleteStudent);

        app.use('/api/v1/', router);
        return app;
    }
}

export default new RoutesManager();