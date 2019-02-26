"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var API = /** @class */ (function () {
    function API(main) {
        this.app = express();
        this.createRoutes();
        this.main = main;
    }
    Object.defineProperty(API.prototype, "routes", {
        get: function () {
            return this.app;
        },
        enumerable: true,
        configurable: true
    });
    API.prototype.createRoutes = function () {
        this.app.get("/", function (req, res) {
            res.send("ESKETIT");
        });
    };
    return API;
}());
exports.API = API;
