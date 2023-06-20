export const addUserSchema = {
    type: "object",
    properties: {
        username: {
            type: "string"
        },
        userSurname: {
            type: "string"
        },
        entryTime: {
            type: "string"
        }
    },
    required: ["username", "userSurname", "entryTime"],
    additionalProperties: false
}

export const updateUserSchema = {
    type: "object",
    properties: {
        userId: {
            type: "string"
        },
        username: {
            type: "string"
        },
        userSurname: {
            type: "string"
        },
        entryTime: {
            type: "string"
        }
    },
    required: ["userId"],
    additionalProperties: false
}