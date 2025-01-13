import SysAssets from '../../assets.json' with { type: 'json' };
import SysSettings from '../../settings.json' with { type: 'json' };
import { BotDatabase  } from '../../classes.mjs';
import { ChatInputCommandInteraction  } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType, PermissionFlagsBits } from 'discord-api-types/v10';

export default {
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