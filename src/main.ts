import { JsonDataManager } from "./repository/jsonDataManager";

async function main() {

    const rows = await (new JsonDataManager(__dirname + '/../database/json', 'users', ['id', 'name', 'birthdate']))
        .delete([{
            field: "id",
            operation: "=",
            value: "L0M9N8O7P6Q5R4S3"
        }]);

    console.log(rows);

}

main();
