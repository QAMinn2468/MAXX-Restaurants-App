import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { Routes } from "./modules/routes";
import { API } from "./modules/api";
import { DatabaseMethods } from "./modules/database";
import { join } from "path";

declare global {
    /**
     * Record with optional parameters
     * Uses types of T
     */
    type TORecord<T> = {
        [K in keyof T]?: T[K]
    }

    /**
     * Record with optional parameters
     */
    type ORecord<K, T> = {
        [Kk in keyof K]?: T
    }

    /**
     * Gets the data types of T
     */
    type ValueOf<T> = T[keyof T]

    // type Primatives<T> = { [Key in keyof T]?: T[Key] extends (String | Number | Boolean) ? Key : never }[keyof T]
    type Primatives<T> = { [Key in keyof T]?: Key }[keyof T]
}

const dbUsername = process.env["DB_USERNAME"];
const dbPassword = process.env["DB_PASSWORD"];
const dbPort = process.env["DB_PORT"];
const dbDatabase = process.env["DB_DATABASE"];

const srvPort = process.env["SRV_PORT"];

export class Main {
    database: DatabaseMethods.Database;

    routesModule: Routes;
    apiModule: API;

    private app = express();

    constructor() {
        this.database = new DatabaseMethods.Database(
            dbUsername,
            dbPassword,
            dbPort,
            dbDatabase);


        this.database.onConnection = () => {
            this.routesModule = new Routes(this);
            this.apiModule = new API(this);

            this.app.use(bodyParser.urlencoded({ extended: true }));
            this.app.use(bodyParser.json());
            this.app.use(cookieParser());

            this.app.use(express.static(join(__dirname, "public")));
            this.app.use(this.routesModule.routes);
            this.app.use("/api", this.apiModule.routes);

            this.startServer();
        };

        this.database.onFail = () => {
            this.startTempServer();
        };
    }

    startServer() {
        console.log("Starting server");

        this.app.listen(srvPort, () => {
            console.log(`Listening on port ${srvPort}`);
        });
    }

    startTempServer() {
        console.log("Starting (temp) server");

        this.app.listen(srvPort, () => {
            console.log(`Listening on port ${srvPort}`);
        });

        this.app.all("*", (req, res) => {
            res.send("Database connection failed. Server could not start");
        });
    }
}

new Main();