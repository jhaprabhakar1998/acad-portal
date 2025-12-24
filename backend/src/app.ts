import routes from '@/routes';
import cors from 'cors';
import express from 'express';
import compression from 'compression';
import HealthCheckMiddleware from './middlewares/HealthCheck.middleware';

const connectToDatabase = require('@/database');

class App {
    public app: express.Application = express();
    
    constructor() {
        this.config();
        this.setupHealthCheck();
        this.setupDatabase();
        this.setupMiddleware();
        this.setupRouter();
        this.setupErrorHandler();
    }

    private config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(compression());
        this.app.use(cors());
        this.app.use(express.json({ limit: process.env.PAYLOAD_SIZE }));
        this.app.use(express.urlencoded({ extended: true, limit: process.env.PAYLOAD_SIZE }));
        this.app.use(express.text({ type: 'text/plain', limit: process.env.PAYLOAD_SIZE }));
    }

    private setupMiddleware(): void {}

    private setupRouter(): void {
        this.app = routes.setupRoutes(this.app);
    }

    private setupHealthCheck(): void {
        this.app.use('/health', HealthCheckMiddleware);
    }

    private async setupDatabase(): Promise<void> {
        if(process.env.NODE_ENV === 'test'){
            return;
        }
        try {
            // await connectToDatabase('mongodb', process.env.DB_ENDPOINT);
            await connectToDatabase('mysql', null , {
                host: process.env.DB_HOST,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            });

            await connectToDatabase('mysql', null , {
                host: process.env.DB_HOST_VMC_TEST,
                username: process.env.DB_USERNAME_VMC_TEST,
                password: process.env.DB_PASSWORD_VMC_TEST,
                database: process.env.DB_DATABASE_VMC_TEST
            });

            await connectToDatabase('mysql', null , {
                host: process.env.DB_HOST_VMC_TEST1,
                username: process.env.DB_USERNAME_VMC_TEST1,
                password: process.env.DB_PASSWORD_VMC_TEST1,
                database: process.env.DB_DATABASE_VMC_TEST1
            });
        } catch(e){
            console.log('Error while establishing database connection');
        }
    }

    private setupMetricsEndpoint(): void {}

    private setupErrorHandler(): void {}
}
export default new App().app;