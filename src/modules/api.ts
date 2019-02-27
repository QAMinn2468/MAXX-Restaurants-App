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
        this.app.post("/login", this.loginAPI);
        this.app.post("/signup", this.signupAPI);
    }

    loginAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/api/login`);

        console.log(req.body);
        const doc = Accounts.verifyAccount(req.body.username, req.body.password);

        if(doc) {
            console.log("doc found");
        } else {
            console.log("doc not found");
        }
    }

    signupAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/api/signup`);
    }
}