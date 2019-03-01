import * as express from "express";
import { Main } from "../main";
import { Accounts } from "./accounts";
import { Sessions } from "./session";
import { Time } from "./time";

export class API {
    app = express();

    main: Main;
    accounts: Accounts;
    sessions: Sessions;

    constructor(main: Main) {
        this.createRoutes();
        this.main = main;
        this.accounts = new Accounts(main);
        this.sessions = new Sessions(main);
    }

    get routes() {
        return this.app;
    }

    createRoutes() {
        this.app.post("/login", this.loginAPI.bind(this));
        this.app.post("/signup", this.signupAPI.bind(this));
        this.app.post("/add-restaurant", this.addRestaurantAPI.bind(this));
    }

    loginAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        const docPromise = this.accounts.authenticateAccount(req.body.username, req.body.password);

        docPromise.then((user) => {
            if(user.hasDoc) {
                this.sessions.newSession(user.userPK)
                    .then(session => {
                        res.cookie("timeSession", session.sessionPK, {
                            expires: false, // session.expirationDate
                        });
                        res.send(`ESKETIT/api/login<br>Logged In<br><br>${JSON.stringify(user)}<br>${JSON.stringify(session)}`);
                        console.log("login successful");
                    })
                    .catch(e => {
                        console.log("login not successful", e);
                        res.send(`ESKETIT/api/login<br>Big Error`);
                    });
            } else {
                res.send(`ESKETIT/api/login<br>Could not login`);
                console.log("login not successful. No user doc");
            }
        }).catch(e => {
            console.log("login not successful", e);
            res.send(`ESKETIT/api/login<br>Big Error`);
        });
    }

    signupAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        this.accounts.createAccount(req.body.username, req.body.password)
        .then(doc => {
                if (doc.hasDoc) {
                    res.send(`ESKETIT/api/signup<br>Signed Up<br><br>${JSON.stringify(doc)}`);
                } else {
                    res.send(`ESKETIT/api/signup<br>Could not create account`);
                }
            }).catch(e => {
                res.send(`ESKETIT/api/signup<br>Big Error`);
                console.error(e)
            });
    }

    addRestaurantAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/api/add-restaurant`);
    }
}