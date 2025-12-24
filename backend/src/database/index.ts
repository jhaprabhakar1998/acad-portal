import { Db } from 'mongodb';
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

let cachedDb: Db | null = null;

/* 
Create a generaic database instance which we can use to connect to multiple databases. Below implementation
only covers mongodb database 
*/
async function connectToDatabase(databaseType: string, databaseEndpoint: string, databaseConfig: any = null) {
    if (cachedDb) {
        return cachedDb;
    }

    if (databaseType === 'mongodb') {
        const client = await mongoose.connect(databaseEndpoint);
        const db = client.connection;
        cachedDb = db;
        return cachedDb;
    } else if (databaseType === 'mysql' && databaseConfig) {
        // Create the connection pool
        const client = mysql.createPool({
            host: databaseConfig.host,
            user: databaseConfig.username,
            password: databaseConfig.password,
            database: databaseConfig.database,
            waitForConnections: databaseConfig.waitForConnections || true,
            connectionLimit: databaseConfig.connectionLimit || 10,
            queueLimit: databaseConfig.queueLimit || 0
        });
        return client;
    }
    else {
        throw new Error('Error while establishing connection to database');
    }
}

module.exports = connectToDatabase;
