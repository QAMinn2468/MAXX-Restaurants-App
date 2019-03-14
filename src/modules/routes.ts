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
        this.app.get("/restaurants/add", this.addRestaurantsView.bind(this));
        this.app.get("/restaurants/:id", this.restaurantView.bind(this));
        this.app.get("/reviews", this.reviewsView.bind(this));
        this.app.get("/reviews/add", this.addReviewsView.bind(this));
        this.app.get("/reviews/:id", this.reviewView.bind(this));
        this.app.get("/login", this.loginView.bind(this));
        this.app.get("/logout", this.logoutView.bind(this));
        this.app.get("/signup", this.signupView.bind(this));
        // testbench
        this.app.get("/testbench", this.testBenchView.bind(this));
        this.app.get("/test", this.test.bind(this));
    }

    indexView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.render("index");
    }

    restaurantsView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.redirect(`/testbench`);
    }

    addRestaurantsView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.redirect(`/testbench`);
    }

    restaurantView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.redirect(`/testbench`);
    }

    reviewsView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.redirect(`/testbench`);
    }

    addReviewsView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.redirect(`/testbench`);
    }

    reviewView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.redirect(`/testbench`);
    }

    loginView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.redirect(`/testbench`);
    }

    logoutView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        new DatabaseMethods.Session(this.main.database)
            .remove({
                sessionPK: req.cookies.timeSession
            })
            .then(() => {
                res.clearCookie("timeSession");
                res.redirect(`/testbench`);
            })
            .catch(e => {
                res.redirect(`/testbench`);
                console.error(e);
            });
    }

    signupView(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        res.redirect(`/testbench`);
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
            .then(userDoc => comp.userDoc = userDoc.document)
            .then(() => new DatabaseMethods.Restaurant(this.main.database).find())
            .then(restaurantDocs => comp.restaurantDocs = restaurantDocs.map(d => d.document))
            .then(() => new DatabaseMethods.Post(this.main.database).find())
            .then(postDocs => comp.postDocs = postDocs.map(d => d.document))
            .then(() => {
                // console.log("got docs", Object.keys(comp));
                // console.log("got docs", (comp.userDoc));
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
        res.redirect(`/testbench`);
        new DatabaseMethods.RestaurantRating(this.main.database)
            .joinAll()
            .then(d => {
                console.log(d);
            })
            .catch(e => {
                console.error(e);
            });
    }
}