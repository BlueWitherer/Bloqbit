import dotenv from 'dotenv';

dotenv.config();

/**
 * @class Bot database settings model.
 */
export default class BotDatabase {
    constructor() {
        this.mongo_uri = process.env.MONGO_URI;

        return this;
    };
};