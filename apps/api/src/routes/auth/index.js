import { route as loginRoute } from "./login.js";
import { route as registerRoute } from "./register.js";
import { route as refreshRoute } from "./refresh.js";
import { route as meRoute } from "./me.js";

export default function (fastify) {
    fastify.register(refreshRoute)
    fastify.register(loginRoute)
    fastify.register(registerRoute)
    fastify.register(meRoute)
}
