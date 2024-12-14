const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const { BotDatabase, FilterMode, ModActionType, FilterClass } = require("../../classes.js");
const { ChatInputCommandInteraction, Role, BaseChannel } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');
const fetch = require("../../modules/fetch.js");
const resolve = require("../../modules/resolve.js");
const cache = require("../../cache.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription("View a filter list.")
        .addStringOption((s) => s
            .setName("filter")
            .setDescription("Filter to check.")
            .addChoices([
                {
                    name: "Swear Words",
                    value: FilterClass.Swear,
                },
                {
                    name: "External Links",
                    value: FilterClass.Link,
                },
                {
                    name: "Server Invites",
                    value: FilterClass.Invite,
                },
                {
                    name: "Duplicate Text",
                    value: FilterClass.DupeText,
                },
                {
                    name: "Mass Mentions",
                    value: FilterClass.MassMention,
                },
            ])
            .setRequired(true))
        .addBooleanOption((b) => b
            .setName("show-response")
            .setDescription("Do not hide this message to allow everyone in this channel to see it as well."))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
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
        return await interaction.reply({
            "content": "Command in W.I.P.!",
            "ephemeral": true,
        });
    },
};