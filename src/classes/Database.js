const dotenv = require("dotenv");
const path = require("path");

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