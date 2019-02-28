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

    createAccount(username: string, password: string): Promise<DatabaseMethods.User> {
        console.log("creating account");

        return new Promise<DatabaseMethods.User>((resolve, reject) => {
            const user = new DatabaseMethods.User(this.main.database);
            user.userID = uuid();
            user.username = username;
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
        });
    }

    authenticateAccount(username: string, password: string): Promise<DatabaseMethods.User> {
        console.log("verifying account:", username, password);

        const user = new DatabaseMethods.User(this.main.database);

        return new Promise<DatabaseMethods.User>((resolve, reject) => {
            user.find({
                username: username
            })
            .then(doc => {
                console.log("got doc", doc);

                bcrypt.compare(password, doc.password)
                resolve(doc);
            }).catch(e => console.error(e));
        });
    }
}