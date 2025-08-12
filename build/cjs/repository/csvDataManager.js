"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvDataManager = void 0;
const csv = __importStar(require("fast-csv"));
const fs_1 = __importDefault(require("fs"));
const helpers_1 = require("../tools/helpers");
const canEvaluateLines_1 = require("../decorators/canEvaluateLines");
const lodash_1 = require("lodash");
let CsvDataManager = (() => {
    let _classDecorators = [canEvaluateLines_1.CanEvaluateLines];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CsvDataManager = _classThis = class {
        constructor(path, entityName, headers) {
            this.delimiter = "|";
            this.keyBy = "id";
            this.path = path;
            this.entityName = entityName;
            this.headers = headers;
        }
        getFullyEntityName() {
            return `${this.path}/${this.entityName}.csv`;
        }
        getFullSwapEntityName() {
            return `${this.path}/swap/${this.entityName}.csv`;
        }
        getFileWriteStream() {
            return fs_1.default.createWriteStream(this.getFullyEntityName(), {
                flags: "a"
            });
        }
        getSwapWriteStream() {
            return fs_1.default.createWriteStream(this.getFullSwapEntityName(), {
                flags: "a"
            });
        }
        getFileReadStream() {
            return fs_1.default.createReadStream(this.getFullyEntityName());
        }
        getCsvWriteStream() {
            const csvWriteStream = csv.format({
                headers: false,
                quote: true,
                delimiter: this.delimiter
            });
            csvWriteStream.pipe(this.getFileWriteStream())
                .on('close', () => {
                this.getFileWriteStream().write("\n");
            });
            return csvWriteStream;
        }
        getCsvSwapWriteStream() {
            const csvWriteStream = csv.format({
                headers: false,
                quote: true,
                delimiter: this.delimiter
            });
            csvWriteStream.pipe(this.getSwapWriteStream())
                .on('close', () => {
                this.getSwapWriteStream().write("\n");
            });
            return csvWriteStream;
        }
        getCsvReadStream() {
            return csv.parse({
                headers: true,
                quote: "\"",
                delimiter: this.delimiter
            });
        }
        create(data) {
            const csvWriteStream = this.getCsvWriteStream();
            if (!(0, lodash_1.get)(data, this.keyBy)) {
                (0, lodash_1.set)(data, this.keyBy, (0, helpers_1.generateRandomId)());
            }
            const ordered = (0, helpers_1.orderObjectByHeaders)(data, this.headers);
            csvWriteStream.write(ordered);
            csvWriteStream.end();
            return Promise.resolve(data);
        }
        read(filters, limit = 50) {
            return new Promise((resolve, reject) => {
                const rowsToReturn = [];
                const fileStream = this.getFileReadStream()
                    .pipe(this.getCsvReadStream())
                    .on("data", (row) => {
                    if (rowsToReturn.length >= limit) {
                        fileStream.destroy();
                        resolve(rowsToReturn);
                    }
                    if (this.evaluateLine(filters, row)) {
                        rowsToReturn.push(row);
                    }
                })
                    .on("end", () => resolve(rowsToReturn))
                    .on("error", (err) => {
                    reject(err);
                });
            });
        }
        update(filters, data) {
            const dataToReturn = {
                rowsAffected: 0
            };
            const mainFileStream = this.getFileReadStream()
                .pipe(this.getCsvReadStream());
            const swapFileWriteStream = this.getCsvSwapWriteStream();
            return new Promise((resolve, _reject) => {
                mainFileStream
                    .on('headers', (headers) => {
                    swapFileWriteStream.write(headers);
                })
                    .on("data", (row) => {
                    if (this.evaluateLine(filters, row)) {
                        const newRow = (0, helpers_1.orderObjectByHeaders)(Object.assign(Object.assign({}, row), data), this.headers);
                        dataToReturn['rowsAffected']++;
                        swapFileWriteStream.write(newRow);
                        return;
                    }
                    swapFileWriteStream.write(row);
                })
                    .on("end", () => {
                    swapFileWriteStream.end();
                })
                    .on("finish", () => {
                    fs_1.default.rmSync(this.getFullyEntityName());
                    fs_1.default.createReadStream(this.getFullSwapEntityName())
                        .pipe(this.getFileWriteStream())
                        .on("finish", () => {
                        fs_1.default.rmSync(this.getFullSwapEntityName());
                        resolve(dataToReturn);
                    });
                });
            });
        }
        delete(filters) {
            const rowsToReturn = [];
            const mainFileStream = this.getFileReadStream()
                .pipe(this.getCsvReadStream());
            const swapFileReadStream = fs_1.default.createWriteStream(this.getFullSwapEntityName());
            const swapFileCsvEntity = csv.format({
                headers: true,
            });
            swapFileCsvEntity.pipe(swapFileReadStream);
            return new Promise((resolve, _reject) => {
                mainFileStream
                    .on('headers', (headers) => {
                    swapFileCsvEntity.write(headers);
                })
                    .on("data", (row) => {
                    if (this.evaluateLine(filters, row)) {
                        rowsToReturn.push(row);
                        return;
                    }
                    swapFileCsvEntity.write(row);
                })
                    .on("end", () => {
                    swapFileCsvEntity.end();
                })
                    .on("finish", () => {
                    fs_1.default.rmSync(this.getFullyEntityName());
                    fs_1.default.createReadStream(this.getFullSwapEntityName())
                        .pipe(this.getFileWriteStream())
                        .on("finish", () => {
                        fs_1.default.rmSync(this.getFullSwapEntityName());
                        resolve(rowsToReturn);
                    });
                });
            });
        }
        find(key) {
            return new Promise((resolve, reject) => {
                const fileStream = this.getFileReadStream()
                    .pipe(this.getCsvReadStream())
                    .on("data", (row) => {
                    if ((0, lodash_1.get)(row, this.keyBy, null) == key) {
                        fileStream.destroy();
                        resolve(row);
                    }
                })
                    .on("end", () => {
                    fileStream.destroy();
                    resolve(null);
                })
                    .on("error", (err) => {
                    reject(err);
                });
            });
        }
    };
    __setFunctionName(_classThis, "CsvDataManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CsvDataManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CsvDataManager = _classThis;
})();
exports.CsvDataManager = CsvDataManager;
