"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path_1 = require("path");
var session_1 = require("./session");
var database_1 = require("./database");
var Routes = /** @class */ (function () {
    // restaurants: Restaurants;
    // posts: Posts;
    function Routes(main) {
        this.app = express();
        this.app.set("views", path_1.join(__dirname, "../views"));
        this.createRoutes();
        this.main = main;
        // this.accounts = new Accounts(main);
        this.sessions = new session_1.Sessions(main);
        // this.restaurants = new Restaurants(main);
        // this.posts = new Posts(main);
    }
    Object.defineProperty(Routes.prototype, "routes", {
        get: function () {
            return this.app;
        },
        enumerable: true,
        configurable: true
    });
    Routes.prototype.createRoutes = function () {
        this.app.get("/", this.indexView.bind(this));
        this.app.get("/restaurants", this.restaurantsView.bind(this));
        this.app.get("/restaurants/:id", this.restaurantView.bind(this));
        this.app.get("/reviews", this.reviewsView.bind(this));
        this.app.get("/reviews/:id", this.reviewView.bind(this));
        this.app.get("/login", this.loginView.bind(this));
        this.app.get("/signup", this.signupView.bind(this));
        // testbench
        this.app.get("/testbench", this.testBenchView.bind(this));
        this.app.get("/test", this.test.bind(this));
    };
    Routes.prototype.indexView = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.render(path_1.join(__dirname, "../views/index.html"));
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
        res.render("testbench-body");
        // res.sendFile(join(__dirname, "../views/testbench.html"));
    };
    Routes.prototype.test = function (req, res, next) {
        if (next === void 0) { next = null; }
        res.sendFile(path_1.join(__dirname, "../views/testbench.html"));
        new database_1.DatabaseMethods.RestaurantRating(this.main.database)
            .joinAll()
            .then(function (d) {
            console.log(d);
        })
            .catch(function (e) { return console.error(e); });
    };
    return Routes;
}());
exports.Routes = Routes;
