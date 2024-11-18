const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const BotDatabase = require("../../classes/Database.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');
const fetch = require("../../modules/fetch.js");

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user.")
        .addUserOption((o) => o
            .setName("user")
            .setDescription("User to ban.")
            .setRequired(true))
        .addStringOption((o) => o
            .setName("reason")
            .setDescription("Reason for ban.")
            .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction The interaction for the slash command.
     * @param {typeof SysAssets} assets The configuration of the client's visual assets.
     * @param {typeof SysSettings} system The settings model for the bot's configuration.
     * @param {BotDatabase} db The database information.
     * @returns {void}
     */
    execute: async (interaction, assets, system, db) => {
        const banreason = interaction.options?.getString("reason");

        const User = interaction.options?.getUser("user");
        const Member = interaction.options?.getMember("user");

        if (Member?.permissions.has([PermissionFlagsBits.BanMembers])) {
            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "description": `${assets.icons.xmark} | You cannot ban another moderator.`,
                        "color": assets.colors.primary,
                    },
                ],
                "ephemeral": true,
            });
        };

        try {
            return await interaction.guild?.members?.ban(User?.id, {
                deleteMessageSeconds: 7 * 86400,
                reason: `${interaction.user?.username} | Ban - ${banreason}`
            }).then(async () => {
                await interaction.reply({
                    "content": "",
                    "embeds": [
                        {
                            "author": {
                                "name": `${interaction.user?.username}`,
                                "icon_url": `${interaction.user?.displayAvatarURL({ "forceStatic": false, size: 1024 })}`
                            },
                            "title": `${assets.icons.noentry} | User Banned`,
                            "color": assets.colors.primary,
                            "fields": [
                                {
                                    "name": "User",
                                    "value": `**${User?.username}**`,
                                    "inline": true,
                                },
                                {
                                    "name": "Moderator",
                                    "value": `**${interaction.user?.username}**`,
                                    "inline": true,
                                },
                                {
                                    "name": "Reason",
                                    "value": `${banreason}`,
                                    "inline": false,
                                },
                            ],
                        },
                    ],
                });
            }).then(async () => {
                await User?.send({
                    "content": "",
                    "embeds": [
                        {
                            "author": {
                                "name": `${User.username}`,
                                "icon_url": `${User.displayAvatarURL({ "forceStatic": false, size: 1024 })}`
                            },
                            "title": `${assets.icons.noentry} | Banned`,
                            "description": `You were __banned__ from **${interaction.guild?.name}**.`,
                            "color": assets.colors.primary,
                            "fields": [
                                {
                                    "name": `Reason`,
                                    "value": `${banreason}`,
                                    "inline": false,
                                },
                                {
                                    "name": `Reviewed`,
                                    "value": `<t:${new Date().getDate() / 1000}:F>`,
                                    "inline": false,
                                },
                            ],
                        },
                    ],
                });
            });
        } catch (err) {
            return null;
        };
    },
};