import * as express from "express";
import { Main, Results } from "../main";
import { Accounts } from "./accounts";
import { Sessions } from "./session";
import { Time } from "./time";
import { Restaurants } from "./restaurants";

export class API {
    app = express();

    main: Main;
    accounts: Accounts;
    sessions: Sessions;
    restaurants: Restaurants;

    constructor(main: Main) {
        this.createRoutes();
        this.main = main;
        this.accounts = new Accounts(main);
        this.sessions = new Sessions(main);
        this.restaurants = new Restaurants(main);
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
        const docPromise = this.accounts.authenticateAccount(req.body);

        docPromise.then((user) => {
            if(user.hasDoc) {
                this.sessions.newSession(user.userPK)
                    .then(session => {
                        res.cookie("timeSession", session.sessionPK, {
                            expires: false, // session.expirationDate
                        });
                        const response = new Results(true, {user, session}, null);
                        res.send(`ESKETIT/api/login<br>Logged In<br><br><pre>${JSON.stringify(response)}</pre>`);
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
        this.accounts.createAccount(req.body)
        .then(user => {
                if (user.hasDoc) {
                    const response = new Results(true, user, null);
                    res.send(`ESKETIT/api/signup<br>Signed Up<br><br><pre>${JSON.stringify(response)}</pre>`);
                } else {
                    // const response = new Results(false, user, "Could not create account");
                    res.send(`ESKETIT/api/signup<br>Could not create account`);
                }
            }).catch(e => {
                res.send(`ESKETIT/api/signup<br>Big Error`);
                console.error(e)
            });
    }

    addRestaurantAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        this.restaurants
            .createRestaurant(req.body)
            .then(rest => {
                if (rest.hasDoc) {
                    console.log("Restaurant added");

                    const response = new Results(true, rest, null);

                    res.send(`ESKETIT/api/add-restaurant<br>Restaurant added<br><br>${JSON.stringify(response)}`);
                } else {
                    const response = new Results(false, rest, "Restaurant not added");

                    res.send(`ESKETIT/api/add-restaurant<br>${JSON.stringify(response)}`);
                }
            })
            .catch(e => {
                res.send(`ESKETIT/api/add-restaurant<br>Big Error`);
                console.error(e);
            });
    }
}