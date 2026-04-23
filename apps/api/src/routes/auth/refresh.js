import * as auth from "../../controller/auth/auth.controller.js"

export function route(fastify) {
    fastify.post('/refresh', auth.refresh)
}