import express from 'express';

import StudentsController from '@/controllers/Students.controller';
import CreateStudentsMiddleware from '@/middlewares/CreateStudents.middleware';

import {} from '@/types';

class RoutesManager {
    public setupRoutes(app: express.Application) {
        const router = express.Router();
        
        // OTP flow endpoints
        router.post('/students/get-mobile-for-otp', StudentsController.getMobileForOtp);
        router.post('/students/send-otp', StudentsController.sendOtp);
        router.post('/students/verify-otp', StudentsController.verifyOtp);

        app.use('/api/v1/', router);
        return app;
    }
}

export default new RoutesManager();