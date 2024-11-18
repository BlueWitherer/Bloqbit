const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const BotDatabase = require("../../classes/Database.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    dev: true,
    premium: true,
    data: new SlashCommandBuilder()
        .setName("send")
        .setDescription("Send a message to another user.")
        .addUserOption((o) => o
            .setName("user")
            .setDescription("The user to send the message to.")
            .setRequired(true))
        .addStringOption((o) => o
            .setName("message")
            .setDescription("The message to send to the user.")
            .setRequired(true))
        .addAttachmentOption((o) => o
            .setName("image")
            .setDescription("An image to attach to the message."))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction The interaction for the slash command.
     * @param {typeof SysAssets} assets The configuration of the client's visual assets.
     * @param {typeof SysSettings} system The settings model for the bot's configuration.
     * @param {BotDatabase} db The database information.
     * @returns {void}
     */
    execute: async (interaction, assets, system, db) => {
        const target = interaction.options?.getUser("user", true)
        const sendargs = interaction.options?.getString("message", true);
        const attachment = interaction.options?.getAttachment("image", true);

        if (attachment) {
            return await target.send({
                "content": "",
                "embeds": [
                    {
                        "description": `${sendargs}`,
                        "image": {
                            "url": attachment.url,
                            "proxy_url": attachment.proxyURL,
                        },
                        "color": assets.colors.primary,
                    },
                ],
            }).then(async () => {
                return await interaction.reply({
                    "content": "",
                    "embeds": [
                        {
                            "description": `${assets.icons.check} | Message sent.`,
                            "color": assets.colors.primary,
                        },
                    ],
                });
            }).catch(async () => {
                return await interaction.reply({
                    "content": "",
                    "ephemeral": true,
                    "embeds": [
                        {
                            "description": `${assets.icons.xmark} | **${interaction.user?.username}** - Failed to send message: User has DMs closed or is invalid.`,
                            "color": assets.colors.primary,
                        },
                    ],
                });
            });
        } else {
            return await target.send({
                "content": "",
                "embeds": [
                    {
                        "description": `${sendargs}`,
                        "color": assets.colors.primary,
                    },
                ],
            }).then(async () => {
                return await interaction.reply({
                    "content": "",
                    "embeds": [
                        {
                            "description": `${assets.icons.check} | Message sent.`,
                            "color": assets.colors.primary,
                        },
                    ],
                });
            }).catch(async () => {
                return await interaction.reply({
                    "content": "",
                    "ephemeral": true,
                    "embeds": [
                        {
                            "description": `${assets.icons.xmark} | **${interaction.user?.username}** - Failed to send message: User has DMs closed or is invalid.`,
                            "color": assets.colors.primary,
                        },
                    ],
                });
            });
        };
    },
};