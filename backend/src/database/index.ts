import { Db } from 'mongodb';
const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

// Store multiple database connections by name
const databaseConnections: Map<string, any> = new Map();
let cachedMongoDb: Db | null = null;

interface DatabaseConfig {
    host: string;
    username: string;
    password: string;
    database: string;
    waitForConnections?: boolean;
    connectionLimit?: number;
    queueLimit?: number;
}

/**
 * Connect to a database and store it with a name
 * @param name - Unique name for the database connection
 * @param databaseType - Type of database ('mysql' or 'mongodb')
 * @param databaseEndpoint - MongoDB connection string (for mongodb)
 * @param databaseConfig - MySQL connection config (for mysql)
 * @returns Promise resolving to the database connection
 */
async function connectToDatabase(
    name: string,
    databaseType: string,
    databaseEndpoint: string | null = null,
    databaseConfig: DatabaseConfig | null = null
): Promise<any> {
    // Check if connection already exists
    if (databaseConnections.has(name)) {
        console.log(`Database connection '${name}' already exists, reusing...`);
        return databaseConnections.get(name);
    }

    if (databaseType === 'mongodb') {
        if (!databaseEndpoint) {
            throw new Error('MongoDB endpoint is required');
        }
        const client = await mongoose.connect(databaseEndpoint);
        const db = client.connection;
        cachedMongoDb = db;
        databaseConnections.set(name, db);
        console.log(`✓ Connected to MongoDB database: ${name}`);
        return db;
    } else if (databaseType === 'mysql' && databaseConfig) {
        console.log('Creating connection pool for database: ', databaseConfig);
        // Create the connection pool
        const pool = mysql.createPool({
            host: databaseConfig.host,
            user: databaseConfig.username,
            password: databaseConfig.password,
            database: databaseConfig.database,
            waitForConnections: databaseConfig.waitForConnections ?? true,
            connectionLimit: databaseConfig.connectionLimit ?? 10,
            queueLimit: databaseConfig.queueLimit ?? 0
        });

        // Test the connection
        try {
            const connection = await pool.getConnection();
            await connection.ping();
            connection.release();
            console.log(`✓ Connected to MySQL database: ${name} (${databaseConfig.database})`);
        } catch (error: any) {
            console.error(`✗ Failed to connect to MySQL database: ${name}`, error.message);
            throw new Error(`Failed to connect to database '${name}': ${error.message}`);
        }

        databaseConnections.set(name, pool);
        return pool;
    } else {
        throw new Error(`Invalid database configuration for '${name}'. Provide either databaseEndpoint (for mongodb) or databaseConfig (for mysql)`);
    }
}

/**
 * Get a database connection by name
 * @param name - Name of the database connection (e.g., 'vmcPortal', 'vmcTest', 'vmcAdmissionTest')
 * @returns The database connection pool/instance
 * 
 * @example
 * // In a controller or service:
 * const { getDatabase } = require('@/database');
 * const vmcPortal = getDatabase('vmcPortal');
 * const [rows] = await vmcPortal.query('SELECT * FROM students');
 */
function getDatabase(name: string): any {
    const connection = databaseConnections.get(name);
    if (!connection) {
        throw new Error(`Database connection '${name}' not found. Make sure it's connected first.`);
    }
    return connection;
}

/**
 * Test all database connections
 * @returns Promise resolving to an object with connection status for each database
 */
async function testAllConnections(): Promise<Record<string, { status: string; error?: string }>> {
    const results: Record<string, { status: string; error?: string }> = {};

    for (const [name, connection] of databaseConnections.entries()) {
        console.log('Testing connection to database: ', name);
        console.log('Connection: ', connection);
        try {
            // For MySQL pools, test with a ping
            if (connection && typeof connection.getConnection === 'function') {
                const conn = await connection.getConnection();
                await conn.ping();
                conn.release();
                results[name] = { status: 'connected' };
            } else {
                // For MongoDB or other types
                results[name] = { status: 'connected' };
            }
        } catch (error: any) {
            results[name] = { status: 'disconnected', error: error.message };
        }
    }

    return results;
}

/**
 * Get all connected database names
 * @returns Array of database connection names
 */
function getConnectedDatabases(): string[] {
    return Array.from(databaseConnections.keys());
}

module.exports = {
    connectToDatabase,
    getDatabase,
    testAllConnections,
    getConnectedDatabases
};
