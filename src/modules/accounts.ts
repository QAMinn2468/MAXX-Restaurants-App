import * as uuid from "uuid/v1";
import { Document } from "mongoose";
import * as bcrypt from "bcryptjs";
import { Main } from "../main";
import { DatabaseMethods } from "./database";

export class Accounts {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    createAccount({username, displayName, password, "password-confirm": password_confirm}: {username: string, displayName: string, password: string, "password-confirm": string}): Promise<DatabaseMethods.User> {
        // display name may or may not be prompted for at the beginning... or ever
        displayName = displayName || username;
        console.log("creating account", username, displayName, password, password_confirm);

        return new Promise<DatabaseMethods.User>((resolve, reject) => {
            const user = new DatabaseMethods.User(this.main.database);
            user.userPK = uuid();

            if (password != password_confirm) {
                console.log("passwords don't match");
                return resolve(null);
            }

            if (this.validateUsername(username)) {
                user.username = username.toLowerCase();
            } else {
                console.log("Invalid username");
                return resolve(null);
            }

            if (this.validateUsername(displayName)) {
                user.displayName = displayName;
            } else {
                console.log("Invalid username");
                return resolve(null);
            }

            new Promise((resolve, reject) => {
                user
                .findOne({
                    username: username.toLowerCase(),
                })
                .then(doc => {
                    if (!doc.document) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            }).then((canAddAccount) => {
                if (!canAddAccount) return resolve(new DatabaseMethods.User(this.main.database, null));

                bcrypt.genSalt()
                .then(salt => bcrypt.hash(password, salt))
                .then(hash => {
                    console.log("hash:", hash);

                    user.password = hash;

                    try {
                        user.create()
                            .save()
                            .then((savedDoc) => {
                                console.log("new user saved", savedDoc);
                                resolve(new DatabaseMethods.User(this.main.database, savedDoc));
                            }).catch(e => console.error(e));
                    } catch (err) {
                        reject(err);
                    }
                });
            }).catch(e => console.log(e));
        });
    }

    authenticateAccount({username, password}: {username: string, password: string}): Promise<DatabaseMethods.User> {
        console.log("verifying account:", username, password);

        const user = new DatabaseMethods.User(this.main.database);

        return new Promise<DatabaseMethods.User>((resolve, reject) => {
            user.findOne({
                username
            })
            .then(doc => {
                if (!doc.hasDoc) return resolve(doc);
                console.log("got doc");

                bcrypt.compare(password, doc.password)
                    .then(matches => {
                        console.log("pasword matches", matches);
                    })
                    .catch(e => console.error(e))
                resolve(doc);
            }).catch(e => console.error(e));
        });
    }

    validateUsername(username: string): boolean {
        // only letters, numbers, hyphens, and underscores
        const valid = username.match(/^[\d\w\-\_]{3,}$/i) &&
            // only three hyphens and understores total
            (username.match(/[\-\_]/g) || []).length <= 3 &&
            // username length limit
            username.length >= 3 &&
            username.length <= 20
        return valid;
    }
}