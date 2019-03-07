"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var database_1 = require("./database");
var RestaurantRatings = /** @class */ (function () {
    function RestaurantRatings(main) {
        this.main = main;
    }
    RestaurantRatings.prototype.createRestaurantRating = function (data) {
        console.log("Creating restaurant rating");
        var rest = new database_1.DatabaseMethods.RestaurantRating(this.main.database);
        rest.restaurantRatingPK = uuid();
        rest.restaurantFK = data.restaurantFK || "";
        rest.postFK = data.postFK || "";
        rest.rating = data.rating || 1;
        return new Promise(function (resolve, reject) {
            rest.create().save(function (err, doc) {
                if (err)
                    return reject(err);
                resolve(rest);
            });
        });
    };
    return RestaurantRatings;
}());
exports.RestaurantRatings = RestaurantRatings;
var PostType;
(function (PostType) {
    PostType[PostType["REVIEW"] = 1] = "REVIEW";
    PostType[PostType["COMMENT"] = 2] = "COMMENT";
})(PostType = exports.PostType || (exports.PostType = {}));
