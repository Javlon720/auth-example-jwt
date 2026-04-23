export const schema = {
    body: {
        type: 'object',
        additionalProperties: false,
        required: ["refreshToken",],
        properties: {
            refreshToken: { type: "string", maxLength: 100, minLength: 10 },
        }
    }
}

