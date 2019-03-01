import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "./database";
import { Document } from "mongoose";

export class Sessions {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    newSession(userFK: string) {
        console.log("adding session");

        const session = new DatabaseMethods.Session(this.main.database);
        session.userFK = userFK;

        return new Promise<DatabaseMethods.Session>((resolve, reject) => {
            session.find({
                userFK
            }).then(session => {
                const sessionPK = uuid();
                session.sessionPK = sessionPK;

                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 1)
                session.expirationDate = expirationDate;

                if (session.hasDoc) {
                    session.updateDoc();
                    session.document.update(Object.assign(session.document, { updatedAt: new Date() }), (err, raw) => {
                        if(err) {
                            console.error(err);
                            reject(err);
                            return;
                        }

                        console.log("session doc updated", raw);
                        resolve(session);
                    });
                } else {
                    session.create().save()
                        .then(savedDoc => {
                            console.log("session doc created", savedDoc);
                            resolve(session);
                        })
                        .catch(e => {
                            console.error(e);
                            reject(e);
                        });
                }
            }).catch(e => console.error(e));
        });
    }
}

export enum PostType {
    REVIEW = 1,
    COMMENT = 2,
}