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
        this.app.get("/login", this.loginAPI);
        this.app.get("/signup", this.signupAPI);
    }

    loginAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/api/login`);
    }

    signupAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/api/signup`);
    }
}