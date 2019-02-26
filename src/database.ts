import { createConnection, Connection, Schema, Model, Document, model } from "mongoose";
import * as uuid from "uuid/v1";
import { Routes } from "./modules/routes";
import { API } from "./modules/api";

export namespace DatabaseMethods {
    export class Database {
        connection: Connection;

        routesModule: Routes;
        apiModule: API;

        userSchema: Schema<any>;
        postSchema: Schema<any>;
        restaurantSchema: Schema<any>;
        postTypeSchema: Schema<any>;
        restaurantRatingsSchema: Schema<any>;

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

    export class User extends Document {
        /**
         * PK
         */
        userID: string;
        username: string;
        password: string;

        private _model: Model<Document>;

        constructor() {
            super();
        }

        make(): this {
            const schema = new Schema({
                userID: { type: String, required: true },
                username: { type: String, required: true },
                password: { type: String, required: true },
            }, {
                    timestamps: true
                });
            this._model = model("users", schema);
            return this;
        }

        get model() {
            return this._model.create({
                userID: this.userID,
                username: this.username,
                password: this.password,
            });
        }
    }

    export class Post extends Document {
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
         *
         * FK: PostType.postTypeID
         */
        postType: string;
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

        private _model: Model<Document>;

        constructor() {
            super();
        }

        make(): this {
            const schema = new Schema({
                postID: { type: String, required: true },
                title: { type: String, required: true },
                content: { type: String, required: true },
                user: { type: String, required: true },
                postType: { type: String, required: true },
                restaurant: { type: String, required: true },
                upvotes: { type: [String], default: [] },
                downvotes: { type: [String], default: [] },
            }, {
                timestamps: true
            });
            this._model = model("posts", schema);
            return this;
        }

        get model() {
            return this._model.create({
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

    export class Restaurant extends Document {
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

        private _model: Model<Document>;

        constructor() {
            super();
        }

        make(): this {
            const schema = new Schema({
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
                });
            this._model = model("restaurants", schema);
            return this;
        }

        get model() {
            return this._model.create({
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

    export class PostType extends Document {
        /**
         * PK
         */
        postTypeID: number;
        typeDescription: "comment" | "review";

        private _model: Model<Document>;

        constructor() {
            super();
        }

        make(): this {
            const schema = new Schema({
                postTypeID: { type: Number, required: true },
                typeDescription: { type: String, required: true }
            }, {
                    timestamps: true
                });
            this._model = model("postTypes", schema);
            return this;
        }

        get model() {
            return this._model.create({
                postTypeID: this.postTypeID,
                typeDescription: this.typeDescription,
            });
        }
    }

    export class RestaurantRatings extends Document {
        /**
         * PK
         */
        restaurantRatingID: string;
        /**
         * FK: Post.postID
         */
        post: string;
        rating: number;

        private _model: Model<Document>;

        constructor() {
            super();
        }

        make(): this {
            const schema = new Schema({
                restaurantRatingID: { type: String, required: true },
                rating: { type: Number, required: true }
            }, {
                    timestamps: true
                });
            this._model = model("ratings", schema);
            return this;
        }

        get model() {
            return this._model.create({
                restaurantRatingID: this.restaurantRatingID,
                post: this.post,
                rating: this.rating,
            });
        }
    }
}