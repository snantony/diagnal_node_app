"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controller_1 = require("../controller/controller");
var routes = express_1.Router();
routes.get("/:pageNo", controller_1.fetchContents);
exports.default = routes;
