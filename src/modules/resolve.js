const { Embed, EmbedBuilder } = require("discord.js");
const cacheModule = require("../cache.js");
const { ModActionType, FilterMode } = require("../classes.js");

const SysSettings = require("../settings.json");

module.exports = {
    /**
     * 
     * @param {object} obj The object to copy from
     * 
     * @returns {typeof SysSettings} The new object with the values copied to it
     */
    deepCopySettings: (obj) => {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        };

        const objCopy = cacheModule.create();

        for (const key in obj) {
            objCopy[key] = obj[key];
        };

        return objCopy;
    },

    /**
     * 
     * @param {array} array The array 
     * @param {any} value The value to query
     * 
     * @returns {array | void} The array with the value removed
     */
    removeArrayItem: (array, value) => {
        if (array && value !== null) {
            try {
                index = array.indexOf(value);

                if (index > -1) {
                    array.splice(index, 1);
                    return array;
                } else {
                    return array;
                };
            } catch (err) {
                return console.error(err);
            };
        } else {
            return [];
        };
    },

    /**
     * 
     * @param {number} number Number
     * 
     * @returns {boolean | null} Boolean from number
     */
    boolNumber: (number) => {
        if (number <= 0 || number >= 1) {
            try {
                if (number > 0) {
                    return true;
                } else {
                    return false;
                };
            } catch (err) {
                return console.error(err);
            };
        } else {
            return null;
        };
    },

    /**
     * 
     * @param {boolean} bool Boolean
     * 
     * @returns {number} Number from boolean
     */
    numberBool: (bool) => {
        bool = Boolean(bool);

        if (bool === true || bool === false) {
            try {
                if (bool) {
                    return 1;
                } else {
                    return 0;
                };
            } catch (err) {
                return console.error(err);
            };
        } else {
            return -1;
        };
    },

    /**
     * 
     * @param {string} string String JSON
     * 
     * @returns {any} JSON object
     */
    parseJson: (string) => {
        if (string) {
            try {
                return JSON.parse(string);
            } catch (err) {
                return console.error(err);
            };
        } else {
            return {};
        };
    },

    /**
     * 
     * @param {any} parsed JSON object
     * 
     * @returns {string} Parsed JSON object
     */
    stringJson: (parsed) => {
        if (parsed) {
            try {
                return JSON.stringify(parsed);
            } catch (err) {
                return console.error(err);
            };
        } else {
            return "";
        };
    },

    /**
     * 
     * @param {string} name Title of the warning
     * @param {string} description Description of the warning
     */
    msgWarning: (name, description) => {
        try {
            return {
                name: name,
                value: description,
            };
        } catch (err) {
            console.error(err);

            return {
                name: "Error",
                value: "An internal error occurred.",
            };
        };
    },

    /**
     * 
     * @param {number} value Punishment level
     * @param {{ name: string, value: string }} object Discord embed field
     */
    warnObj: (value, object) => {
        try {
            return {
                punishment: Number(value),
                warning: {
                    name: string(object.name),
                    value: string(object.value),
                },
            };
        } catch (err) {
            console.error(err);

            return {
                punishment: 0,
                warning: {
                    name: "Error",
                    value: "An internal error occurred.",
                },
            };
        };
    },

    /**
     * 
     * @param {number} punish Punishment ID.
     * 
     * @returns {string} Punishment name.
     */
    punishmentType: (punish) => {
        switch (punish) {
            case ModActionType.Ban:
                return "ban";

            case ModActionType.Softban:
                return "softban";

            case ModActionType.Kick:
                return "kick";

            case ModActionType.Blacklist:
                return "blacklist";

            case ModActionType.Timeout:
                return "timeout";

            case ModActionType.Mute:
                return "mute";

            case ModActionType.Warn:
                return "warn";

            case ModActionType.None:
                return "none";

            default:
                return "none";
        };
    },

    /**
     * 
     * @param {number} mode Filter mode ID.
     * 
     * @returns {string} Filter mode name.
     */
    filterMode: (mode) => {
        switch (mode) {
            case FilterMode.Include:
                return "include";

            case FilterMode.Exclude:
                return "exclude";

            default:
                return "exclude";
        };
    },

    /**
     * 
     * @param {boolean} bool Boolean
     * 
     * @returns {string} "enabled" or "disabled"
     */
    abled: (bool) => {
        if (bool) {
            return "enabled";
        } else {
            return "disabled";
        };
    },

    /**
     * 
     * @param {number} number Amount.
     * @param {string} singular Singular word.
     * @param {string} plural Plural word.
     * 
     * @returns {string} Singular or plural based on amount.
     */
    isPlural: (number, singular, plural) => {
        if (number < 1 || 1 < number) {
            return plural;
        } else {
            return singular
        };
    },
};