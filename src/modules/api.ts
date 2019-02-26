import * as express from "express";
import { Main } from "../main";

export class API {
    app = express();

    main: Main;

    constructor(main: Main) {
        this.createRoutes();
        this.main = main;
    }

    get routes() {
        return this.app;
    }

    createRoutes() {
        this.app.get("/", (req, res) => {
            res.send("ESKETIT");
        });
    }
}