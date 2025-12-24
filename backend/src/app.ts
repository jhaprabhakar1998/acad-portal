import routes from '@/routes';
import cors from 'cors';
import express from 'express';
import compression from 'compression';
import HealthCheckMiddleware from './middlewares/HealthCheck.middleware';
import { configureSession } from './middlewares/session.middleware';

const { connectToDatabase, testAllConnections, getConnectedDatabases } = require('@/database');

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
        
        // Configure CORS with credentials for session cookies
        this.app.use(cors({
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true
        }));
        
        this.app.use(express.json({ limit: process.env.PAYLOAD_SIZE }));
        this.app.use(express.urlencoded({ extended: true, limit: process.env.PAYLOAD_SIZE }));
        this.app.use(express.text({ type: 'text/plain', limit: process.env.PAYLOAD_SIZE }));
    }

    private setupMiddleware(): void {
        // Configure session middleware (must be before routes)
        configureSession(this.app);
    }

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
            console.log('Setting up database connections...');
            
            // Connect to vmcPortal (main portal database)
            await connectToDatabase('vmcPortal', 'mysql', null, {
                host: process.env.DB_HOST,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE
            });

            // Connect to vmcTest (test database)
            await connectToDatabase('vmcTest', 'mysql', null, {
                host: process.env.DB_HOST_VMC_TEST,
                username: process.env.DB_USERNAME_VMC_TEST,
                password: process.env.DB_PASSWORD_VMC_TEST,
                database: process.env.DB_DATABASE_VMC_TEST
            });

            // Connect to vmcAdmissionTest (admission test database)
            await connectToDatabase('vmcAdmissionTest', 'mysql', null, {
                host: process.env.DB_HOST_VMC_TEST1,
                username: process.env.DB_USERNAME_VMC_TEST1,
                password: process.env.DB_PASSWORD_VMC_TEST1,
                database: process.env.DB_DATABASE_VMC_TEST1
            });

            // Test all connections
            console.log('\nTesting all database connections...');
            const connectionStatus = await testAllConnections();
            
            console.log('\nDatabase Connection Status: ', connectionStatus);
            
        } catch(e: any){
            console.error('Error while establishing database connection:', e.message);
            throw e; // Re-throw to prevent app from starting with broken connections
        }
    }

    private setupMetricsEndpoint(): void {}

    private setupErrorHandler(): void {}
}
export default new App().app;