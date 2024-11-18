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
     * @param {typeof SysSettings} obj Object for query
     * 
     * @returns {typeof SysSettings | void} New settings object
     */
    update: (obj) => {
        if (obj) {
            console.debug(`[I] Looking if object for server ${obj.server} already exists...`);

            const foundObj = cache.findIndex((so) => {
                console.debug(`[...] Comparing cached object ${so.server} with query object ${obj.server}...`);
                return obj.server === so.server;
            });

            if (foundObj >= 0) {
                console.warn(`[II] Settings object for server ${obj.server} exists at index ${foundObj}, replacing...`);

                cache[foundObj] = obj;
                console.debug(`[O] Data for server ${cache[foundObj].server} updated.`);
            } else {
                console.info(`[II] Settings object for ${obj.server} not found, creating new object...`);

                const newSize = cache.push(obj);
                console.debug(`[O] Data for server ${obj.server} updated. Cache size ${newSize}.`);
            };

            return obj;
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
};