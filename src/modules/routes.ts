import * as express from "express";
import { Main } from "../main";

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
        this.app.get("/", this.index);
        this.app.get("/restaurants", this.restaurants);
        this.app.get("/restaurants/:id", this.restaurant);
        this.app.get("/reviews", this.reviews);
        this.app.get("/reviews/:id", this.review);
    }

    index(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT`);
    }

    restaurants(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/restaurants`);
    }

    restaurant(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/restaurants/${req.params.id}`);
    }

    reviews(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/reviews`);
    }

    review(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.send(`ESKETIT/reviews/${req.params.id}`);
    }
}