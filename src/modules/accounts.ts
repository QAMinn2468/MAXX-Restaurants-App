import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "../database";

export class Accounts {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    newAccount(username: string, password: string) {
        const user = new DatabaseMethods.User();
        user.userID = uuid();
        user.username = username;
        user.password = password;
    }
}