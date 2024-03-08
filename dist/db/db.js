"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
// Define PostgreSQL connection configuration
const config = {
    user: 'kpzxiger',
    password: 'LyVsHGKpuFR14kEINLjhHzBN6uBxgn72',
    host: 'rain.db.elephantsql.com',
    database: 'kpzxiger',
    // port: 5432, // PostgreSQL default port
};
// Create a new Pool instance to handle connections
const pool = new pg_1.Pool(config);
exports.pool = pool;
