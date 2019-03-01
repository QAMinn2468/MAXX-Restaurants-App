"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var accounts_1 = require("./accounts");
var session_1 = require("./session");
var restaurants_1 = require("./restaurants");
var API = /** @class */ (function () {
    function API(main) {
        this.app = express();
        this.createRoutes();
        this.main = main;
        this.accounts = new accounts_1.Accounts(main);
        this.sessions = new session_1.Sessions(main);
        this.restaurants = new restaurants_1.Restaurants(main);
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
        var _this = this;
        if (next === void 0) { next = null; }
        var docPromise = this.accounts.authenticateAccount(req.body);
        docPromise.then(function (user) {
            if (user.hasDoc) {
                _this.sessions.newSession(user.userPK)
                    .then(function (session) {
                    res.cookie("timeSession", session.sessionPK, {
                        expires: false,
                    });
                    res.send("ESKETIT/api/login<br>Logged In<br><br>" + JSON.stringify(user) + "<br>" + JSON.stringify(session));
                    console.log("login successful");
                })
                    .catch(function (e) {
                    console.log("login not successful", e);
                    res.send("ESKETIT/api/login<br>Big Error");
                });
            }
            else {
                res.send("ESKETIT/api/login<br>Could not login");
                console.log("login not successful. No user doc");
            }
        }).catch(function (e) {
            console.log("login not successful", e);
            res.send("ESKETIT/api/login<br>Big Error");
        });
    };
    API.prototype.signupAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        this.accounts.createAccount(req.body)
            .then(function (doc) {
            if (doc.hasDoc) {
                res.send("ESKETIT/api/signup<br>Signed Up<br><br>" + JSON.stringify(doc));
            }
            else {
                res.send("ESKETIT/api/signup<br>Could not create account");
            }
        }).catch(function (e) {
            res.send("ESKETIT/api/signup<br>Big Error");
            console.error(e);
        });
    };
    API.prototype.addRestaurantAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        this.restaurants
            .createRestaurant(req.body)
            .then(function (rest) {
            if (rest.hasDoc) {
                res.send("ESKETIT/api/add-restaurant<br>Restaurant added<br><br>" + JSON.stringify(rest));
            }
            else {
                res.send("ESKETIT/api/add-restaurant<br>Restaurant not added");
            }
        })
            .catch(function (e) {
            res.send("ESKETIT/api/add-restaurant<br>Big Error");
            console.error(e);
        });
    };
    return API;
}());
exports.API = API;
