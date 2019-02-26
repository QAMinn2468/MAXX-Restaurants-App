"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Routes = /** @class */ (function () {
    function Routes(main) {
        this.app = express();
        this.createRoutes();
        this.main = main;
    }
    Object.defineProperty(Routes.prototype, "routes", {
        get: function () {
            return this.app;
        },
        enumerable: true,
        configurable: true
    });
    Routes.prototype.createRoutes = function () {
        this.app.get("/", function (req, res) {
            res.send("ESKETIT");
        });
    };
    return Routes;
}());
exports.Routes = Routes;
