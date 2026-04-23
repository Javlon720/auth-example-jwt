import fastify from "fastify"
import cors from "@fastify/cors"
import jwt from "@fastify/jwt"

import { config } from "shared/config"
import auth from "./routes/index.js"

const app = fastify()
app.register(cors, {
  origin: true
})
app.register(jwt, { secret: config.jwt_secret })
app.register(auth)

export default app
