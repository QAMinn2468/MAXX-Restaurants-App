import * as express from "express";
import { join } from "path";
import { Main } from "../main";
import { Accounts } from "./accounts";
import { Sessions } from "./session";
import { Restaurants } from "./restaurants";
import { Posts } from "./posts";
import { DatabaseMethods } from "./database";

export class Routes {
    app = express();

    main: Main;

    // accounts: Accounts;
    sessions: Sessions;
    // restaurants: Restaurants;
    // posts: Posts;

    constructor(main: Main) {
        this.app.set("views", join(__dirname, "../views"));
        this.createRoutes();
        this.main = main;

        // this.accounts = new Accounts(main);
        this.sessions = new Sessions(main);
        // this.restaurants = new Restaurants(main);
        // this.posts = new Posts(main);
    }

    get routes() {
        return this.app;
    }

    createRoutes() {
        this.app.get("/", this.indexView.bind(this));
        this.app.get("/restaurants", this.restaurantsView.bind(this));
        this.app.get("/restaurants/:id", this.restaurantView.bind(this));
        this.app.get("/reviews", this.reviewsView.bind(this));
        this.app.get("/reviews/:id", this.reviewView.bind(this));
        this.app.get("/login", this.loginView.bind(this));
        this.app.get("/signup", this.signupView.bind(this));
        // testbench
        this.app.get("/testbench", this.testBenchView.bind(this));
        this.app.get("/test", this.test.bind(this));
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
        let comp: any = {};

        console.log("cookies", req.cookies);

        new DatabaseMethods.Session(this.main.database)
            .findOne({
                sessionPK: req.cookies.timeSession
            })
            .then(sessionDoc => new DatabaseMethods.User(this.main.database).findOne({
                userPK: sessionDoc.userFK
            }))
            .then(userDoc => comp.userDoc = userDoc)
            .then(() => new DatabaseMethods.Restaurant(this.main.database).find())
            .then(restaurantDocs => comp.restaurantDocs = restaurantDocs)
            .then(() => new DatabaseMethods.Post(this.main.database).find())
            .then(postDocs => comp.postDocs = postDocs)
            .then(() => {
                // console.log("got docs", Object.keys(comp));
                console.log("got docs", (comp.userDoc));
                res.render("testbench-home", {
                    user: comp.userDoc,
                    restaurants: comp.restaurantDocs,
                    posts: comp.postDocs,
                });
            })
            .catch(e => console.error(e));

        // res.sendFile(join(__dirname, "../views/testbench.html"));
    }
    test(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        new DatabaseMethods.RestaurantRating(this.main.database)
            .joinAll()
            .then(d => {
                console.log(d);
                res.redirect("/testbench");
            })
            .catch(e => {
                console.error(e);
                res.redirect("/testbench");
            });
    }
}