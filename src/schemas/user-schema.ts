export const addUserSchema = {
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
    required: ["userId", "username", "userSurname", "entryTime"],
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
        }
    },
    required: ["userId"],
    additionalProperties: false
}