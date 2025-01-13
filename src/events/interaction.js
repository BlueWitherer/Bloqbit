import ClientModel from '../classes/ClientModel.js';
const { Interaction } = require("discord.js")
import { Events, WebhookClient  } from 'discord.js';
import fetch from '../modules/fetch.js';

export default {
    name: Events.InteractionCreate,
    once: false,
    /**
     * 
     * @param {ClientModel} bot 
     * @param {Interaction} interaction 
     * @returns {void}
     */
    execute: async (bot, interaction) => {
        if (bot.online) {
            bot.assets = require("../assets.json");

            try {
                if (interaction.isChatInputCommand()) {
                    const command = bot.cmds?.get(interaction.commandName);

                    const devWH = new WebhookClient({ url: bot.dev_wh, });
                    const interactionServer = fetch.fetchGuild(interaction.guild?.id);

                    if ((command && interactionServer) || (interaction.commandName === "reload")) {
                        try {
                            if (command.dev) {
                                return;
                            } else {
                                await command.execute(interaction, bot.assets, interactionServer, bot.db);
                            };
                        } catch (err) {
                            console.error(err);
                            if (interaction.replied || interaction.deferred) {
                                await interaction.followUp({ content: `${bot.assets.icons.xmark} | There was an error while executing this command.`, ephemeral: true });
                            } else {
                                await interaction.reply({ content: `${bot.assets.icons.xmark} | There was an error while executing this command.`, ephemeral: true });
                            };
                        } finally {
                            if (devWH) {
                                const date = Math.floor(Date.now() / 1000);

                                await devWH.send({
                                    "avatarURL": interaction.client?.user?.displayAvatarURL({ "forceStatic": true, "size": 128 }),
                                    "content": "",
                                    "embeds": [
                                        {
                                            "author": {
                                                "name": "Interaction",
                                            },
                                            "color": bot.assets.colors.terciary,
                                            "description": `**${interaction.commandName}**`,
                                            "fields": [
                                                {
                                                    "name": "Used At",
                                                    "value": `<t:${date}:F> • <t:${date}:R>`,
                                                    "inline": false,
                                                },
                                            ],
                                            "footer": {
                                                "text": interaction.user?.username,
                                                "icon_url": interaction.user?.displayAvatarURL({ "forceStatic": false, "size": 128 }),
                                            },
                                        },
                                    ],
                                });
                            };
                        };

                        return;
                    } else if (!command) {
                        await fetch.commandErrorResponse(interaction, bot.assets);
                    } else if (!interactionServer) {
                        await fetch.databaseErrorResponse(interaction, bot.assets);
                    } else {
                        if (interaction.replied || interaction.deferred) {
                            await interaction.followUp({ content: `${bot.assets.icons.xmark} | There was an error while executing this command.`, ephemeral: true });
                        } else {
                            await interaction.reply({ content: `${bot.assets.icons.xmark} | There was an error while executing this command.`, ephemeral: true });
                        };

                        return;
                    };
                };
            } catch (err) {
                console.error(err);
                await fetch.commandErrorResponse(interaction, bot.assets);
                return;
            };
        } else {
            return;
        };
    },
};