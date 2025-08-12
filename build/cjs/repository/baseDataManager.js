"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataManagerFactory = void 0;
const csvDataManager_1 = require("./csvDataManager");
const jsonDataManager_1 = require("./jsonDataManager");
class DataManagerFactory {
    constructor() {
        this.repositories = {
            "csv": csvDataManager_1.CsvDataManager,
            "json": jsonDataManager_1.JsonDataManager
        };
    }
    type(requestedType) {
        this.requestedType = requestedType;
        return this;
    }
    path(requestedPath) {
        this.requestedPath = requestedPath;
        return this;
    }
    entityName(requestedEntityName) {
        this.requestedEntityName = requestedEntityName;
        return this;
    }
    headers(requestedHeaders) {
        this.requestedHeaders = requestedHeaders;
        return this;
    }
    create() {
        if (!this.requestedType || !(this.requestedType in this.repositories)) {
            throw new Error("Type of repository invalid or not defined.");
        }
        if (!this.requestedPath) {
            throw new Error("Path of repository dont defined.");
        }
        if (!this.requestedEntityName) {
            throw new Error("Entity name dont defined.");
        }
        return Reflect.construct(this.repositories[this.requestedType], [
            this.requestedPath,
            this.requestedEntityName,
            this.requestedHeaders
        ]);
    }
}
exports.DataManagerFactory = DataManagerFactory;
