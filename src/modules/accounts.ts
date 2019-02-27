import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "../database";
import { Document } from "mongoose";

export class Accounts {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    static createAccount(username: string, password: string): Document {
        console.log("creating account");

        const user = new DatabaseMethods.User();
        user.userID = uuid();
        user.username = username;
        user.password = password;

        return user.create();
    }

    static verifyAccount(username: string, password: string): Document {
        console.log("verifying account:", username, password);

        const user = new DatabaseMethods.User();
        user.username = username;
        user.password = password;

        user.find({
            username: username
        });

        return Accounts.createAccount(username, password); // THIS IS TEMPORARY
    }
}