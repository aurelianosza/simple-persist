import { CsvDataManager } from "./repository/csvDataManager";

async function main() {

    const rows = await (new CsvDataManager(__dirname + '/../database/csv', 'users', ['id', 'name', 'birthdate']))
        .update([{
            field: "id",
            operation: "=",
            value: "Ux56Vz90Wq13Bn7L"
        }], {
            name: "Joao Acelino da Silva"
        });

    console.log(rows);

}

main();
