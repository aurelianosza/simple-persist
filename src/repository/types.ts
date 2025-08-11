export type FilterOperation = "=" | ">" | "<" | ">=" | "<=" | "!=";

export type Filter = {
    operation : FilterOperation,
    field: string,
    value: string|number
}

export type updatedEntityDetails = {
    rowsAffected : number
}
