const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

class BotDatabase {
    constructor() {
        this.mongo_uri = process.env.MONGO_URI;
    };
};

module.exports = BotDatabase;