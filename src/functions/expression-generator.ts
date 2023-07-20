import { DynamoDBUpdateArgs, Visitor } from "../models";

export default function generateExpression(visitor: Visitor): DynamoDBUpdateArgs {
    let updateExpression: string = "SET ";
    let expressionAttributeValues: { [key: string]: any } = {};

    const keys = Object.keys(visitor);

    let i = 1;

    keys.forEach(key => {
        //Skips visitorId key because there is no need to update
        if (key != "visitorId") {
            const keyValue = visitor[key];

            if (keyValue) {
                //Example string: SET username = :value1
                updateExpression += `${key} = :value${i},`;

                //Example string: { :value1: { S: "Andrew" } }
                expressionAttributeValues[":value" + i] = {
                    S: keyValue
                }
            }

            i++;
        }
    });

    updateExpression = updateExpression.slice(0, -1);

    return new DynamoDBUpdateArgs(updateExpression, expressionAttributeValues);
}