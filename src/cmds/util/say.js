import SysAssets from '../../assets.json' assert { type: 'json' };
import SysSettings from '../../settings.json' assert { type: 'json' };
const { BotDatabase } = require("../../classes.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Send a message in a channel.")
        .addStringOption((s) => s
            .setName("message")
            .setDescription("The message to send in the channel.")
            .setRequired(true))
        .addChannelOption((c) => c
            .setName("channel")
            .setDescription("The channel to send a message to.")
            .addChannelTypes([ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildAnnouncement, ChannelType.GuildStageVoice])
            .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
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
        const channel = interaction.options?.getChannel("channel");
        const message = interaction.options?.getString("message");

        if (channel === interaction.channel) {
            await channel?.send({
                "content": "",
                "embeds": [
                    {
                        "description": message,
                        "color": assets.colors.primary,
                    },
                ],
            });

            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "description": `${assets.icons.check} | Message sent.`,
                        "color": assets.colors.primary,
                    },
                ],
                "ephemeral": true,
            });
        } else if (channel) {
            await channel.send({
                "content": "",
                "embeds": [
                    {
                        "description": message,
                        "color": assets.colors.primary,
                    },
                ],
            });

            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "description": `${assets.icons.check} | Message sent in ${channel}.`,
                        "color": assets.colors.primary,
                    },
                ],
            });
        } else if (!channel) {
            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "description": message,
                        "color": assets.colors.primary,
                    },
                ],
            });
        };
    },
};