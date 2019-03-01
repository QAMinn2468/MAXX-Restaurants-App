"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var main_1 = require("../main");
var accounts_1 = require("./accounts");
var session_1 = require("./session");
var restaurants_1 = require("./restaurants");
var posts_1 = require("./posts");
var API = /** @class */ (function () {
    function API(main) {
        this.app = express();
        this.createRoutes();
        this.main = main;
        this.accounts = new accounts_1.Accounts(main);
        this.sessions = new session_1.Sessions(main);
        this.restaurants = new restaurants_1.Restaurants(main);
        this.posts = new posts_1.Posts(main);
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
        this.app.post("/add-review", this.addReviewAPI.bind(this));
        this.app.post("/add-comment", this.addCommentAPI.bind(this));
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
                    var response = new main_1.Results(true, { user: user, session: session }, null);
                    res.send("ESKETIT/api/login<br>Logged In<br><br><pre>" + JSON.stringify(response) + "</pre>");
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
            .then(function (user) {
            if (user.hasDoc) {
                var response = new main_1.Results(true, user, null);
                res.send("ESKETIT/api/signup<br>Signed Up<br><br><pre>" + JSON.stringify(response) + "</pre>");
            }
            else {
                // const response = new Results(false, user, "Could not create account");
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
                console.log("Restaurant added");
                var response = new main_1.Results(true, rest, null);
                res.send("ESKETIT/api/add-restaurant<br>Restaurant added<br><br>" + JSON.stringify(response));
            }
            else {
                var response = new main_1.Results(false, rest, "Restaurant not added");
                res.send("ESKETIT/api/add-restaurant<br>" + JSON.stringify(response));
            }
        })
            .catch(function (e) {
            res.send("ESKETIT/api/add-restaurant<br>Big Error");
            console.error(e);
        });
    };
    API.prototype.addReviewAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        this.posts
            .createReview(req.body)
            .then(function (rest) {
            if (rest.hasDoc) {
                console.log("Review added");
                var response = new main_1.Results(true, rest, null);
                res.send("ESKETIT/api/add-review<br>Review added<br><br>" + JSON.stringify(response));
            }
            else {
                var response = new main_1.Results(false, rest, "Review not added");
                res.send("ESKETIT/api/add-review<br>" + JSON.stringify(response));
            }
        })
            .catch(function (e) {
            res.send("ESKETIT/api/add-review<br>Big Error");
            console.error(e);
        });
    };
    API.prototype.addCommentAPI = function (req, res, next) {
        if (next === void 0) { next = null; }
        this.posts
            .createComment(req.body)
            .then(function (rest) {
            if (rest.hasDoc) {
                console.log("Comment added");
                var response = new main_1.Results(true, rest, null);
                res.send("ESKETIT/api/add-comment<br>Comment added<br><br>" + JSON.stringify(response));
            }
            else {
                var response = new main_1.Results(false, rest, "Comment not added");
                res.send("ESKETIT/api/add-comment<br>" + JSON.stringify(response));
            }
        })
            .catch(function (e) {
            res.send("ESKETIT/api/add-comment<br>Big Error");
            console.error(e);
        });
    };
    return API;
}());
exports.API = API;
