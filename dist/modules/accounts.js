"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var database_1 = require("../database");
var Accounts = /** @class */ (function () {
    function Accounts(main) {
        this.main = main;
    }
    Accounts.prototype.newAccount = function (username, password) {
        var user = new database_1.DatabaseMethods.User();
        user.userID = uuid();
        user.username = username;
        user.password = password;
    };
    return Accounts;
}());
exports.Accounts = Accounts;
