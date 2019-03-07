import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "./database";
import { RestaurantRatings } from "./restaurant-ratings";

export class Posts {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    createReview(data: TORecord<DatabaseMethods.Post>) {
        console.log("Creating review");

        const rest = new DatabaseMethods.Post(this.main.database);
        rest.postPK = uuid();
        rest.content = data.content;
        rest.userFK = data.userFK;
        rest.postType = PostType.REVIEW;

        // this data is needed since we're making a review
        rest.title = data.title;
        rest.restaurantFK = data.restaurantFK;

        return new Promise<DatabaseMethods.Post>((resolve, reject) => {
            rest.create().save((err: any, doc: any) => {
                if (err) return reject(err);

                // add rating in one go
                if (data.rating) {
                    this.main.apiModule.restaurantRatings.createRestaurantRating({
                        restaurantFK: data.restaurantFK,
                        postFK: data.postFK,
                        rating: data.rating,
                    }).then(rat => {
                        resolve(rest);
                    }).catch(e => {
                        reject(e);
                    });
                } else {
                    resolve(rest);
                }
            });
        });
    }

    createComment(data: TORecord<DatabaseMethods.Post>) {
        console.log("Creating comment");

        const rest = new DatabaseMethods.Post(this.main.database);
        rest.postPK = uuid();
        rest.content = data.content;
        rest.userFK = data.userFK;
        rest.postType = PostType.COMMENT;

        // this data is needed since we're making a comment
        rest.postFK = data.postFK;

        return new Promise<DatabaseMethods.Post>((resolve, reject) => {
            rest.create().save((err: any, doc: any) => {
                if (err) return reject(err);

                resolve(rest);
            });
        });
    }
}

export enum PostType {
    REVIEW = 1,
    COMMENT = 2,
}