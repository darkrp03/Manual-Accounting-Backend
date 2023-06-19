export const addUserSchema = {
    type: "object",
    properties: {
        name: {
            type: "string"
        },
        surname: {
            type: "string"
        },
        entryTime: {
            type: "string"
        }
    },
    required: ["name", "surname", "entryTime"],
    additionalProperties: false
}

export const updateUserSchema = {
    type: "object",
    properties: {
        userId: {
            type: "string"
        },
        name: {
            type: "string"
        },
        surname: {
            type: "string"
        },
        entryTime: {
            type: "string"
        },
        additionalProperties: false
    }
}