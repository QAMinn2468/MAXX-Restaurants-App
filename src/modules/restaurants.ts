import * as uuid from "uuid/v1";
import { Main } from "../main";
import { DatabaseMethods } from "./database";

export class Restaurants {
    main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    newRestaurant() {
    }
}

export enum PostType {
    REVIEW = 1,
    COMMENT = 2,
}