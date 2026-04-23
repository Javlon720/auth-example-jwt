import { Pool } from "pg"

import { config } from "shared/config"

const pool = new Pool({
    host: config.pg_host,
    port: config.pg_port,
    user: config.pg_user,
    database: config.pg_database,
    password: config.pg_password
})

export async function quer(sql, ...params) {
    let clinet = null
    try {
        clinet = await pool.connect()
        const result = await clinet.query(sql, params)
        return result.rows
    } catch (error) {
        console.log(error.message);
    }
    finally {
        clinet.release()
    }

}