import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "./database";

export class Sessions {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    newSession(userFK: string) {
        console.log("adding session");

        const session = new DatabaseMethods.Session(this.main.database);
        session.userFK = userFK;

        const sessionPK = uuid();
        session.sessionPK = sessionPK;
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1)
        session.expirationDate = expirationDate;

        return new Promise<DatabaseMethods.Session>((resolve, reject) => {
            session.create().save()
                .then(savedDoc => {
                    console.log("session doc created", savedDoc);
                    resolve(session);
                })
                .catch(e => {
                    reject(e);
                    console.error(e);
                });
        });
    }
}

export enum PostType {
    REVIEW = 1,
    COMMENT = 2,
}