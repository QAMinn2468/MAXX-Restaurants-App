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
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User() {
            return _super.call(this) || this;
        }
        User.prototype.make = function () {
            var schema = new mongoose_1.Schema({
                userID: { type: String, required: true },
                username: { type: String, required: true },
                password: { type: String, required: true },
            }, {
                timestamps: true
            });
            this._model = mongoose_1.model("users", schema);
            return this;
        };
        Object.defineProperty(User.prototype, "model", {
            get: function () {
                return this._model.create({
                    userID: this.userID,
                    username: this.username,
                    password: this.password,
                });
            },
            enumerable: true,
            configurable: true
        });
        return User;
    }(Document));
    DatabaseMethods.User = User;
    var Post = /** @class */ (function (_super) {
        __extends(Post, _super);
        function Post() {
            return _super.call(this) || this;
        }
        Post.prototype.make = function () {
            var schema = new mongoose_1.Schema({
                postID: { type: String, required: true },
                user: { type: String, required: true },
                postType: { type: String, required: true },
                restaurant: { type: String, required: true },
                upvotes: { type: [String], default: [] },
                downvotes: { type: [String], default: [] },
            }, {
                timestamps: true
            });
            this._model = mongoose_1.model("posts", schema);
            return this;
        };
        Object.defineProperty(Post.prototype, "model", {
            get: function () {
                return this._model.create({
                    postID: this.postID,
                    user: this.user,
                    postType: this.postType,
                    restaurant: this.restaurant,
                    upvotes: this.upvotes,
                });
            },
            enumerable: true,
            configurable: true
        });
        return Post;
    }(Document));
    DatabaseMethods.Post = Post;
    var Restaurant = /** @class */ (function (_super) {
        __extends(Restaurant, _super);
        function Restaurant() {
            return _super.call(this) || this;
        }
        Restaurant.prototype.make = function () {
            var schema = new mongoose_1.Schema({
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
            });
            this._model = mongoose_1.model("restaurants", schema);
            return this;
        };
        Object.defineProperty(Restaurant.prototype, "model", {
            get: function () {
                return this._model.create({
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
            },
            enumerable: true,
            configurable: true
        });
        return Restaurant;
    }(Document));
    DatabaseMethods.Restaurant = Restaurant;
    var PostType = /** @class */ (function (_super) {
        __extends(PostType, _super);
        function PostType() {
            return _super.call(this) || this;
        }
        PostType.prototype.make = function () {
            var schema = new mongoose_1.Schema({
                postTypeID: { type: Number, required: true },
                typeDescription: { type: String, required: true }
            }, {
                timestamps: true
            });
            this._model = mongoose_1.model("postTypes", schema);
            return this;
        };
        Object.defineProperty(PostType.prototype, "model", {
            get: function () {
                return this._model.create({
                    postTypeID: this.postTypeID,
                    typeDescription: this.typeDescription,
                });
            },
            enumerable: true,
            configurable: true
        });
        return PostType;
    }(Document));
    DatabaseMethods.PostType = PostType;
    var RestaurantRatings = /** @class */ (function (_super) {
        __extends(RestaurantRatings, _super);
        function RestaurantRatings() {
            return _super.call(this) || this;
        }
        RestaurantRatings.prototype.make = function () {
            var schema = new mongoose_1.Schema({
                restaurantRatingID: { type: String, required: true },
                rating: { type: Number, required: true }
            }, {
                timestamps: true
            });
            this._model = mongoose_1.model("ratings", schema);
            return this;
        };
        Object.defineProperty(RestaurantRatings.prototype, "model", {
            get: function () {
                return this._model.create({
                    restaurantRatingID: this.restaurantRatingID,
                    post: this.post,
                    rating: this.rating,
                });
            },
            enumerable: true,
            configurable: true
        });
        return RestaurantRatings;
    }(Document));
    DatabaseMethods.RestaurantRatings = RestaurantRatings;
})(DatabaseMethods = exports.DatabaseMethods || (exports.DatabaseMethods = {}));
