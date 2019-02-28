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
    }

    loginAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        const docPromise = this.accounts.authenticateAccount(req.body.username, req.body.password);

        docPromise.then((user) => {
            if(user) {
                res.send(`ESKETIT/api/login\n\r${JSON.stringify(user)}`);
                console.log("doc found");
            } else {
                res.send(`ESKETIT/api/login\n\rNo Doc`);
                console.log("doc not found");
            }
        }).catch(e => {
            console.error(e);
            res.send(`ESKETIT/api/login\n\rBig Error`);
        });
    }

    signupAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        this.accounts.createAccount(req.body.username, req.body.password)
        .then(doc => {
            res.send(`ESKETIT/api/signup\n\r${JSON.stringify(doc)}`);
            }).catch(e => console.error(e));
    }
}