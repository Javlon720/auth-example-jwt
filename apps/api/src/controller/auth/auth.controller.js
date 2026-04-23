import * as auth from "../../service/auth/auth.service.js"


export async function register(req, reply) {
    const result = await auth.register(req.body)
    reply.code(result.status).send(result)
}

export async function login(req, reply) {
  const result = await auth.login({
    ...req.body,
    jwt: req.server.jwt
  })

  reply.code(result.status).send(result)
}

export async function refresh(req, reply) {
  const authHeader = req.headers.authorization
  const refreshToken = authHeader?.split(' ')[1] || req.body.refreshToken

  const result = await auth.refresh({
    refreshToken,
    fastify: req.server
  })

  reply.code(result.status).send(result)
}

export async function me(req, reply) {
  const authHeader = req.headers.authorization
  const accessToken = authHeader?.split(' ')[1]

  const result = await auth.me({
    accessToken,
    fastify: req.server
  })

  reply.code(result.status).send(result)
}
