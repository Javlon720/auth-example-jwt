import argon2 from "argon2"

import { users } from "../../db/auth.users.js";

export const register = async ({ password, email, age, gender, first_name, last_name, is_admin }) => {
    try {
        const normalizedEmail = email.toLowerCase()
        const extensUser = users.has(normalizedEmail)
        if (extensUser) {
            return {
                status: 409,
                message: "email already exist"
            }
        }
        const hashedPassword = await argon2.hash(password)

        users.set(normalizedEmail, {
            age,
            gender,
            is_admin,
            password: hashedPassword,
            fullname: `${first_name} ${last_name}`
        })

        return {
            status: 201,
            message: users.get(normalizedEmail).fullname
        }
    }
    catch (error) {
        return {
            status: 500,
            error: error.message
        }
    }
}

export const me = async ({ accessToken, fastify }) => {
  try {
    if (!accessToken) {
      return {
        status: 401,
        message: 'Access token is required'
      }
    }

    const payload = fastify.jwt.verify(accessToken)
    const user = users.get(payload.email)

    if (!user) {
      return {
        status: 404,
        message: 'User not found'
      }
    }

    return {
      status: 200,
      message: 'Profile loaded',
      data: {
        email: payload.email,
        fullname: user.fullname,
        age: user.age,
        gender: user.gender,
        is_admin: Boolean(user.is_admin)
      }
    }
  } catch (error) {
    return {
      status: 401,
      message: 'Invalid access token'
    }
  }
}

export const login = async ({ password, email, jwt }) => {
  try {
    if (!email || !password) {
      return {
        status: 400,
        message: 'Email and password are required'
      }
    }

    const normalizedEmail = email.toLowerCase()
    const user = users.get(normalizedEmail)

    if (!user) {
      return {
        status: 401,
        message: 'Email not exist or password invalid'
      }
    }

    const checkPassword = await argon2.verify(user.password, password)

    if (!checkPassword) {
      return {
        status: 401,
        message: 'Email not exist or password invalid'
      }
    }

    const accessToken = jwt.sign(
      {
        email: normalizedEmail,
        fullname: user.fullname
      },
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      {
        email: normalizedEmail
      },
      { expiresIn: '7d' }
    )

    return {
      status: 200,
      message: `${user.fullname}`,
      data: {
        accessToken,
        refreshToken
      }
    }
  } catch (error) {
    return {
      status: 500,
      error: error.message
    }
  }
}

export const refresh = async ({ refreshToken, fastify }) => {
  try {
    if (!refreshToken) {
      return {
        status: 400,
        message: 'Refresh token is required'
      }
    }

    const payload = fastify.jwt.verify(refreshToken)
    const user = users.get(payload.email)

    if (!user) {
      return {
        status: 401,
        message: 'Invalid refresh token'
      }
    }

    const accessToken = fastify.jwt.sign(
      { email: payload.email, fullname: user.fullname },
      { expiresIn: '15m' }
    )

    return {
      status: 200,
      message: 'Refresh successful',
      data: {
        accessToken
      }
    }
  } catch (error) {
    return {
      status: 401,
      message: 'Invalid refresh token'
    }
  }
}
