import { JsonDataManager } from "./repository/jsonDataManager";

async function main() {

    const rows = await (new JsonDataManager(__dirname + '/../database/json', 'users', ['id', 'name', 'birthdate']))
        .update([{
            field: "id",
            operation: "=",
            value: "Z9Y8X7W6V5U4T3S2"
        }], {
            name: "Joao da Silva Vasco da Gema"
        });

    console.log(rows);

}

main();
