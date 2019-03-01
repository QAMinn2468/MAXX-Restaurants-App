"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v1");
var database_1 = require("./database");
var Sessions = /** @class */ (function () {
    function Sessions(main) {
        this.main = main;
    }
    Sessions.prototype.newSession = function (userFK) {
        console.log("adding session");
        var session = new database_1.DatabaseMethods.Session(this.main.database);
        session.userFK = userFK;
        return new Promise(function (resolve, reject) {
            session.find({
                userFK: userFK
            }).then(function (session) {
                var sessionPK = uuid();
                session.sessionPK = sessionPK;
                var expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 1);
                session.expirationDate = expirationDate;
                if (session.hasDoc) {
                    session.updateDoc();
                    session.document.update(Object.assign(session.document, { updatedAt: new Date() }), function (err, raw) {
                        if (err) {
                            console.error(err);
                            reject(err);
                            return;
                        }
                        console.log("session doc updated", raw);
                        resolve(session);
                    });
                }
                else {
                    session.create().save()
                        .then(function (savedDoc) {
                        console.log("session doc created", savedDoc);
                        resolve(session);
                    })
                        .catch(function (e) {
                        console.error(e);
                        reject(e);
                    });
                }
            }).catch(function (e) { return console.error(e); });
        });
    };
    return Sessions;
}());
exports.Sessions = Sessions;
var PostType;
(function (PostType) {
    PostType[PostType["REVIEW"] = 1] = "REVIEW";
    PostType[PostType["COMMENT"] = 2] = "COMMENT";
})(PostType = exports.PostType || (exports.PostType = {}));
