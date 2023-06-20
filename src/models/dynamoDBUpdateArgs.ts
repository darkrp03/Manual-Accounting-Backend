export class DynamoDBUpdateArgs {
    updateExpression?: string;
    expressionAttributeValues?: {[key: string]: any};

    constructor(updateExpression: string, expressionAttributeValues: {[key: string]: any}) {
        this.updateExpression = updateExpression;
        this.expressionAttributeValues = expressionAttributeValues;
    }
}