const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const BotDatabase = require("../../classes/Database.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user.")
        .addUserOption(option => option.setName("user").setDescription("User to kick.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Reason for kick.").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction The interaction for the slash command.
     * @param {typeof SysAssets} assets The configuration of the client's visual assets.
     * @param {typeof SysSettings} system The settings model for the bot's configuration.
     * @param {BotDatabase} db The database information.
     * @returns {void}
     */
    execute: async (interaction, assets, system, db) => {
        const kickreason = interaction.options?.getString("reason");
        const User = interaction.options?.getUser("user");
        const Member = interaction.options?.getMember("user");

        if (Member.permissions.has([PermissionFlagsBits.KickMembers])) {
            return await interaction.reply({
                "content": null,
                "embeds": [
                    {
                        "description": `${assets.icons.xmark} | You cannot kick another moderator.`,
                        "color": assets.colors.primary,
                    },
                ],
                "ephemeral": true,
            });
        };

        return interaction.guild?.members?.kick(User.id, `${interaction.user?.username} | Kick - ${kickreason}`).catch((err) => {
            interaction.reply({
                "content": `> ${assets.icons.xmark} | **${interaction.user?.username}** - An error occurred.`,
                "ephemeral": true,
            });
            console.log(err);
        }).then(() => {
            interaction.reply({
                "content": null,
                "embeds": [
                    {
                        "author": {
                            "name": `${interaction.user?.username}`,
                            "icon_url": `${interaction.user?.displayAvatarURL({ "forceStatic": false, size: 1024 })}`
                        },
                        "title": `${assets.icons.noentry} | User Kicked`,
                        "color": `${assets.colors.primary}`,
                        "fields": [
                            {
                                "name": "User",
                                "value": `**${User.username}**`,
                                "inline": true,
                            },
                            {
                                "name": "Moderator",
                                "value": `**${interaction.user?.username}**`,
                                "inline": true,
                            },
                            {
                                "name": "Reason",
                                "value": `${kickreason}`,
                                "inline": false,
                            },
                        ],
                    },
                ],
            });
        }).then(() => {
            User.send({
                "content": null,
                "embeds": [
                    {
                        "author": {
                            "name": `${User.username}`,
                            "icon_url": `${User.displayAvatarURL({ "forceStatic": false, size: 1024 })}`
                        },
                        "title": `${assets.icons.noentry} | Kicked`,
                        "description": `Our community moderators have determined that your behavior on CS has been in violation of our rules.`,
                        "color": assets.colors.primary,
                        "fields": [
                            {
                                "name": `Reason`,
                                "value": `${kickreason}`,
                                "inline": false,
                            },
                            {
                                "name": `Reviewed`,
                                "value": `<t:${new Date().getDate() / 1000}:F>`,
                                "inline": false,
                            },
                            {
                                "name": `Appeal`,
                                "value": `Rejoin whenever you feel most comfortable`,
                                "inline": true,
                            },
                        ],
                        "footer": {
                            "text": `Please abide by our rules to keep our community friendly to everyone.`,
                        },
                    },
                ],
            }).catch(() => {
                return;
            });
        });
    },
};