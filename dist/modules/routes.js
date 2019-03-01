"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path_1 = require("path");
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
        this.app.get("/", this.indexView);
        this.app.get("/restaurants", this.restaurantsView);
        this.app.get("/restaurants/:id", this.restaurantView);
        this.app.get("/reviews", this.reviewsView);
        this.app.get("/reviews/:id", this.reviewView);
        this.app.get("/login", this.loginView);
        this.app.get("/signup", this.signupView);
        // testbench
        this.app.get("/testbench", this.testBenchView);
    };
    Routes.prototype.indexView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.sendFile(path_1.join(__dirname, "../views/index.html"));
    };
    Routes.prototype.restaurantsView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/restaurants");
    };
    Routes.prototype.restaurantView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/restaurants/" + req.params.id);
    };
    Routes.prototype.reviewsView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/reviews");
    };
    Routes.prototype.reviewView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/reviews/" + req.params.id);
    };
    Routes.prototype.loginView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/login");
    };
    Routes.prototype.signupView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/signup");
    };
    // testbench
    Routes.prototype.testBenchView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.sendFile(path_1.join(__dirname, "../views/testbench.html"));
    };
    return Routes;
}());
exports.Routes = Routes;
