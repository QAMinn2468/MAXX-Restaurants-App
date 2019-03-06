"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var bcrypt = require("bcryptjs");
var database_1 = require("./database");
var Accounts = /** @class */ (function () {
    function Accounts(main) {
        this.main = main;
    }
    Accounts.prototype.createAccount = function (_a) {
        var _this = this;
        var username = _a.username, displayName = _a.displayName, password = _a.password;
        // display name may or may not be prompted for at the beginning... or ever
        displayName = displayName || username;
        console.log("creating account", username, displayName, password);
        return new Promise(function (resolve, reject) {
            var user = new database_1.DatabaseMethods.User(_this.main.database);
            user.userPK = uuid();
            if (_this.validateUsername(username)) {
                user.username = username.toLowerCase();
            }
            else {
                return reject("Invalid username");
            }
            if (_this.validateUsername(displayName)) {
                user.displayName = displayName;
            }
            else {
                return reject("Invalid username");
            }
            new Promise(function (resolve, reject) {
                user
                    .findOne({
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
                    return resolve(new database_1.DatabaseMethods.User(_this.main.database, null));
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
    Accounts.prototype.authenticateAccount = function (_a) {
        var username = _a.username, password = _a.password;
        console.log("verifying account:", username, password);
        var user = new database_1.DatabaseMethods.User(this.main.database);
        return new Promise(function (resolve, reject) {
            user.findOne({
                username: username
            })
                .then(function (doc) {
                if (!doc.hasDoc)
                    return resolve(doc);
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
