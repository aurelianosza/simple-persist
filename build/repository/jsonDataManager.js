"use strict";
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDataManager = void 0;
const fs_1 = __importDefault(require("fs"));
const canEvaluateLines_1 = require("../decorators/canEvaluateLines");
const helpers_1 = require("../tools/helpers");
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
let JsonDataManager = (() => {
    let _classDecorators = [canEvaluateLines_1.CanEvaluateLines];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var JsonDataManager = _classThis = class {
        constructor(path, entityName, fields) {
            this.keyBy = "id";
            this.path = path;
            this.entityName = entityName;
            this.fields = fields;
        }
        getFullyEntityName() {
            return `${this.path}/${this.entityName}.json`;
        }
        getFullSwapEntityName() {
            return `${this.path}/swap/${this.entityName}.json`;
        }
        loadJsonFullContent() {
            const fullEntityFileName = this.getFullyEntityName();
            if (!fs_1.default.existsSync(fullEntityFileName)) {
                console.warn(`Entity ${this.entityName} doesn\`t exists`);
                this.saveUsingSwap({});
                return {};
            }
            return JSON.parse(fs_1.default.readFileSync(fullEntityFileName, "utf-8"));
        }
        generateRandomModelId() {
            return (0, helpers_1.generateRandomId)();
        }
        createSwapFolder(filePath) {
            const directory = path_1.default.dirname(filePath);
            fs_1.default.mkdirSync(directory, { recursive: true });
        }
        saveUsingSwap(jsonContentToSave) {
            const originalFileName = this.getFullyEntityName();
            const swapFileName = this.getFullSwapEntityName();
            this.createSwapFolder(swapFileName);
            fs_1.default.writeFileSync(swapFileName, JSON.stringify(jsonContentToSave, null, 2), "utf-8");
            fs_1.default.copyFileSync(swapFileName, originalFileName);
            fs_1.default.unlinkSync(swapFileName);
        }
        create(data) {
            const jsonFullContent = this.loadJsonFullContent();
            if (!(0, lodash_1.get)(data, this.keyBy, false)) {
                (0, lodash_1.set)(data, this.keyBy, this.generateRandomModelId());
            }
            (0, lodash_1.set)(jsonFullContent, (0, lodash_1.get)(data, this.keyBy), data);
            this.saveUsingSwap(jsonFullContent);
            return Promise.resolve(data);
        }
        read(filters, limit = 50) {
            const jsonFullContent = this.loadJsonFullContent();
            return Promise.resolve(Object.values(jsonFullContent)
                .filter((line) => this.evaluateLine(filters, line))
                .slice(0, limit));
        }
        update(filters, data) {
            const jsonFullContent = this.loadJsonFullContent();
            const dataToReturn = {
                rowsAffected: 0
            };
            const updatedFullContent = Object.entries(jsonFullContent)
                .reduce((accumulator, [key, row]) => {
                if (this.evaluateLine(filters, row)) {
                    dataToReturn['rowsAffected']++;
                    accumulator[key] = Object.assign(Object.assign({}, row), data);
                }
                else {
                    accumulator[key] = row;
                }
                return accumulator;
            }, {});
            this.saveUsingSwap(updatedFullContent);
            return Promise.resolve(dataToReturn);
        }
        delete(filters) {
            const jsonFullContent = this.loadJsonFullContent();
            const [registersToMaintain, deletedItems] = Object.entries(jsonFullContent)
                .reduce(([maintain, deleted], [key, row]) => {
                if (!this.evaluateLine(filters, row)) {
                    (0, lodash_1.set)(maintain, key, row);
                }
                else {
                    (0, lodash_1.set)(deleted, key, row);
                }
                return [
                    maintain, deleted
                ];
            }, [{}, {}]);
            this.saveUsingSwap(registersToMaintain);
            return Promise.resolve(Object.values(deletedItems));
        }
        find(key) {
            const jsonFullContent = this.loadJsonFullContent();
            return Promise.resolve((0, lodash_1.get)(jsonFullContent, key, null));
        }
    };
    __setFunctionName(_classThis, "JsonDataManager");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JsonDataManager = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JsonDataManager = _classThis;
})();
exports.JsonDataManager = JsonDataManager;
