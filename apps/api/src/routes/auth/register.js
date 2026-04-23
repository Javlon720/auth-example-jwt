import * as auth from "../../controller/auth/auth.controller.js"
import { schema as registerSchema } from "../../schema/register.schema.js"


export function route(fastify) {
    fastify.post('/register', { schema: registerSchema }, auth.register)
}