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
        this.app.post("/login", this.loginAPI.bind(this));
        this.app.post("/signup", this.signupAPI.bind(this));
        this.app.post("/add-restaurant", this.addRestaurantAPI.bind(this));
    };
    API.prototype.loginAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        var docPromise = this.accounts.authenticateAccount(req.body.username, req.body.password);
        docPromise.then(function (user) {
            if (user) {
                res.send("ESKETIT/api/login<br>" + JSON.stringify(user));
                console.log("doc found");
            }
            else {
                res.send("ESKETIT/api/login<br>No Doc");
                console.log("doc not found");
            }
        }).catch(function (e) {
            console.error(e);
            res.send("ESKETIT/api/login<br>Big Error");
        });
    };
    API.prototype.signupAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        this.accounts.createAccount(req.body.username, req.body.password)
            .then(function (doc) {
            res.send("ESKETIT/api/signup<br>" + JSON.stringify(doc));
        }).catch(function (e) {
            res.send("ESKETIT/api/signup<br>Account Exists");
            console.error(e);
        });
    };
    API.prototype.addRestaurantAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/api/add-restaurant");
    };
    return API;
}());
exports.API = API;
