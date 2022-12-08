#!/usr/bin/env zx
import {
  DynamoDBClient,
  CreateTableCommand,
  ResourceInUseException,
} from "@aws-sdk/client-dynamodb";

process.env.AWS_ACCESS_KEY_ID = "DUMMYIDEXAMPLE";
process.env.AWS_SECRET_ACCESS_KEY = "DUMMYEXAMPLEKEY";

const templateFile = fs.readFileSync("template.yaml", "utf8");
const parsedDoc = YAML.parseDocument(templateFile);
if (parsedDoc.errors.length > 0) throw parsedDoc.errors[0];
const template = parsedDoc.toJSON();
const ddbTables = Object.values(template.Resources).filter(
  (r) => r.Type === "AWS::DynamoDB::Table",
);

const ddbClient = new DynamoDBClient({
  endpoint: process.env.DDB_ENDPOINT ?? "http://localhost:8000",
});

async function createTable(tableDefinition) {
  try {
    console.log("Creating table with definition");
    console.log(tableDefinition);

    await ddbClient.send(new CreateTableCommand(tableDefinition));
  } catch (err) {
    if (err instanceof ResourceInUseException) {
      console.log(`Table ${tableDefinition.TableName} already exits`);
    } else {
      throw err;
    }
  } finally {
    console.log("");
  }
}

for (const table of ddbTables) {
  await createTable(table.Properties);
}
