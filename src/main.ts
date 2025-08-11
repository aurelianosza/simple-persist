import { DataManagerFactory } from "./repository/baseDataManager";
import { JsonDataManager } from "./repository/jsonDataManager";

async function main() {

    const repository = (new DataManagerFactory)
        .type("csv")
        .path(__dirname + "/../database/csv")
        .entityName("users")
        .headers(['id', 'name', 'birthdate'])
        .create();

    const rows = await repository.read([]);

    console.log(rows);
}

main();
