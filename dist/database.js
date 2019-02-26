"use strict";
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
    var User = /** @class */ (function () {
        function User() {
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
        Object.defineProperty(User.prototype, "aModel", {
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
    }());
    DatabaseMethods.User = User;
    var Post = /** @class */ (function () {
        function Post() {
        }
        Post.prototype.make = function () {
            var schema = new mongoose_1.Schema({
                postID: { type: String, required: true },
                title: { type: String, default: "" },
                content: { type: String, required: true },
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
        Object.defineProperty(Post.prototype, "aModel", {
            get: function () {
                return this._model.create({
                    postID: this.postID,
                    title: this.title,
                    content: this.content,
                    user: this.user,
                    postType: this.postType,
                    restaurant: this.restaurant,
                    upvotes: this.upvotes,
                    downvotes: this.downvotes,
                });
            },
            enumerable: true,
            configurable: true
        });
        return Post;
    }());
    DatabaseMethods.Post = Post;
    var Restaurant = /** @class */ (function () {
        function Restaurant() {
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
        Object.defineProperty(Restaurant.prototype, "aModel", {
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
    }());
    DatabaseMethods.Restaurant = Restaurant;
    var PostType = /** @class */ (function () {
        function PostType() {
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
        Object.defineProperty(PostType.prototype, "aModel", {
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
    }());
    DatabaseMethods.PostType = PostType;
    var RestaurantRatings = /** @class */ (function () {
        function RestaurantRatings() {
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
        Object.defineProperty(RestaurantRatings.prototype, "aModel", {
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
    }());
    DatabaseMethods.RestaurantRatings = RestaurantRatings;
})(DatabaseMethods = exports.DatabaseMethods || (exports.DatabaseMethods = {}));
