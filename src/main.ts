import { CsvDataManager } from "./repository/csvDataManager";

async function main() {

    const rows = await (new CsvDataManager(__dirname + '/../database/csv', 'users', ['id', 'name', 'birthdate']))
        .read([{
            field: "id",
            operation: "=",
            value: "Ux56Vz90Wq13Bn7L"
        }]);

    console.log(rows);

}

main();
