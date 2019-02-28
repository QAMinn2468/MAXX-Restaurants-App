import * as express from "express";
import { Main } from "../main";
import { Accounts } from "./accounts";

export class API {
    app = express();

    main: Main;
    accounts: Accounts;

    constructor(main: Main) {
        this.createRoutes();
        this.main = main;
        this.accounts = new Accounts(main);
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
            if(user) {
                res.send(`ESKETIT/api/login<br>${JSON.stringify(user)}`);
                console.log("doc found");
            } else {
                res.send(`ESKETIT/api/login<br>No Doc`);
                console.log("doc not found");
            }
        }).catch(e => {
            console.error(e);
            res.send(`ESKETIT/api/login<br>Big Error`);
        });
    }

    signupAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        this.accounts.createAccount(req.body.username, req.body.password)
        .then(doc => {
            res.send(`ESKETIT/api/signup<br>${JSON.stringify(doc)}`);
            }).catch(e => {
                res.send(`ESKETIT/api/signup<br>Account Exists`);
                console.error(e)
            });
    }

    addRestaurantAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/api/add-restaurant`);
    }
}