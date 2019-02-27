import { createConnection, Connection, Schema, Model, Document, model } from "mongoose";
import * as Mongoose from "mongoose";
import { Routes } from "./modules/routes";
import { API } from "./modules/api";
import { PostType } from "./modules/restaurants";

export namespace DatabaseMethods {
    export class Database {
        connection: Connection;

        routesModule: Routes;
        apiModule: API;

        onConnection: () => void;
        onFail: () => void;

        constructor(dbUsername: string, dbPassword: string, dbPort: string, dbDatabase: string) {
            const x = createConnection(`mongodb://${dbUsername}:${dbPassword}@localhost:${dbPort}/${dbDatabase}`, {
                useNewUrlParser: true
            }).then((db) => {
                this.connection = db;
                console.log("DB connection");
                this.onConnection();
            }).catch(e => {
                console.error(e);
                this.onFail();
            });
        }
    }

    export class User {
        /**
         * PK
         */
        userID: string;
        username: string;
        password: string;

        private static model: Model<Document> = model("users",
            new Schema({
                userID: { type: String, required: true },
                username: { type: String, required: true },
                password: { type: String, required: true },
            }, {
                timestamps: true
            })
        );

        constructor() {}

        find(options: Record<keyof User, any>) {
            return User.model.findOne(options);
        }

        create() {
            return User.model.create({
                userID: this.userID,
                username: this.username,
                password: this.password,
            });
        }
    }

    export class Post {
        /**
         * PK
         */
        postID: string;
        title: string;
        content: string;
        /**
         *
         * FK: User.userID
         */
        user: string;
        /**
         * 1 = review
         * 2 = comment
         */
        postType: PostType;
        /**
         *
         * FK: Restaurant.restaurantID
         */
        restaurant: string;
        /**
         * List<FK: User.userID>
         */
        upvotes: string[];
        /**
         * List<FK: User.userID>
         */
        downvotes: string[];

        private static model: Model<Document> = model("posts",
            new Schema({
                postID: { type: String, required: true },
                title: { type: String, default: "" },
                content: { type: String, required: true },
                user: { type: String, required: true },
                postType: { type: Number, required: true },
                restaurant: { type: String, required: true },
                upvotes: { type: [String], default: [] },
                downvotes: { type: [String], default: [] },
            }, {
                timestamps: true
            })
        );;

        constructor() {
            this.title = "";
            this.upvotes = [];
            this.downvotes = [];
        }

        find(options: Record<keyof Post, any>) {
            return Post.model.findOne(options);
        }

        create() {
            return Post.model.create({
                postID: this.postID,
                title: this.title,
                content: this.content,
                user: this.user,
                postType: this.postType,
                restaurant: this.restaurant,
                upvotes: this.upvotes,
                downvotes: this.downvotes,
            });
        }
    }

    export class Restaurant {
        /**
         * PK
         */
        restaurantID: string;
        name: string;
        description: string;
        street: string;
        apt: string;
        city: string;
        state: string;
        country: string;
        zip: string;

        private static model: Model<Document> = model("restaurants",
            new Schema({
                restaurantID: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String, default: "" },
                street: { type: String, required: true },
                apt: { type: String, default: "" },
                city: { type: String, required: true },
                state: { type: String, required: true },
                country: { type: String, required: true },
                zip: { type: String, required: true },
            }, {
                timestamps: true
            })
        );

        constructor() {
            this.description = "";
            this.apt = "";
        }

        find(options: Record<keyof Restaurant, any>) {
            return Restaurant.model.findOne(options);
        }

        create() {
            return Restaurant.model.create({
                restaurantID: this.restaurantID,
                name: this.name,
                description: this.description,
                street: this.street,
                apt: this.apt,
                city: this.city,
                state: this.state,
                country: this.country,
                zip: this.zip,
            });
        }
    }

    export class RestaurantRatings {
        /**
         * PK
         */
        restaurantRatingID: string;
        /**
         * FK: Post.postID
         */
        post: string;
        rating: number;

        private static model: Model<Document> = model("ratings",
            new Schema({
                restaurantRatingID: { type: String, required: true },
                post: { type: String, required: true },
                rating: { type: Number, default: 0 }
            }, {
                timestamps: true
            })
        );

        constructor() {}

        find(options: Record<keyof RestaurantRatings, any>) {
            return RestaurantRatings.model.findOne(options);
        }

        create() {
            return RestaurantRatings.model.create({
                restaurantRatingID: this.restaurantRatingID,
                post: this.post,
                rating: this.rating,
            });
        }
    }
}