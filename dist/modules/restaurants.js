"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Restaurants = /** @class */ (function () {
    function Restaurants(main) {
        this.main = main;
    }
    Restaurants.prototype.newRestaurant = function () {
    };
    return Restaurants;
}());
exports.Restaurants = Restaurants;
var PostType;
(function (PostType) {
    PostType[PostType["REVIEW"] = 1] = "REVIEW";
    PostType[PostType["COMMENT"] = 2] = "COMMENT";
})(PostType = exports.PostType || (exports.PostType = {}));
