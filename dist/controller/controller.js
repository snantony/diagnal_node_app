"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchContents = void 0;
var promises_1 = __importDefault(require("fs/promises"));
var path_1 = __importDefault(require("path"));
var path_2 = __importDefault(require("../utils/path"));
var sortFiles = function (filesArray, query) {
    var fileValues = [];
    var totalCount = 0;
    filesArray.forEach(function (file, index) {
        if (query) {
            var arrayCopy = __spreadArray([], file.page["content-items"].content);
            file.page["content-items"].content = arrayCopy.filter(function (item) {
                return item.name
                    .toLocaleLowerCase()
                    .startsWith(query.toLocaleLowerCase());
            });
        }
        fileValues[index] = {
            totalDataFetched: file.page["content-items"].content.length.toString(),
            pagename: "page " + (index + 1),
            fileData: file,
        };
        totalCount += file.page["content-items"].content.length;
    });
    return {
        fileValues: fileValues,
        totalCount: totalCount,
    };
};
var fetchFile = function (path) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promises_1.default.readFile(path, "utf8")];
                case 1:
                    data = _a.sent();
                    resolve(JSON.parse(data));
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    reject(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
var getFiles = function (fileNo) {
    if (fileNo === void 0) { fileNo = 0; }
    var promises = [];
    for (var index = 0; index < fileNo; index++) {
        var filePath = path_1.default.join(path_2.default, "data", "API", "CONTENTLISTINGPAGE-PAGE" + (index + 1) + ".json");
        promises.push(fetchFile(filePath));
    }
    return Promise.all(promises);
};
var fetchContents = function (req, res, next) {
    var pageNo = req.params.pageNo ? +req.params.pageNo : 0;
    var q = req.query.q;
    if (!q || typeof q !== "string") {
        q = "";
    }
    getFiles(3).then(function (result) {
        var _a = sortFiles(result, "" + q), fileValues = _a.fileValues, totalCount = _a.totalCount;
        res
            .status(200)
            .json({ message: { pageNo: pageNo, q: q, data: __assign({ totalCount: totalCount }, fileValues[pageNo - 1]) } });
    });
};
exports.fetchContents = fetchContents;
