const { MongoClient } = require("mongodb");
const { BotDatabase } = require("./classes");
const SysSettings = require("./settings.json");

/**
 * @type {[typeof SysSettings]} Array of cache server settings
 */
const cache = [];

module.exports = {
    /**
     * 
     * @returns {[typeof SysSettings]} Array of cache server settings
     */
    get: () => {
        return cache;
    },

    /**
     * 
     * @param {string} server Server ID for query
     * 
     * @returns {typeof SysSettings | void} Queried settings object
     */
    fetch: (server) => {
        if (server) {
            if (cache.length) {
                return cache.find((s) => s.server === server);
            } else {
                console.error(`[X] Cached settings object not available.`);
                return;
            };
        } else {
            console.error(`[X] Query ID not provided.`);
            return;
        };
    },

    /**
     * 
     * @param {typeof SysSettings} system Object for query
     * @param {BotDatabase} db Bot database model
     * 
     * @returns {Promise<typeof SysSettings | void>} New settings object
     */
    update: async (system, db) => {
        if (system) {
            try {
                console.debug(`[I] Looking if object for server ${system.server} already exists...`);

                const foundObj = cache.findIndex((so) => {
                    console.debug(`[...] Comparing cached object ${so.server} with query object ${system.server}...`);
                    return system.server === so.server;
                });

                if (foundObj >= 0) {
                    console.warn(`[II] Settings object for server ${system.server} exists at index ${foundObj}, replacing...`);

                    cache[foundObj] = system;
                    console.debug(`[O] Data for server ${cache[foundObj].server} updated.`);
                } else {
                    console.info(`[II] Settings object for ${system.server} not found, creating new object...`);

                    const newSize = cache.push(system);
                    console.debug(`[O] Data for server ${system.server} updated. Cache size ${newSize}.`);
                };

                const dbClient = new MongoClient(db.mongo_uri);

                const database = dbClient.db("Bloqbit");
                const collection = database.collection("servers");

                await collection.updateOne({ server: system.server }, system);

                return system;
            } catch (err) {
                console.error(err);
                return;
            };
        } else {
            console.error(`[X] Query object not provided.`);
            return;
        };
    },

    /**
     * 
     * @returns {typeof SysSettings}
     */
    create: () => {
        console.debug(`[...] Creating new settings object...`);
        return JSON.parse(JSON.stringify(SysSettings));
    },

    SysSettings,
};