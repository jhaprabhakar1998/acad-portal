import fs from 'fs';
import dotEnvExtended from 'dotenv-extended';
import path from 'path';

process.env.TZ = 'UTC';
process.env.ROOT_DIR = path.join(__dirname, '..').toString();

const EXTERNAL_PROPERTIES: any[] = [];
const ENVIRONMENT = process.env.NODE_ENV;

const isLocal = ENVIRONMENT === 'local';
const isProd = ENVIRONMENT === 'production';
const isDev = ENVIRONMENT === 'development';
const isTest = ENVIRONMENT === 'test';

const verifyExternalProperties = (env: dotEnvExtended.IEnvironmentMap): void => {
    EXTERNAL_PROPERTIES.forEach((property) => {
        if (!(property in env)) {
            throw new Error(`Environment property '${property}' not found`);
        }
    });
};

const loadEnvConfig = (configFilePath: string) => {
    const defaultFilePath = path.join(process.env.ROOT_DIR, '../.env.defaults');
    const schemaFilePath = path.join(process.env.ROOT_DIR, '../.env.schema');
    const env = dotEnvExtended.load({
        encoding: 'utf8',
        silent: false,
        defaults: defaultFilePath,
        path: configFilePath,
        schema: schemaFilePath,
        errorOnMissing: false,
        errorOnExtra: false,
        errorOnRegex: true,
        includeProcessEnv: true,
        assignToProcessEnv: true,
        overrideProcessEnv: false,
    });
    verifyExternalProperties(env);
};

if (isProd) {
    const appEnvFile = path.join(process.env.ROOT_DIR, `../.env.${process.env.APP_ENV}`.toLowerCase());
    const dotEnvFile = path.join(process.env.ROOT_DIR, '../.env');
    
    if (process.env.APP_ENV && fs.existsSync(appEnvFile)) {
        console.log(`Using .env.${process.env.APP_ENV.toLowerCase()} file to supply config environment variables`);
        loadEnvConfig(appEnvFile);
    } else if (fs.existsSync(dotEnvFile)) {
        console.log('Using .env file to supply config environment variables');
        loadEnvConfig(dotEnvFile);
    } else {
        throw new Error('Unable to find env files');
    }
} else {
    console.log('Using .env.local file to supply config environment variables');
    loadEnvConfig(path.join(process.env.ROOT_DIR, '../.env.local')); 
}

export default {
    ENVIRONMENT: process.env.NODE_ENV,
    isDev,
    isProd,
    isTest,
};