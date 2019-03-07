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
                userPK: { type: String, required: true },
                username: { type: String, required: true },
                password: { type: String, required: true },
            }, {
                timestamps: true
            }));
            this.sessionModel = this.connection.model("sessions", new mongoose_1.Schema({
                sessionPK: { type: String, required: true },
                expirationDate: { type: Date, required: true },
                userFK: { type: String, required: true, ref: "users" },
            }, {
                timestamps: true
            }));
            this.postModel = this.connection.model("posts", new mongoose_1.Schema({
                postPK: { type: String, required: true },
                postFK: { type: String, default: "" },
                title: { type: String, default: "" },
                content: { type: String, required: true },
                userFK: { type: String, required: true },
                postType: { type: Number, required: true },
                restaurantFK: { type: String, default: "" },
                upvoteFKs: { type: [String], default: [] },
                downvoteFKs: { type: [String], default: [] },
            }, {
                timestamps: true
            }));
            this.restaurantModel = this.connection.model("restaurants", new mongoose_1.Schema({
                restaurantPK: { type: String, required: true },
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
            this.restaurantRatingModel = this.connection.model("ratings", new mongoose_1.Schema({
                restaurantRatingPK: { type: String, required: true },
                postFK: { type: String, required: true },
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
            this.selfFacilitated = [];
            this.db = db;
        }
        Object.defineProperty(Facilitator.prototype, "hasDoc", {
            get: function () { return !!this.document; },
            enumerable: true,
            configurable: true
        });
        Facilitator.prototype.findOne = function (options) {
            if (options === void 0) { options = null; }
            return null;
        };
        Facilitator.prototype.find = function (options) {
            if (options === void 0) { options = null; }
            return null;
        };
        Facilitator.prototype.remove = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.model.deleteOne(options, function (err) {
                    if (err)
                        return reject(err);
                    resolve();
                });
            });
        };
        Facilitator.prototype.create = function () {
            var _this = this;
            var obj = {};
            this.keyList.map(function (key) {
                obj[key] = _this[key];
            });
            var doc = new this.model(obj);
            this.document = doc;
            return doc;
        };
        Facilitator.prototype.updateDoc = function () { this.assignDataClassToDoc(); };
        Facilitator.prototype.addDoc = function (doc) { this.assignDataDocToClass(doc); };
        Facilitator.prototype.finishPipeline = function (config, options, resolve, reject) {
            var pipeline = [];
            config.map(function (conf) {
                pipeline.push({
                    "$lookup": {
                        "from": conf.collectionName,
                        "localField": conf.localField,
                        "foreignField": conf.foreignField,
                        "as": conf.localField
                    }
                });
                pipeline.push({
                    "$unwind": {
                        "path": "$" + conf.localField,
                        "preserveNullAndEmptyArrays": true
                    }
                });
            });
            var x = {
                $project: {
                    _id: 0
                }
            };
            this.keyList.map(function (key) {
                if (key.match(/FK$/i)) {
                    x.$project[key] = "$" + key;
                }
                else {
                    x.$project[key] = 1;
                }
            });
            pipeline.push(x);
            if (options) {
                var matchOptions_1 = {
                    "$match": {}
                };
                this.keyList.map(function (key) {
                    if (options[key])
                        matchOptions_1["$match"][key] = options[key];
                });
                pipeline.push(matchOptions_1);
            }
            this.model
                .aggregate(pipeline, function (err, d) {
                if (err)
                    return reject(err);
                resolve(d);
            });
        };
        Facilitator.prototype.assignDataDocToClass = function (doc) {
            var _this = this;
            if (!doc)
                return;
            this.keyList.map(function (k) {
                _this[k] = doc[k];
            });
        };
        Facilitator.prototype.assignDataClassToDoc = function () {
            var _this = this;
            if (!this.document)
                return;
            this.keyList.map(function (k) {
                _this.document[k] = _this[k];
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
                "userPK",
                "displayName",
                "username",
                "password",
            ];
            _this.model = db.userModel;
            _this.document = doc;
            _this.addDoc(doc);
            return _this;
        }
        User.prototype.findOne = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
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
        User.prototype.find = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
            return new Promise(function (resolve, reject) {
                _this.model.find(options, function (err, docs) {
                    if (err)
                        return reject(err);
                    docs.map(function (doc) {
                        _this.selfFacilitated.push(new User(_this.db, doc));
                    });
                    resolve(_this.selfFacilitated);
                });
            });
        };
        User.prototype.create = function () {
            var _this = this;
            var obj = {};
            this.keyList.map(function (key) {
                obj[key] = _this[key];
            });
            obj.username = this.username.toLowerCase();
            var doc = new this.model(obj);
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
                "sessionPK",
                "expirationDate",
                "userFK",
            ];
            _this.model = db.sessionModel;
            _this.document = doc;
            _this.addDoc(doc);
            return _this;
        }
        Session.prototype.findOne = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
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
        Session.prototype.find = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
            return new Promise(function (resolve, reject) {
                _this.model.find(options, function (err, docs) {
                    if (err)
                        return reject(err);
                    docs.map(function (doc) {
                        _this.selfFacilitated.push(new Session(_this.db, doc));
                    });
                    resolve(_this.selfFacilitated);
                });
            });
        };
        Session.prototype.joinAll = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var config = [
                    {
                        collectionName: _this.db.userModel.collection.name,
                        localField: "userFK",
                        foreignField: "userPK"
                    }
                ];
                _this.finishPipeline(config, options, resolve, reject);
            });
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
                "postPK",
                "postFK",
                "title",
                "content",
                "userFK",
                "postType",
                "restaurantFK",
                "upvoteFKs",
                "downvoteFKs",
            ];
            _this.document = doc;
            _this.model = db.postModel;
            _this.title = "";
            _this.upvoteFKs = [];
            _this.downvoteFKs = [];
            _this.addDoc(doc);
            return _this;
        }
        Post.prototype.findOne = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
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
        Post.prototype.find = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
            return new Promise(function (resolve, reject) {
                _this.model.find(options, function (err, docs) {
                    if (err)
                        return reject(err);
                    docs.map(function (doc) {
                        _this.selfFacilitated.push(new Post(_this.db, doc));
                    });
                    resolve(_this.selfFacilitated);
                });
            });
        };
        Post.prototype.joinAll = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var config = [
                    {
                        collectionName: _this.db.postModel.collection.name,
                        localField: "postFK",
                        foreignField: "postPK"
                    },
                    {
                        collectionName: _this.db.userModel.collection.name,
                        localField: "userFK",
                        foreignField: "userPK"
                    },
                    {
                        collectionName: _this.db.restaurantModel.collection.name,
                        localField: "restaurantFK",
                        foreignField: "restaurantPK"
                    },
                ];
                _this.finishPipeline(config, options, resolve, reject);
            });
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
                "restaurantPK",
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
        Restaurant.prototype.findOne = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
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
        Restaurant.prototype.find = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
            return new Promise(function (resolve, reject) {
                _this.model.find(options, function (err, docs) {
                    if (err)
                        return reject(err);
                    docs.map(function (doc) {
                        _this.selfFacilitated.push(new Restaurant(_this.db, doc));
                    });
                    resolve(_this.selfFacilitated);
                });
            });
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
                "restaurantRatingPK",
                "restaurantFK",
                "postFK",
                "rating",
            ];
            _this.document = doc;
            _this.model = db.restaurantRatingModel;
            _this.addDoc(doc);
            return _this;
        }
        RestaurantRating.prototype.findOne = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
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
        RestaurantRating.prototype.find = function (options) {
            var _this = this;
            if (options === void 0) { options = null; }
            return new Promise(function (resolve, reject) {
                _this.model.find(options, function (err, docs) {
                    if (err)
                        return reject(err);
                    docs.map(function (doc) {
                        _this.selfFacilitated.push(new RestaurantRating(_this.db, doc));
                    });
                    resolve(_this.selfFacilitated);
                });
            });
        };
        RestaurantRating.prototype.joinAll = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var config = [
                    {
                        collectionName: _this.db.postModel.collection.name,
                        localField: "postFK",
                        foreignField: "postPK"
                    },
                    {
                        collectionName: _this.db.restaurantModel.collection.name,
                        localField: "restaurantFK",
                        foreignField: "restaurantPK"
                    },
                ];
                _this.finishPipeline(config, options, resolve, reject);
            });
        };
        return RestaurantRating;
    }(Facilitator));
    DatabaseMethods.RestaurantRating = RestaurantRating;
})(DatabaseMethods = exports.DatabaseMethods || (exports.DatabaseMethods = {}));
