import * as auth from "../../controller/auth/auth.controller.js"
import { schema as loginSchema } from "../../schema/login.schema.js"

export function route(fastify) {
    fastify.post('/login', { schema: loginSchema }, auth.login)
}
