import { User } from "../models";
import { DynamoDBUpdateArgs } from "../models/updatedExpression";

export function generateExpression(user: User): DynamoDBUpdateArgs {
    let updateExpression: string = "SET ";
    let expressionAttributeValues: { [key: string]: any } = {};

    const keys = Object.keys(user);

    let i = 1;

    keys.forEach(key => {
        //Skips userId key because there is no need to update
        if (key != "userId") {
            const keyValue = user[key];

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