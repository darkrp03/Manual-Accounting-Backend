import { DynamoDBUpdateArgs, Visitor } from "../models";

export default function getVisitorUpdateExpression(index: number, visitor: Visitor): DynamoDBUpdateArgs {
    let updateExpression: string = "SET ";
    let expressionAttributeValues: { [key: string]: any } = {};

    const keys = Object.keys(visitor);

    let i = 1;

    keys.forEach(key => {
        //Skips visitorId key because there is no need to update
        if (key != "visitorId") {
            const keyValue = visitor[key];

            if (keyValue) {
                //Example string: SET visitors[0].username = :value1
                updateExpression += `visitors[${index}].${key} = :value${i},`;

                //Example string: { :value1: "Andrew" }
                expressionAttributeValues[":value" + i] = keyValue
            }

            i++;
        }
    });

    updateExpression = updateExpression.slice(0, -1);

    return new DynamoDBUpdateArgs(updateExpression, expressionAttributeValues);
}