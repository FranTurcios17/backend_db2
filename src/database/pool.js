import { createPool } from "mysql2/promise";

const pool = createPool({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DBNAME,
    port: process.env.DBPORT
})

export default pool;