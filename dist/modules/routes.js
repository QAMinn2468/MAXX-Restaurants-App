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
        this.app.get("/", this.index);
        this.app.get("/restaurants", this.restaurants);
        this.app.get("/restaurants/:id", this.restaurant);
        this.app.get("/reviews", this.reviews);
        this.app.get("/reviews/:id", this.review);
    };
    Routes.prototype.index = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT");
    };
    Routes.prototype.restaurants = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/restaurants");
    };
    Routes.prototype.restaurant = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/restaurants/" + req.params.id);
    };
    Routes.prototype.reviews = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/reviews");
    };
    Routes.prototype.review = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.send("ESKETIT/reviews/" + req.params.id);
    };
    return Routes;
}());
exports.Routes = Routes;
