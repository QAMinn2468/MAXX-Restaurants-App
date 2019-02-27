"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var Mongoose = require("mongoose");
var DatabaseMethods;
(function (DatabaseMethods) {
    var Database = /** @class */ (function () {
        function Database(dbUsername, dbPassword, dbPort, dbDatabase) {
            var _this = this;
            var x = mongoose_1.createConnection("mongodb://" + dbUsername + ":" + dbPassword + "@localhost:" + dbPort + "/" + dbDatabase, {
                useNewUrlParser: true
            }).then(function (db) {
                _this.connection = db;
                console.log("DB connection");
                _this.onConnection();
            }).catch(function (e) {
                console.error(e);
                _this.onFail();
            });
        }
        return Database;
    }());
    DatabaseMethods.Database = Database;
    var facilitator = /** @class */ (function () {
        function facilitator() {
            this.document = null;
        }
        facilitator.prototype.find = function (options) { return new Mongoose.DocumentQuery(); };
        facilitator.prototype.create = function () { return null; };
        return facilitator;
    }());
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User() {
            return _super.call(this) || this;
        }
        User.prototype.find = function (options) {
            return User.model.findOne(options);
        };
        User.prototype.create = function () {
            return new User.model({
                userID: this.userID,
                username: this.username,
                password: this.password,
            });
        };
        User.model = mongoose_1.model("users", new mongoose_1.Schema({
            userID: { type: String, required: true },
            username: { type: String, required: true },
            password: { type: String, required: true },
        }, {
            timestamps: true
        }));
        return User;
    }(facilitator));
    DatabaseMethods.User = User;
    var Session = /** @class */ (function (_super) {
        __extends(Session, _super);
        function Session() {
            return _super.call(this) || this;
        }
        Session.prototype.find = function (options) {
            return Session.model.findOne(options);
        };
        Session.prototype.create = function () {
            return new Session.model({
                sessionID: this.sessionID,
                user: this.user,
            });
        };
        Session.model = mongoose_1.model("sessions", new mongoose_1.Schema({
            sessionID: { type: String, required: true },
            user: { type: String, required: true },
        }, {
            timestamps: true
        }));
        return Session;
    }(facilitator));
    DatabaseMethods.Session = Session;
    var Post = /** @class */ (function (_super) {
        __extends(Post, _super);
        function Post() {
            var _this = _super.call(this) || this;
            _this.title = "";
            _this.upvotes = [];
            _this.downvotes = [];
            return _this;
        }
        ;
        Post.prototype.find = function (options) {
            return Post.model.findOne(options);
        };
        Post.prototype.create = function () {
            return new Post.model({
                postID: this.postID,
                title: this.title,
                content: this.content,
                user: this.user,
                postType: this.postType,
                restaurant: this.restaurant,
                upvotes: this.upvotes,
                downvotes: this.downvotes,
            });
        };
        Post.model = mongoose_1.model("posts", new mongoose_1.Schema({
            postID: { type: String, required: true },
            title: { type: String, default: "" },
            content: { type: String, required: true },
            user: { type: String, required: true },
            postType: { type: Number, required: true },
            restaurant: { type: String, required: true },
            upvotes: { type: [String], default: [] },
            downvotes: { type: [String], default: [] },
        }, {
            timestamps: true
        }));
        return Post;
    }(facilitator));
    DatabaseMethods.Post = Post;
    var Restaurant = /** @class */ (function (_super) {
        __extends(Restaurant, _super);
        function Restaurant() {
            var _this = _super.call(this) || this;
            _this.description = "";
            _this.apt = "";
            return _this;
        }
        Restaurant.prototype.find = function (options) {
            return Restaurant.model.findOne(options);
        };
        Restaurant.prototype.create = function () {
            return new Restaurant.model({
                restaurantID: this.restaurantID,
                name: this.name,
                description: this.description,
                street: this.street,
                apt: this.apt,
                city: this.city,
                state: this.state,
                country: this.country,
                zip: this.zip,
            });
        };
        Restaurant.model = mongoose_1.model("restaurants", new mongoose_1.Schema({
            restaurantID: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String, default: "" },
            street: { type: String, required: true },
            apt: { type: String, default: "" },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            zip: { type: String, required: true },
        }, {
            timestamps: true
        }));
        return Restaurant;
    }(facilitator));
    DatabaseMethods.Restaurant = Restaurant;
    var RestaurantRatings = /** @class */ (function (_super) {
        __extends(RestaurantRatings, _super);
        function RestaurantRatings() {
            return _super.call(this) || this;
        }
        RestaurantRatings.prototype.find = function (options) {
            return RestaurantRatings.model.findOne(options);
        };
        RestaurantRatings.prototype.create = function () {
            return new RestaurantRatings.model({
                restaurantRatingID: this.restaurantRatingID,
                post: this.post,
                rating: this.rating,
            });
        };
        RestaurantRatings.model = mongoose_1.model("ratings", new mongoose_1.Schema({
            restaurantRatingID: { type: String, required: true },
            post: { type: String, required: true },
            rating: { type: Number, default: 0 }
        }, {
            timestamps: true
        }));
        return RestaurantRatings;
    }(facilitator));
    DatabaseMethods.RestaurantRatings = RestaurantRatings;
})(DatabaseMethods = exports.DatabaseMethods || (exports.DatabaseMethods = {}));
