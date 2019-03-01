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
                userPK: { type: String, required: true },
                username: { type: String, required: true },
                password: { type: String, required: true },
            } as ORecord<User, ValueOf<Mongoose.SchemaDefinition>>, {
                timestamps: true
            }));

            this.sessionModel = this.connection.model("sessions",
                new Schema({
                    sessionPK: { type: String, required: true },
                    expirationDate: { type: Date, required: true },
                    userFK: { type: String, required: true },
                } as ORecord<Session, ValueOf<Mongoose.SchemaDefinition>>, {
                    timestamps: true
                })
            );

            this.postModel = this.connection.model("posts",
                new Schema({
                    postPK: { type: String, required: true },
                    title: { type: String, default: "" },
                    content: { type: String, required: true },
                    userFK: { type: String, required: true },
                    postType: { type: Number, required: true },
                    restaurantFK: { type: String, required: true },
                    upvoteFKs: { type: [String], default: [] },
                    downvoteFKs: { type: [String], default: [] },
                } as ORecord<Post, ValueOf<Mongoose.SchemaDefinition>>, {
                    timestamps: true
                })
            );

            this.restaurantModel = this.connection.model("restaurants",
                new Schema({
                    restaurantPK: { type: String, required: true },
                    name: { type: String, required: true },
                    description: { type: String, default: "" },
                    street: { type: String, required: true },
                    apt: { type: String, default: "" },
                    city: { type: String, required: true },
                    state: { type: String, required: true },
                    country: { type: String, required: true },
                    zip: { type: String, required: true },
                } as ORecord<Restaurant, ValueOf<Mongoose.SchemaDefinition>>, {
                    timestamps: true
                })
            );

            //--
            this.restaurantRatingModel = this.connection.model("ratings",
                new Schema({
                    restaurantRatingPK: { type: String, required: true },
                    postFK: { type: String, required: true },
                    rating: { type: Number, default: 0 }
                } as ORecord<RestaurantRating, ValueOf<Mongoose.SchemaDefinition>>, {
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
        get hasDoc(): boolean { return !!this.document; }
        find(options: Record<string, any>): Promise<Facilitator> { return null; }
        create(): Document { return null; }
        updateDoc(): void { this.assignDataClassToDoc(); }
        addDoc(doc: Document): void { this.assignDataDocToClass(doc); }
        private assignDataDocToClass(doc: Document) {
            if (!doc) return;

            this.keyList.map(k => {
                this[k] = (<any>doc)[k]
            });
        }
        private assignDataClassToDoc() {
            if (!this.document) return;

            this.keyList.map(k => {
                (<any>this.document)[k] = this[k]
            });
        }
    }

    export class User extends Facilitator {
        /**
         * PK
         */
        userPK: string;
        displayName: string;
        username: string;
        password: string;
        keyList = [
            "userPK",
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
                userPK: this.userPK,
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
        sessionPK: string;
        expirationDate: Date;
        /**
         * FK: User.userID
         */
        userFK: string;
        keyList = [
            "sessionPK",
            "expirationDate",
            "userFK",
        ];

        model: Model<Document>;

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
                sessionPK: this.sessionPK,
                expirationDate: this.expirationDate,
                userFK: this.userFK,
            });

            this.document = doc;

            return doc;
        }
    }

    export class Post extends Facilitator {
        /**
         * PK
         */
        postPK: string;
        title: string;
        content: string;
        /**
         *
         * FK: User.userID
         */
        userFK: string;
        /**
         * 1 = review
         * 2 = comment
         */
        postType: PostType;
        /**
         *
         * FK: Restaurant.restaurantID
         */
        restaurantFK: string;
        /**
         * List<FK: User.userID>
         */
        upvoteFKs: string[];
        /**
         * List<FK: User.userID>
         */
        downvoteFKs: string[];

        model: Model<Document>;

        keyList = [
            "postPK",
            "title",
            "content",
            "userFK",
            "postType",
            "restaurantFK",
            "upvoteFKs",
            "downvoteFKs",
        ];

        constructor(db: Database, doc: Document = null) {
            super(db);

            this.document = doc;

            this.model = db.postModel;

            this.title = "";
            this.upvoteFKs = [];
            this.downvoteFKs = [];

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
                postPK: this.postPK,
                title: this.title,
                content: this.content,
                userFK: this.userFK,
                postType: this.postType,
                restaurantFK: this.restaurantFK,
                upvoteFKs: this.upvoteFKs,
                downvoteFKs: this.downvoteFKs,
            });

            this.document = doc;

            return doc;
        }
    }

    export class Restaurant extends Facilitator {
        /**
         * PK
         */
        restaurantPK: string;
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
            "restaurantPK",
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
                restaurantPK: this.restaurantPK,
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
        restaurantRatingPK: string;
        /**
         * FK: Post.postID
         */
        postFK: string;
        rating: number;

        model: Model<Document>;

        keyList = [
            "restaurantRatingPK",
            "postFK",
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
                restaurantRatingPK: this.restaurantRatingPK,
                postFK: this.postFK,
                rating: this.rating,
            });

            this.document = doc;

            return doc;
        }
    }
}