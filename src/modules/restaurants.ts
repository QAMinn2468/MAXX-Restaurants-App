import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "./database";

export class Restaurants {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    createRestaurant(data: TORecord<DatabaseMethods.Restaurant>) {
        const rest = new DatabaseMethods.Restaurant(this.main.database);
        rest.restaurantPK = uuid();
        rest.name = data.name || "";
        rest.description = data.description || "";
        rest.street = data.street || "";
        rest.apt = data.apt || "";
        rest.city = data.city || "";
        rest.state = data.state || "";
        rest.country = data.country || "";
        rest.zip = data.zip || "";

        return new Promise<DatabaseMethods.Restaurant>((resolve, reject) => {
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