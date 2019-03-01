import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "./database";

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

        // rest.restaurantFK = data.restaurantFK;
        // rest.upvoteFKs = data.upvoteFKs;
        // rest.downvoteFKs = data.downvoteFKs;

        // this data is needed since we're making a review
        rest.title = data.title;
        rest.restaurantFK = data.restaurantFK;

        return new Promise<DatabaseMethods.Post>((resolve, reject) => {
            rest.create().save((err, doc) => {
                if (err) return reject(err);

                resolve(rest);
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

        // rest.restaurantFK = data.restaurantFK;
        // rest.upvoteFKs = data.upvoteFKs;
        // rest.downvoteFKs = data.downvoteFKs;

        // this data is needed since we're making a comment
        rest.postFK = data.postFK;

        return new Promise<DatabaseMethods.Post>((resolve, reject) => {
            rest.create().save((err, doc) => {
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