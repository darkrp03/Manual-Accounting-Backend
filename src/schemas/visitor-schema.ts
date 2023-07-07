export const addVisitorSchema = {
    type: "object",
    properties: {
        visitorId: {
            type: "string"
        },
        visitorName: {
            type: "string"
        },
        visitorSurname: {
            type: "string"
        },
        visitorEntryTime: {
            type: "string"
        }
    },
    required: ["visitorId", "visitorName", "visitorSurname", "visitorEntryTime"],
    additionalProperties: false
}

export const updateVisitorSchema = {
    type: "object",
    properties: {
        visitorId: {
            type: "string"
        },
        visitorName: {
            type: "string"
        },
        visitorSurname: {
            type: "string"
        }
    },
    required: ["visitorId"],
    additionalProperties: false
}