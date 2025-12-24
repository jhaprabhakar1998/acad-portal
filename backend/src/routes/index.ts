import express from 'express';

import StudentsController from '@/controllers/Students.controller';
import CreateStudentsMiddleware from '@/middlewares/CreateStudents.middleware';

import {} from '@/types';

class RoutesManager {
    public setupRoutes(app: express.Application) {
        const router = express.Router();
        router.post('/students/get-mobile-for-otp', StudentsController.getMobileForOtp);

        app.use('/api/v1/', router);
        return app;
    }
}

export default new RoutesManager();