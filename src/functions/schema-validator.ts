import Ajv from "ajv";

export default function validateSchema(body: object, schema: object) {
    const ajv = new Ajv();
    
    return ajv.validate(schema, body);
}