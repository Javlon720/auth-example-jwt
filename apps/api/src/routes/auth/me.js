import * as auth from "../../controller/auth/auth.controller.js"

export function route(fastify) {
    fastify.get('/me', auth.me)
}
