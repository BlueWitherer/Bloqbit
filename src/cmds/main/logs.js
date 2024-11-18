const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const BotDatabase = require("../../classes/Database.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');
const fetch = require("../../modules/fetch.js");

module.exports = {
    premium: false,
    cooldown: 0,
    data: new SlashCommandBuilder()
        .setName("logs")
        .setDescription("Set up server logs.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((c) => c
            .setName("config")
            .setDescription("Adjust the general settings of the module per your server's needs.")
            .addBooleanOption((o) => o
                .setName("enabled")
                .setDescription("Toggle logging module.")
                .setRequired(true))
            .addChannelOption((o) => o
                .setName("channel")
                .setDescription("Set the channel in which server-wide actions will be logged.")
                .addChannelTypes([ChannelType.GuildText, ChannelType.GuildVoice])))
        .addSubcommand((c) => c
            .setName("action_type")
            .setDescription("Configure whether or not a certain type of action should be logged and where it'll be logged.")
            .addStringOption((o) => o
                .setName("action")
                .setDescription("The type of action that will be logged.")
                .addChoices(
                    {
                        name: "Auto-moderator",
                        value: "automod",
                    },
                    {
                        name: "Moderator",
                        value: "mod",
                    },
                    {
                        name: "Server invites",
                        value: "serverInv",
                    },
                    {
                        name: "Member joins",
                        value: "memJoin",
                    },
                    {
                        name: "Member leaves",
                        value: "memLeave",
                    },
                    {
                        name: "Member timed out",
                        value: "memTimeout",
                    },
                    {
                        name: "Member banned",
                        value: "memBan",
                    },
                    {
                        name: "Member nickname updated",
                        value: "memNickname",
                    },
                    {
                        name: "Message deleted",
                        value: "msgDel",
                    },
                    {
                        name: "Message edited",
                        value: "msgUpd",
                    },
                    {
                        name: "Message pinned",
                        value: "msgPin",
                    },
                    {
                        name: "Messages bulk deleted",
                        value: "msgBulkDel",
                    },
                    {
                        name: "All reactions removed from message",
                        value: "remAllReact",
                    },
                    {
                        name: "Role created",
                        value: "rolesAdd",
                    },
                    {
                        name: "Role deleted",
                        value: "rolesRem",
                    },
                    {
                        name: "Role assigned",
                        value: "rolesAssign",
                    },
                    {
                        name: "Role taken",
                        value: "rolesUnassign",
                    },
                    {
                        name: "Channel created",
                        value: "channelAdd",
                    },
                    {
                        name: "Channel deleted",
                        value: "channelRem",
                    },
                )
                .setRequired(true))
            .addBooleanOption((o) => o
                .setName("enabled")
                .setDescription("Toggle detection of this action.")
                .setRequired(true))
            .addChannelOption((o) => o
                .setName("channel")
                .setDescription("Set the channel in which this action will be logged.")
                .addChannelTypes([ChannelType.GuildText, ChannelType.GuildVoice]))),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction The interaction for the slash command.
     * @param {typeof SysAssets} assets The configuration of the client's visual assets.
     * @param {typeof SysSettings} system The settings model for the bot's configuration.
     * @param {BotDatabase} db The database information.
     * @returns {void}
     */
    execute: async (interaction, assets, system, db) => {
        return await interaction.reply({
            "content": "Command is W.I.P.!",
            "ephemeral": true,
        });
    },
};