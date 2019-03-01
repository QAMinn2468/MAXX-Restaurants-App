"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var database_1 = require("./database");
var Restaurants = /** @class */ (function () {
    function Restaurants(main) {
        this.main = main;
    }
    Restaurants.prototype.createRestaurant = function (data) {
        console.log("Creating restaurant");
        var rest = new database_1.DatabaseMethods.Restaurant(this.main.database);
        rest.restaurantPK = uuid();
        rest.name = data.name || "";
        rest.description = data.description || "";
        rest.street = data.street || "";
        rest.apt = data.apt || "";
        rest.city = data.city || "";
        rest.state = data.state || "";
        rest.country = data.country || "";
        rest.zip = data.zip || "";
        return new Promise(function (resolve, reject) {
            rest.create().save(function (err, doc) {
                if (err)
                    return reject(err);
                resolve(rest);
            });
        });
    };
    return Restaurants;
}());
exports.Restaurants = Restaurants;
var PostType;
(function (PostType) {
    PostType[PostType["REVIEW"] = 1] = "REVIEW";
    PostType[PostType["COMMENT"] = 2] = "COMMENT";
})(PostType = exports.PostType || (exports.PostType = {}));
