export const schema = {
    body: {
        type: 'object',
        additionalProperties: false,
        required: ["password", "email"],
        properties: {
            email: { type: "string", format: 'email', maxLength: 255, minLength: 6 },
            password: { type: "string", maxLength: 255, minLength: 6 },
        }
    }
}

