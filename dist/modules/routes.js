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
        var _this = this;
        if (next === void 0) { next = null; }
        var comp = {};
        console.log("cookies", req.cookies);
        new database_1.DatabaseMethods.Session(this.main.database)
            .findOne({
            sessionPK: req.cookies.timeSession
        })
            .then(function (sessionDoc) { return new database_1.DatabaseMethods.User(_this.main.database).findOne({
            userPK: sessionDoc.userFK
        }); })
            .then(function (userDoc) { return comp.userDoc = userDoc; })
            .then(function () { return new database_1.DatabaseMethods.Restaurant(_this.main.database).find(); })
            .then(function (restaurantDocs) { return comp.restaurantDocs = restaurantDocs; })
            .then(function () { return new database_1.DatabaseMethods.Post(_this.main.database).find(); })
            .then(function (postDocs) { return comp.postDocs = postDocs; })
            .then(function () {
            // console.log("got docs", Object.keys(comp));
            console.log("got docs", (comp.userDoc));
            res.render("testbench-home", {
                user: comp.userDoc,
                restaurants: comp.restaurantDocs,
                posts: comp.postDocs,
            });
        })
            .catch(function (e) { return console.error(e); });
        // res.sendFile(join(__dirname, "../views/testbench.html"));
    };
    Routes.prototype.test = function (req, res, next) {
        if (next === void 0) { next = null; }
        new database_1.DatabaseMethods.RestaurantRating(this.main.database)
            .joinAll()
            .then(function (d) {
            console.log(d);
            res.redirect("/testbench");
        })
            .catch(function (e) {
            console.error(e);
            res.redirect("/testbench");
        });
    };
    return Routes;
}());
exports.Routes = Routes;
