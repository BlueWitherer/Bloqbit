import SysAssets from '../../assets.json' assert { type: 'json' };
import SysSettings from '../../settings.json' assert { type: 'json' };
const { BotDatabase } = require("../../classes.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping the bot, test its latency."),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction The interaction for the slash command.
     * @param {typeof SysAssets} assets The configuration of the client's visual assets.
     * @param {typeof SysSettings} system The settings model for the bot's configuration.
     * @param {BotDatabase} db The database information.
     * 
     * @returns {void}
     */
    execute: async (interaction, assets, system, db) => {
        return interaction.reply({
            "content": "",
            "ephemeral": true,
            "embeds": [{
                "author": {
                    "name": interaction.user?.username,
                    "icon_url": interaction.user?.displayAvatarURL({ "forceStatic": false, size: 1024 })
                },
                "title": `${assets.icons.info} | Ping`,
                "color": assets.colors.primary,
                "fields": [
                    {
                        "name": `Latency`,
                        "value": `${Date.now() - interaction.createdTimestamp}ms`,
                        "inline": false
                    },
                    {
                        "name": `API Latency`,
                        "value": `${Math.round(interaction.client?.ws.ping)}ms`,
                        "inline": false
                    },
                ],
            }],
        });
    },
};