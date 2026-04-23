export const schema = {
    body: {
        type: 'object',
        additionalProperties: false,
        required: ["password", "email", "age", "first_name", "last_name"],
        properties: {
            first_name: { type: 'string', minLength: 1, maxLength: 100 },
            last_name: { type: 'string', minLength: 1, maxLength: 100 },
            email: { type: "string", format: 'email', minLength: 6, maxLength: 255 },
            password: { type: "string", maxLength: 255, minLength: 6 },
            is_admin: { type: 'boolean', default: false },
            age: { type: 'integer', minimum: 14, maximum: 135 },
            gender: { type: 'string' , enum:['male' ,"female"]}
        }
    }
}


