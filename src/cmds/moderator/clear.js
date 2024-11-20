const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const { BotDatabase } = require("../../classes.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear amount of messages in channel.")
        .addNumberOption((n) => n
            .setName("amount")
            .setDescription("Number of messages to clear.")
            .setMinValue(2)
            .setMaxValue(100)
            .setRequired(true))
        .addUserOption((u) => u
            .setName("user")
            .setDescription("User whose messages to clear.")
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
        const amount = interaction.options?.getNumber("amount") || 0;
        const user = interaction.options?.getUser("user");

        const botMember = interaction.guild?.members.cache.get(interaction.client.user?.id);

        if (!user && botMember?.permissions.has("ManageMessages")) {
            const msgs = await interaction.channel?.messages.fetch({
                "limit": amount,
            });

            msgs?.forEach(async (m) => {
                await m.delete();
            });

            await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": interaction.user?.username,
                            "icon_url": interaction.user?.displayAvatarURL({ "forceStatic": false, }),
                        },
                        "title": `${assets.icons.check} | Messages Cleared`,
                        "color": assets.colors.primary,
                        "fields": [
                            {
                                "name": "Amount",
                                "value": `${amount}`,
                                "inline": true,
                            },
                            {
                                "name": "Moderator",
                                "value": `<@!${interaction.user?.id}>`,
                                "inline": true,
                            },
                        ],
                    },
                ],
            });

            setTimeout(async () => {
                return await interaction.deleteReply();
            }, 2500);
        } else if (user) {
            const msgs = [];

            (await interaction.channel?.messages?.fetch({ limit: 100 }))?.filter((m) => m.author?.id === user.id).forEach((mg) => {
                if (msgs.length >= amount) {
                    return msgs;
                };
            });

            await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": interaction.user?.username,
                            "icon_url": interaction.user?.displayAvatarURL({ "forceStatic": false, }),
                        },
                        "title": `${assets.icons.check} | Messages Cleared`,
                        "color": assets.colors.primary,
                        "fields": [
                            {
                                "name": "Amount",
                                "value": `${amount}`,
                                "inline": true,
                            },
                            {
                                "name": "Moderator",
                                "value": `<@!${interaction.user?.id}>`,
                                "inline": true,
                            },
                            {
                                "name": "User",
                                "value": `<@!${user.id}>`,
                                "inline": true,
                            },
                        ],
                    },
                ],
            });

            setTimeout(async () => {
                return await interaction.deleteReply();
            }, 3000);
        };
    },
};