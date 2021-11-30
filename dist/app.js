"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var helmet_1 = __importDefault(require("helmet"));
var compression_1 = __importDefault(require("compression"));
var routes_1 = __importDefault(require("./routes/routes"));
var path_2 = __importDefault(require("./utils/path"));
var app = express_1.default();
app.use(helmet_1.default());
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use("/images", express_1.default.static(path_1.default.join(path_2.default, "data", "images")));
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use("/contents", routes_1.default);
app.use(function (req, res, next) {
    res.status(404).json({ message: "page not found" });
});
app.use(function (error, req, res, next) {
    res.status(500).json({ message: error });
});
app.listen(process.env.PORT || 8080);
