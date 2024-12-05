const { ClientModel, BotDatabase, MessageHandler } = require("./classes.js");

const Discord = require("discord.js");
const { Routes } = require("discord-api-types/v9");

const fs = require("node:fs");
const dotenv = require("dotenv");
const path = require("path");
const fetch = require("./modules/fetch.js");

dotenv.config();

class StartClient {
    /**
     * 
     * @returns {ClientModel}
     */
    constructor() {
        return this;
    };

    /**
     * 
     * @param {ClientModel} botModel Bot data model.
     * @param {boolean} testMode If the login is only being tested.
     * 
     * @returns {Promise<ClientModel>}
     */
    activate = async (botModel, testMode) => {
        botModel.client.on(Discord.Events.ClientReady, async (client) => {
            client.user?.setPresence({
                "activities": [
                    {
                        "name": `chat`,
                        "state": `Active across ${client.guilds.cache.size} servers!`,
                        "type": Discord.ActivityType.Streaming,
                        "url": `https://www.youtube.com/@CubicCommunity/`,
                    }
                ],
                "afk": false,
                "status": Discord.PresenceUpdateStatus.DoNotDisturb,
            });

            try {
                const foldersPath = path.join(__dirname, 'cmds');
                const commandFolders = fs.readdirSync(foldersPath);

                for (const folder of commandFolders) {
                    const commandsPath = path.join(foldersPath, folder);
                    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

                    for (const file of commandFiles) {
                        const filePath = path.join(commandsPath, file);
                        const command = require(filePath);

                        if ('data' in command && 'execute' in command) {
                            botModel.commands.push(command.data.toJSON());
                        } else {
                            console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
                        };

                        botModel.cmds.set(command.data.name, command);
                    };
                };

                (async () => {
                    try {
                        console.log(`Started refreshing ${botModel.commands.length} application (/) commands.`);

                        const data = await botModel.rest.put(
                            Routes.applicationCommands(client?.user?.id),
                            { body: botModel.commands, },
                        );

                        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
                    } catch (error) {
                        return console.error(error);
                    };
                })();
            } catch (error) {
                console.error(error);
                process.exit(1);
            };

            try {
                const eventsPath = path.join(__dirname, 'events');
                const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

                for (const file of eventFiles) {
                    try {
                        const filePath = path.join(eventsPath, file);
                        const event = require(filePath);

                        if (event.once) {
                            client?.once(event.name, async (...args) => {
                                try {
                                    return await event.execute(botModel, ...args);
                                } catch (error) {
                                    return console.error(error);
                                };
                            });
                        } else {
                            client?.on(event.name, async (...args) => {
                                try {
                                    return await event.execute(botModel, ...args);
                                } catch (error) {
                                    return console.error(error);
                                };
                            });
                        };

                        console.debug(`Loaded event listener for ${event.name}.`);
                    } catch (error) {
                        return console.error(error);
                    };
                };

                const clientGuilds = await botModel.client.guilds.fetch();

                for (const inGuild of clientGuilds) {
                    const inCache = fetch.fetchGuild(inGuild[1].id);

                    if (inCache) {
                        console.log(inCache.server);
                    } else {
                        const thisGuild = await fetch.reviseGuild(botModel.db, inGuild[1].id);

                        console.log(thisGuild?.server);
                    };
                };

                console.debug("Starting handlers...");
                new MessageHandler(client);

                const devWH = new Discord.WebhookClient({ "url": botModel.dev_wh, });

                await devWH.send({
                    "avatarURL": client.user?.displayAvatarURL({ "forceStatic": true, "size": 512 }),
                    "content": "",
                    "embeds": [
                        {
                            "author": {
                                "name": `Service Status`,
                            },
                            "description": `${botModel.assets.icons.check} | **${client.user?.displayName}** is now __online__.`,
                            "color": botModel.assets.colors.primary,
                            "footer": {
                                "text": client.user?.username,
                                "icon_url": client.user?.displayAvatarURL({ "forceStatic": false, "size": 512 }),
                            },
                        },
                    ],
                });

                botModel.online = true;
                console.log(`Bot user ${client.user?.username} is online.`);
            } catch (err) {
                console.error(err);
                process.exit(1);
            };

            if (testMode) {
                console.warn("Test mode active.");
                console.debug("All bot start-up operations successful. No fatal errors detected. Logging off...");

                await client.destroy();
                process.exit(0);
            };
        });

        await botModel.client?.login(botModel.token);
        return botModel;
    };

    /**
     * 
     * @param {Number} x 
     * 
     * @returns {string}
     */
    numberWithCommas(x) {
        try {
            if (Number.isSafeInteger(x)) {
                const numString = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                console.debug(numString);
                return numString;
            } else {
                console.error(`${x} is not a number.`);
                return "0";
            };
        } catch (err) {
            console.error(err);
            return "0";
        };
    };
};

module.exports = StartClient;