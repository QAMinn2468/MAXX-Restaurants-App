"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var database_1 = require("../database");
var Accounts = /** @class */ (function () {
    function Accounts(main) {
        this.main = main;
    }
    Accounts.createAccount = function (username, password) {
        console.log("creating account");
        var user = new database_1.DatabaseMethods.User();
        user.userID = uuid();
        user.username = username;
        user.password = password;
        return user.create();
    };
    Accounts.verifyAccount = function (username, password) {
        console.log("verifying account:", username, password);
        var user = new database_1.DatabaseMethods.User();
        user.username = username;
        user.password = password;
        user.find({
            username: username
        });
        return Accounts.createAccount(username, password); // THIS IS TEMPORARY
    };
    return Accounts;
}());
exports.Accounts = Accounts;
