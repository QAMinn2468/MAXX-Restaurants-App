import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "./database";

export class RestaurantRatings {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    createRestaurantRating(data: TORecord<DatabaseMethods.RestaurantRating>) {
        console.log("Creating restaurant rating");

        const rest = new DatabaseMethods.RestaurantRating(this.main.database);
        rest.restaurantRatingPK = uuid();
        rest.restaurantFK = data.restaurantFK || "";
        rest.postFK = data.postFK || "";
        rest.rating = data.rating || 1;

        return new Promise<DatabaseMethods.RestaurantRating>((resolve, reject) => {
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