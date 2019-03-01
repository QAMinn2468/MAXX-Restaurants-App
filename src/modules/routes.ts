import * as express from "express";
import { Main } from "../main";
import { join } from "path";

export class Routes {
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
        this.app.get("/", this.indexView);
        this.app.get("/restaurants", this.restaurantsView);
        this.app.get("/restaurants/:id", this.restaurantView);
        this.app.get("/reviews", this.reviewsView);
        this.app.get("/reviews/:id", this.reviewView);
        this.app.get("/login", this.loginView);
        this.app.get("/signup", this.signupView);
        // testbench
        this.app.get("/testbench", this.testBenchView);
    }

    indexView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.sendFile(join(__dirname, "../views/index.html"));
    }

    restaurantsView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/restaurants`);
    }

    restaurantView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/restaurants/${req.params.id}`);
    }

    reviewsView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/reviews`);
    }

    reviewView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/reviews/${req.params.id}`);
    }

    loginView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/login`);
    }

    signupView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/signup`);
    }

    // testbench
    testBenchView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.sendFile(join(__dirname, "../views/testbench.html"));
    }
}