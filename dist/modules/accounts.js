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
        console.log("creating account", username, password);
        return new Promise(function (resolve, reject) {
            var user = new database_1.DatabaseMethods.User(_this.main.database);
            user.userID = uuid();
            if (_this.validateUsername(username)) {
                user.username = username;
            }
            else {
                return reject("Invalid username");
            }
            new Promise(function (resolve, reject) {
                user
                    .find({
                    username: username.toLowerCase(),
                })
                    .then(function (doc) {
                    if (!doc.document) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
            }).then(function (canAddAccount) {
                if (!canAddAccount)
                    return reject("Cannot create account. Account exists");
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
            }).catch(function (e) { return console.log(e); });
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
                console.log("got doc");
                bcrypt.compare(password, doc.password)
                    .then(function (matches) {
                    console.log("pasword matches", matches);
                })
                    .catch(function (e) { return console.error(e); });
                resolve(doc);
            }).catch(function (e) { return console.error(e); });
        });
    };
    Accounts.prototype.validateUsername = function (username) {
        // only letters, numbers, hyphens, and underscores
        var valid = username.match(/^[\d\w\-\_]{3,}$/i) &&
            // only three hyphens and understores total
            (username.match(/[\-\_]/g) || []).length <= 3 &&
            // username length limit
            username.length >= 3 &&
            username.length <= 20;
        return valid;
    };
    return Accounts;
}());
exports.Accounts = Accounts;
