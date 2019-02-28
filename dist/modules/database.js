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
                _this.makeModels();
            }).catch(function (e) {
                console.error(e);
                _this.onFail();
            });
        }
        Database.prototype.makeModels = function () {
            this.userModel = this.connection.model("users", new mongoose_1.Schema({
                userID: { type: String, required: true },
                username: { type: String, required: true },
                password: { type: String, required: true },
            }, {
                timestamps: true
            }));
            this.sessionModel = this.connection.model("sessions", new mongoose_1.Schema({
                sessionID: { type: String, required: true },
                user: { type: String, required: true },
            }, {
                timestamps: true
            }));
            this.postModel = this.connection.model("posts", new mongoose_1.Schema({
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
            this.restaurantModel = this.connection.model("restaurants", new mongoose_1.Schema({
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
            //--
            this.restaurantRatingModel = this.connection.model("ratings", new mongoose_1.Schema({
                restaurantRatingID: { type: String, required: true },
                post: { type: String, required: true },
                rating: { type: Number, default: 0 }
            }, {
                timestamps: true
            }));
        };
        return Database;
    }());
    DatabaseMethods.Database = Database;
    var Facilitator = /** @class */ (function () {
        function Facilitator(db) {
            this.document = null;
        }
        Facilitator.prototype.find = function (options) { return null; };
        Facilitator.prototype.create = function () { return null; };
        Facilitator.prototype.addDoc = function (doc) { this.assignData(doc); };
        Facilitator.prototype.assignData = function (doc) {
            var _this = this;
            if (!doc)
                return;
            this.keyList.map(function (k) {
                _this[k] = doc[k];
            });
        };
        return Facilitator;
    }());
    DatabaseMethods.Facilitator = Facilitator;
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User(db, doc) {
            if (doc === void 0) { doc = null; }
            var _this = _super.call(this, db) || this;
            _this.keyList = [
                "userID",
                "username",
                "password",
            ];
            _this.model = db.userModel;
            _this.document = doc;
            _this.addDoc(doc);
            return _this;
        }
        User.prototype.find = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.findOne(options, function (err, doc) {
                    if (err)
                        return reject(err);
                    _this.document = doc;
                    _this.addDoc(doc);
                    resolve(_this);
                });
            });
        };
        User.prototype.create = function () {
            var doc = new this.model({
                userID: this.userID,
                username: this.username,
                password: this.password,
            });
            this.document = doc;
            return doc;
        };
        return User;
    }(Facilitator));
    DatabaseMethods.User = User;
    var Session = /** @class */ (function (_super) {
        __extends(Session, _super);
        function Session(db, doc) {
            if (doc === void 0) { doc = null; }
            var _this = _super.call(this, db) || this;
            _this.keyList = [
                "sessionID",
                "user",
            ];
            _this.model = db.sessionModel;
            _this.document = doc;
            _this.addDoc(doc);
            return _this;
        }
        Session.prototype.find = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.findOne(options, function (err, doc) {
                    if (err)
                        return reject(err);
                    _this.document = doc;
                    _this.addDoc(doc);
                    resolve(_this);
                });
            });
        };
        Session.prototype.create = function () {
            var doc = new this.model({
                sessionID: this.sessionID,
                user: this.user,
            });
            this.document = doc;
            return doc;
        };
        return Session;
    }(Facilitator));
    DatabaseMethods.Session = Session;
    var Post = /** @class */ (function (_super) {
        __extends(Post, _super);
        function Post(db, doc) {
            if (doc === void 0) { doc = null; }
            var _this = _super.call(this, db) || this;
            _this.keyList = [
                "postID",
                "title",
                "content",
                "user",
                "postType",
                "restaurant",
                "upvotes",
                "downvotes",
            ];
            _this.document = doc;
            _this.model = db.postModel;
            _this.title = "";
            _this.upvotes = [];
            _this.downvotes = [];
            _this.addDoc(doc);
            return _this;
        }
        Post.prototype.find = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.findOne(options, function (err, doc) {
                    if (err)
                        return reject(err);
                    _this.document = doc;
                    _this.addDoc(doc);
                    resolve(_this);
                });
            });
        };
        Post.prototype.create = function () {
            var doc = new this.model({
                postID: this.postID,
                title: this.title,
                content: this.content,
                user: this.user,
                postType: this.postType,
                restaurant: this.restaurant,
                upvotes: this.upvotes,
                downvotes: this.downvotes,
            });
            this.document = doc;
            return doc;
        };
        return Post;
    }(Facilitator));
    DatabaseMethods.Post = Post;
    var Restaurant = /** @class */ (function (_super) {
        __extends(Restaurant, _super);
        function Restaurant(db, doc) {
            if (doc === void 0) { doc = null; }
            var _this = _super.call(this, db) || this;
            _this.keyList = [
                "restaurantID",
                "name",
                "description",
                "street",
                "apt",
                "city",
                "state",
                "country",
                "zip",
            ];
            _this.document = doc;
            _this.model = db.restaurantModel;
            _this.description = "";
            _this.apt = "";
            _this.addDoc(doc);
            return _this;
        }
        Restaurant.prototype.find = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.findOne(options, function (err, doc) {
                    if (err)
                        return reject(err);
                    _this.document = doc;
                    _this.addDoc(doc);
                    resolve(_this);
                });
            });
        };
        Restaurant.prototype.create = function () {
            var doc = new this.model({
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
            this.document = doc;
            return doc;
        };
        return Restaurant;
    }(Facilitator));
    DatabaseMethods.Restaurant = Restaurant;
    var RestaurantRating = /** @class */ (function (_super) {
        __extends(RestaurantRating, _super);
        function RestaurantRating(db, doc) {
            if (doc === void 0) { doc = null; }
            var _this = _super.call(this, db) || this;
            _this.keyList = [
                "restaurantRatingID",
                "post",
                "rating",
            ];
            _this.document = doc;
            _this.model = db.restaurantRatingModel;
            _this.addDoc(doc);
            return _this;
        }
        RestaurantRating.prototype.find = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.findOne(options, function (err, doc) {
                    if (err)
                        return reject(err);
                    _this.document = doc;
                    _this.addDoc(doc);
                    resolve(_this);
                });
            });
        };
        RestaurantRating.prototype.create = function () {
            var doc = new this.model({
                restaurantRatingID: this.restaurantRatingID,
                post: this.post,
                rating: this.rating,
            });
            this.document = doc;
            return doc;
        };
        return RestaurantRating;
    }(Facilitator));
    DatabaseMethods.RestaurantRating = RestaurantRating;
})(DatabaseMethods = exports.DatabaseMethods || (exports.DatabaseMethods = {}));
