"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var database_1 = require("./database");
var Posts = /** @class */ (function () {
    function Posts(main) {
        this.main = main;
    }
    Posts.prototype.createReview = function (data) {
        var _this = this;
        console.log("Creating review");
        var rest = new database_1.DatabaseMethods.Post(this.main.database);
        rest.postPK = uuid();
        rest.content = data.content;
        rest.userFK = data.userFK;
        rest.postType = PostType.REVIEW;
        // this data is needed since we're making a review
        rest.title = data.title;
        rest.restaurantFK = data.restaurantFK;
        return new Promise(function (resolve, reject) {
            rest.create().save(function (err, doc) {
                if (err)
                    return reject(err);
                // add rating in one go
                if (data.rating) {
                    _this.main.apiModule.restaurantRatings.createRestaurantRating({
                        restaurantFK: data.restaurantFK,
                        postFK: data.postFK,
                        rating: data.rating,
                    }).then(function (rat) {
                        resolve(rest);
                    }).catch(function (e) {
                        reject(e);
                    });
                }
                else {
                    resolve(rest);
                }
            });
        });
    };
    Posts.prototype.createComment = function (data) {
        console.log("Creating comment");
        var rest = new database_1.DatabaseMethods.Post(this.main.database);
        rest.postPK = uuid();
        rest.content = data.content;
        rest.userFK = data.userFK;
        rest.postType = PostType.COMMENT;
        // this data is needed since we're making a comment
        rest.postFK = data.postFK;
        return new Promise(function (resolve, reject) {
            rest.create().save(function (err, doc) {
                if (err)
                    return reject(err);
                resolve(rest);
            });
        });
    };
    return Posts;
}());
exports.Posts = Posts;
var PostType;
(function (PostType) {
    PostType[PostType["REVIEW"] = 1] = "REVIEW";
    PostType[PostType["COMMENT"] = 2] = "COMMENT";
})(PostType = exports.PostType || (exports.PostType = {}));
