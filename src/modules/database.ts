import { createConnection, Connection, Schema, Model, Document, model } from "mongoose";
import * as Mongoose from "mongoose";
import { Routes } from "./routes";
import { API } from "./api";
import { PostType } from "./restaurants";

export namespace DatabaseMethods {
    export class Database{
        connection: Connection;

        userModel: Model<Document>;
        restaurantRatingModel: Model<Document>;
        sessionModel: Model<Document>;
        postModel: Model<Document>;
        restaurantModel: Model<Document>;

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
                this.makeModels();
            }).catch(e => {
                console.error(e);
                this.onFail();
            });
        }

        makeModels() {
            this.userModel = this.connection.model("users", new Schema({
                userID: { type: String, required: true },
                username: { type: String, required: true },
                password: { type: String, required: true },
            } as Record<keyof User, any>, {
                timestamps: true
            }));

            this.sessionModel = this.connection.model("sessions",
                new Schema({
                    sessionID: { type: String, required: true },
                    user: { type: String, required: true },
                } as Record<keyof Session, any>, {
                    timestamps: true
                })
            );

            this.postModel = this.connection.model("posts",
                new Schema({
                    postID: { type: String, required: true },
                    title: { type: String, default: "" },
                    content: { type: String, required: true },
                    user: { type: String, required: true },
                    postType: { type: Number, required: true },
                    restaurant: { type: String, required: true },
                    upvotes: { type: [String], default: [] },
                    downvotes: { type: [String], default: [] },
                } as Record<keyof Post, any>, {
                    timestamps: true
                })
            );

            this.restaurantModel = this.connection.model("restaurants",
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
                } as Record<keyof Restaurant, any>, {
                    timestamps: true
                })
            );

            //--
            this.restaurantRatingModel = this.connection.model("ratings",
                new Schema({
                    restaurantRatingID: { type: String, required: true },
                    post: { type: String, required: true },
                    rating: { type: Number, default: 0 }
                } as Record<keyof RestaurantRating, any>, {
                    timestamps: true
                })
            );
        }
    }

    export class Facilitator {
        [key:string]: any;
        keyList: string[];
        db: Database;
        document: Document = null;
        constructor(db: Database) {}
        find(options: Record<string, any>): Promise<Facilitator> { return null; }
        create(): Document { return null; }
        addDoc(doc: Document): void { this.assignData(doc); }
        private assignData(doc: Document) {
            if (!doc) return;

            this.keyList.map(k => {
                this[k] = (<any>doc)[k]
            });
        }
    }

    export class User extends Facilitator {
        /**
         * PK
         */
        userID: string;
        displayName: string;
        username: string;
        password: string;
        keyList = [
            "userID",
            "displayName",
            "username",
            "password",
        ];

        private model: Model<Document>;

        constructor(db: Database, doc: Document = null) {
            super(db);

            this.model = db.userModel;

            this.document = doc;
            this.addDoc(doc);
        }

        find(options: FORecord<User>) {
            return new Promise<User>((resolve, reject) => {
                this.model.findOne(options, (err, doc) => {
                    if(err) return reject(err);

                    this.document = doc;
                    this.addDoc(doc);
                    resolve(this);
                });
            });
        }

        create() {
            const doc = new this.model({
                userID: this.userID,
                displayName: this.username,
                username: this.username.toLowerCase(),
                password: this.password,
            });

            this.document = doc;

            return doc;
        }
    }

    export class Session extends Facilitator {
        /**
         * PK
         */
        sessionID: string;
        /**
         * FK: User.userID
         */
        user: string;

        model: Model<Document>;
        keyList = [
            "sessionID",
            "user",
        ];

        constructor(db: Database, doc: Document = null) {
            super(db);

            this.model = db.sessionModel;

            this.document = doc;
            this.addDoc(doc);
        }

        find(options: FORecord<Session>) {
            return new Promise<Session>((resolve, reject) => {
                this.model.findOne(options, (err, doc) => {
                    if(err) return reject(err);

                    this.document = doc;
                    this.addDoc(doc);
                    resolve(this);
                });
            });
        }

        create() {
            const doc = new this.model({
                sessionID: this.sessionID,
                user: this.user,
            });

            this.document = doc;

            return doc;
        }
    }

    export class Post extends Facilitator {
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

        model: Model<Document>;

        keyList = [
            "postID",
            "title",
            "content",
            "user",
            "postType",
            "restaurant",
            "upvotes",
            "downvotes",
        ];

        constructor(db: Database, doc: Document = null) {
            super(db);

            this.document = doc;

            this.model = db.postModel;

            this.title = "";
            this.upvotes = [];
            this.downvotes = [];

            this.addDoc(doc);
        }

        find(options: FORecord<Post>) {
            return new Promise<Post>((resolve, reject) => {
                this.model.findOne(options, (err, doc) => {
                    if(err) return reject(err);

                    this.document = doc;
                    this.addDoc(doc);
                    resolve(this);
                });
            });
        }

        create() {
            const doc = new this.model({
                postID: this.postID,
                title: this.title,
                content: this.content,
                user: this.user,
                postType: this.postType,
                restaurant: this.restaurant,
                upvotes: this.upvotes,
                downvotes: this.downvotes,
            });

            this.document = doc;

            return doc;
        }
    }

    export class Restaurant extends Facilitator {
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

        model: Model<Document>;

        keyList = [
            "restaurantID",
            "name",
            "description",
            "street",
            "apt",
            "city",
            "state",
            "country",
            "zip",
        ];

        constructor(db: Database, doc: Document = null) {
            super(db);

            this.document = doc;

            this.model = db.restaurantModel;

            this.description = "";
            this.apt = "";

            this.addDoc(doc);
        }

        find(options: FORecord<Restaurant>) {
            return new Promise<Restaurant>((resolve, reject) => {
                this.model.findOne(options, (err, doc) => {
                    if(err) return reject(err);

                    this.document = doc;
                    this.addDoc(doc);
                    resolve(this);
                });
            });
        }

        create() {
            const doc = new this.model({
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

            this.document = doc;

            return doc;
        }
    }

    export class RestaurantRating extends Facilitator {
        /**
         * PK
         */
        restaurantRatingID: string;
        /**
         * FK: Post.postID
         */
        post: string;
        rating: number;

        model: Model<Document>;

        keyList = [
            "restaurantRatingID",
            "post",
            "rating",
        ];

        constructor(db: Database, doc: Document = null) {
            super(db);

            this.document = doc;

            this.model = db.restaurantRatingModel;

            this.addDoc(doc);
        }

        find(options: FORecord<RestaurantRating>) {
            return new Promise<RestaurantRating>((resolve, reject) => {
                this.model.findOne(options, (err, doc) => {
                    if(err) return reject(err);

                    this.document = doc;
                    this.addDoc(doc);
                    resolve(this);
                });
            });
        }

        create() {
            const doc = new this.model({
                restaurantRatingID: this.restaurantRatingID,
                post: this.post,
                rating: this.rating,
            });

            this.document = doc;

            return doc;
        }
    }
}