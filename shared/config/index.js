import dotenv from "dotenv"
import { log } from "node:console"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootEnv = path.join(process.cwd(), ".env")
const repoEnv = path.join(__dirname, "../../.env")
const envPath = fs.existsSync(rootEnv) ? rootEnv : repoEnv

dotenv.config({ path: envPath })

export const config = {
  vite_api_port: process.env.VITE_API_PORT,
  vite_web_port: process.env.VITE_WEB_PORT,
  jwt_secret: process.env.JWT_SECRET, 
  pg_host: process.env.PG_HOST,
  pg_port: process.env.PG_PORT,
  pg_user: process.env.PG_USER,
  pg_password: process.env.PG_PASSWORD,
  pg_database: process.env.PG_DATABASE,
}



