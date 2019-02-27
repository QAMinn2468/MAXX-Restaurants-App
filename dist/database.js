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
        User.prototype.find = function (options) {
            return User.model.findOne(options);
        };
        User.prototype.create = function () {
            return User.model.create({
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
    }());
    DatabaseMethods.User = User;
    var Post = /** @class */ (function () {
        function Post() {
            this.title = "";
            this.upvotes = [];
            this.downvotes = [];
        }
        ;
        Post.prototype.find = function (options) {
            return Post.model.findOne(options);
        };
        Post.prototype.create = function () {
            return Post.model.create({
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
    }());
    DatabaseMethods.Post = Post;
    var Restaurant = /** @class */ (function () {
        function Restaurant() {
            this.description = "";
            this.apt = "";
        }
        Restaurant.prototype.find = function (options) {
            return Restaurant.model.findOne(options);
        };
        Restaurant.prototype.create = function () {
            return Restaurant.model.create({
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
    }());
    DatabaseMethods.Restaurant = Restaurant;
    var RestaurantRatings = /** @class */ (function () {
        function RestaurantRatings() {
        }
        RestaurantRatings.prototype.find = function (options) {
            return RestaurantRatings.model.findOne(options);
        };
        RestaurantRatings.prototype.create = function () {
            return RestaurantRatings.model.create({
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
    }());
    DatabaseMethods.RestaurantRatings = RestaurantRatings;
})(DatabaseMethods = exports.DatabaseMethods || (exports.DatabaseMethods = {}));
