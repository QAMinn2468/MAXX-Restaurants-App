"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var accounts_1 = require("./accounts");
var API = /** @class */ (function () {
    function API(main) {
        this.app = express();
        this.createRoutes();
        this.main = main;
        this.accounts = new accounts_1.Accounts(main);
    }
    Object.defineProperty(API.prototype, "routes", {
        get: function () {
            return this.app;
        },
        enumerable: true,
        configurable: true
    });
    API.prototype.createRoutes = function () {
        this.app.post("/login", this.loginAPI);
        this.app.post("/signup", this.signupAPI);
    };
    API.prototype.loginAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/api/login");
        console.log(req.body);
        var doc = accounts_1.Accounts.verifyAccount(req.body.username, req.body.password);
        if (doc) {
            console.log("doc found");
        }
        else {
            console.log("doc not found");
        }
    };
    API.prototype.signupAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/api/signup");
    };
    return API;
}());
exports.API = API;
