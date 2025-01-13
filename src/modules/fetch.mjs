import cacheModule from '../cache.mjs';

import { BotDatabase  } from '../classes.mjs';

import { Interaction  } from 'discord.js';
import Mongo from 'mongodb';

import fs from 'node:fs';
import path from 'path';

import resolve from './resolve.mjs';
import SysAssets from '../assets.json' with { type: 'json' };
import SysSettings from '../settings.json' with { type: 'json' };

export default {
    /**
     * 
     * @param {string} err Error message
     * @param {Interaction} interaction Command interaction
     * @param {typeof SysAssets} assets Assets object
     * 
     * @returns {void} Error log
     */
    interactionError: async (err, interaction, assets) => {
        if (err && interaction) {
            try {
                await interaction.reply({
                    "content": `> ${assets.icons.xmark} | **${interaction.user?.username}** - An error occurred.`,
                    "ephemeral": true,
                });

                console.error(err);
                return;
            } catch (error) {
                console.error(err);
                console.error(error);
                return;
            };
        } else {
            return;
        };
    },

    /**
     * 
     * @param {string} server ID of the server
     * 
     * @returns {typeof SysSettings | void} Fetched server settings object
     */
    fetchGuild: (server) => {
        if (server) {
            try {
                const res = cacheModule.fetch(server);
                return res;
            } catch (err) {
                console.error(err);
                return;
            };
        } else {
            return;
        };
    },

    /**
     * 
     * @param {Interaction} interaction Command interaction
     * @param {typeof SysAssets} assets Assets object
     * 
     * @returns {Promise<void>} BotDatabase operation
     */
    databaseErrorResponse: async (interaction, assets) => {
        if (interaction && assets) {
            try {
                if (interaction.isChatInputCommand()) {
                    await interaction.reply({
                        "content": "",
                        "embeds": [
                            {
                                "title": `${assets.icons.xmark} | Server not registered`,
                                "description": `Due to an internal error, this server has not yet been registered in our database. You can fix this by using \`/reload\`.`,
                                "color": assets.colors.secondary,
                            },
                        ],
                        "ephemeral": true,
                    });

                    return;
                } else {
                    return;
                };
            } catch (err) {
                console.error(err);
                return;
            };
        } else {
            return;
        };
    },

    /**
     * 
     * @param {Interaction} interaction Command interaction 
     * @param {typeof SysAssets} assets Assets object
     * 
     * @returns {Promise<void>} Command response
     */
    commandErrorResponse: async (interaction, assets) => {
        if (interaction && assets) {
            try {
                if (interaction.isChatInputCommand()) {
                    if (interaction.replied) {
                        return await interaction.followUp({
                            "content": null,
                            "embeds": [
                                {
                                    "title": `${assets.icons.xmark} | Command Error`,
                                    "description": `Due to an internal error, this command could not be fetched, or has not been properly executed. We apologize.`,
                                    "color": assets.colors.secondary,
                                },
                            ],
                        });
                    } else {
                        return await interaction.reply({
                            "content": null,
                            "embeds": [
                                {
                                    "title": `${assets.icons.xmark} | Command Error`,
                                    "description": `Due to an internal error, this command could not be fetched, or has not been properly executed. We apologize.`,
                                    "color": assets.colors.secondary,
                                },
                            ],
                        });
                    }
                } else {
                    return null;
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
     * @param {BotDatabase} db Class of the bot's database
     * @param {string} server ID of the server
     * 
     * @returns {Promise<typeof SysSettings> | void} BotDatabase operation
     */
    reviseGuild: async (db, server) => {
        if (server) {
            try {
                console.log(`Step 1 | Initializing entry scan for ${server}`);

                /**
                 * 
                 * @param {string} server 
                 * 
                 * @returns {typeof SysSettings | null}
                 */
                const check = (server) => {
                    let result = null;

                    const guild = cacheModule.fetch(server);

                    if (guild) {
                        result = guild;
                    };

                    return result;
                };

                let thisGuild = check(server);

                console.log(`Step 2 | Check if server exists in cache.`);
                if (thisGuild) {
                    console.log(`Step 3 | Server exists in cache, data object preserved.`);
                    console.debug(`Server ${thisGuild.server} found!`);
                } else {
                    try {
                        console.log(`Step 3 | Server doesn't exist in cache, creating new save data object.`);
                        console.debug(`Connecting to database...`);

                        const dbClient = new Mongo.MongoClient(db.mongo_uri);

                        const database = dbClient.db("Bloqbit");
                        const collection = database.collection("servers");

                        const foundServer = await collection.findOne({ server: server });

                        console.debug(`Checking if save data for server ${server} exists...`);

                        console.log(`Step 4 | Check if server exists in database.`);
                        if (foundServer) {
                            console.log(`Step 5 | Server exists in database, copying save data.`);
                            console.debug(`Data for server ${server} exists, duplicating save...`);

                            thisGuild = resolve.deepCopySettings(foundServer);

                            console.debug(`Data successfully saved.`);
                        } else {
                            console.log(`Step 5 | Server doesn't exist in database, creating new save.`);
                            console.debug(`Data for server ${server} does not exist, assigning new default settings...`);

                            const defaultSettings = SysSettings;
                            defaultSettings.server = server;

                            thisGuild = defaultSettings;
                            await collection.insertOne(thisGuild);

                            console.debug(`Data successfully saved.`);
                        };
                    } catch (err) {
                        console.error(err);
                    };

                    console.log(`Step 6 | Updating cache.`);

                    const final = cacheModule.update(thisGuild, db);
                    return final;
                };
            } catch (err) {
                console.error(err);
                return null;
            };
        } else {
            return null;
        };
    },
};