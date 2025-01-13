import dotenv from 'dotenv';

dotenv.config();

/**
 * @class Bot database settings model.
 */
class BotDatabase {
    constructor() {
        this.mongo_uri = process.env.MONGO_URI;

        return this;
    };
};

module.exports = BotDatabase;