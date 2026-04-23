import { config } from "shared/config"
import app from './app.js'


async function start() {

    try {
        await app.listen({ port: Number(config.vite_api_port), host: "127.0.0.1" })

        console.log(`API server: http://127.0.0.1:${config.vite_api_port}`);
        console.log(`http://localhost:${config.vite_api_port}/auth/login`);
        console.log(`http://localhost:${config.vite_api_port}/auth/register`);
        console.log(`http://localhost:${config.vite_api_port}/auth/refresh`);
        console.log(`http://localhost:${config.vite_api_port}/auth/me`);

        



    } catch (error) {
        console.error(error.message);
        process.exit(1)
    }
}


await start()
