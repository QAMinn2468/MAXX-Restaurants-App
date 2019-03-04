import * as express from "express";
import { Main, Results } from "../main";
import { Accounts } from "./accounts";
import { Sessions } from "./session";
import { Restaurants } from "./restaurants";
import { Posts } from "./posts";
import { RestaurantRatings } from "./restaurant-ratings";

export class API {
    app = express();

    main: Main;

    accounts: Accounts;
    sessions: Sessions;
    restaurants: Restaurants;
    restaurantRatings: RestaurantRatings;
    posts: Posts;

    constructor(main: Main) {
        this.createRoutes();
        this.main = main;
        this.accounts = new Accounts(main);
        this.sessions = new Sessions(main);
        this.restaurants = new Restaurants(main);
        this.restaurantRatings = new RestaurantRatings(main);
        this.posts = new Posts(main);
    }

    get routes() {
        return this.app;
    }

    createRoutes() {
        this.app.post("/login", this.loginAPI.bind(this));
        this.app.post("/signup", this.signupAPI.bind(this));
        this.app.post("/add-restaurant", this.addRestaurantAPI.bind(this));
        this.app.post("/add-review", this.addReviewAPI.bind(this));
        this.app.post("/add-comment", this.addCommentAPI.bind(this));
        this.app.post("/add-restaurant-rating", this.addRestaurantRatingAPI.bind(this));
    }

    loginAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        const docPromise = this.accounts.authenticateAccount(req.body);

        docPromise.then((user) => {
            if(user.hasDoc) {
                this.sessions.createSession(user.userPK)
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

    addReviewAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        this.posts
            .createReview(req.body)
            .then(rest => {
                if (rest.hasDoc) {
                    console.log("Review added");

                    const response = new Results(true, rest, null);

                    res.send(`ESKETIT/api/add-review<br>Review added<br><br>${JSON.stringify(response)}`);
                } else {
                    const response = new Results(false, rest, "Review not added");

                    res.send(`ESKETIT/api/add-review<br>${JSON.stringify(response)}`);
                }
            })
            .catch(e => {
                res.send(`ESKETIT/api/add-review<br>Big Error`);
                console.error(e);
            });
    }

    addCommentAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        this.posts
            .createComment(req.body)
            .then(rest => {
                if (rest.hasDoc) {
                    console.log("Comment added");

                    const response = new Results(true, rest, null);

                    res.send(`ESKETIT/api/add-comment<br>Comment added<br><br>${JSON.stringify(response)}`);
                } else {
                    const response = new Results(false, rest, "Comment not added");

                    res.send(`ESKETIT/api/add-comment<br>${JSON.stringify(response)}`);
                }
            })
            .catch(e => {
                res.send(`ESKETIT/api/add-comment<br>Big Error`);
                console.error(e);
            });
    }

    addRestaurantRatingAPI(req: express.Request, res: express.Response, next: express.NextFunction = null) {
        this.restaurantRatings
            .createRestaurantRating(req.body)
            .then(rest => {
                if (rest.hasDoc) {
                    console.log("Restaurant rating added");

                    const response = new Results(true, rest, null);

                    res.send(`ESKETIT/api/add-restaurant-rating<br>Restaurant rating added<br><br>${JSON.stringify(response)}`);
                } else {
                    const response = new Results(false, rest, "Restaurant rating not added");

                    res.send(`ESKETIT/api/add-restaurant-rating<br>${JSON.stringify(response)}`);
                }
            })
            .catch(e => {
                res.send(`ESKETIT/api/add-restaurant-rating<br>Big Error`);
                console.error(e);
            });
    }
}