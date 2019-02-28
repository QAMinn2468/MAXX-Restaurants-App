"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var bcrypt = require("bcryptjs");
var database_1 = require("./database");
var Accounts = /** @class */ (function () {
    function Accounts(main) {
        this.main = main;
    }
    Accounts.prototype.createAccount = function (username, password) {
        var _this = this;
        console.log("creating account");
        return new Promise(function (resolve, reject) {
            var user = new database_1.DatabaseMethods.User(_this.main.database);
            user.userID = uuid();
            user.username = username;
            bcrypt.genSalt()
                .then(function (salt) { return bcrypt.hash(password, salt); })
                .then(function (hash) {
                console.log("hash:", hash);
                user.password = hash;
                try {
                    user.create()
                        .save()
                        .then(function (savedDoc) {
                        console.log("new user saved", savedDoc);
                        resolve(new database_1.DatabaseMethods.User(_this.main.database, savedDoc));
                    }).catch(function (e) { return console.error(e); });
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    };
    Accounts.prototype.authenticateAccount = function (username, password) {
        console.log("verifying account:", username, password);
        var user = new database_1.DatabaseMethods.User(this.main.database);
        return new Promise(function (resolve, reject) {
            user.find({
                username: username
            })
                .then(function (doc) {
                console.log("got doc", doc);
                bcrypt.compare(password, doc.password);
                resolve(doc);
            }).catch(function (e) { return console.error(e); });
        });
    };
    return Accounts;
}());
exports.Accounts = Accounts;
