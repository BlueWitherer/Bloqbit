const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const { BotDatabase } = require("../../classes.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName("nickname")
        .setDescription("Modify a user's nickname.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addSubcommand((c) => c
            .setName("set")
            .setDescription("Change someone's nickname.")
            .addUserOption((u) => u.setName("user").setDescription("The user whose nicname to change.").setRequired(true))
            .addStringOption((s) => s.setName("name").setDescription("The nickname to change to.").setRequired(true)))
        .addSubcommand((c) => c
            .setName("block")
            .setDescription("Block a user from having their name displayed publicly.")
            .addUserOption((u) => u.setName("user").setDescription("The user whose nickname to block.").setRequired(true))
            .addStringOption((s) => s.setName("reason").setDescription("The reason to block this name.").setRequired(true)))
        .addSubcommand((c) => c
            .setName("unblock")
            .setDescription("Unblock a user's name.")
            .addUserOption((u) => u.setName("user").setDescription("The user whose name to unblock.").setRequired(true)))
        .addSubcommand((c) => c
            .setName("view")
            .setDescription("View a user's blocked name.")
            .addUserOption((u) => u.setName("user").setDescription("The user whose blocked name to view.").setRequired(true)))
        .addSubcommand((c) => c
            .setName("reset")
            .setDescription("Reset a user's nickname.")
            .addUserOption((u) => u.setName("user").setDescription("The user whose nickname to reset.").setRequired(true))),
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
        const date = Math.floor(Date.now() / 1000);
        const Member = interaction.options?.getMember("user");

        if (Member?.permissions.has([PermissionFlagsBits.ManageNicknames])) {
            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "description": `${assets.icons.xmark} | You cannot moderate another moderator.`,
                        "color": assets.colors.primary,
                    },
                ],
                "ephemeral": true,
            });
        };

        if (interaction.options?.getSubcommand() === "block") {
            const user = interaction.options?.getUser("user", true);
            const Member = interaction.options?.getMember("user");
            const reason = interaction.options?.getString("reason", true);

            await Member.setNickname(system);

            await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": `${interaction.user?.username}`,
                            "icon_url": `${interaction.user?.displayAvatarURL({ "forceStatic": false, size: 1024 })}`
                        },
                        "title": `${assets.icons.check} | Username Blocked`,
                        "color": assets.colors.primary,
                        "fields": [
                            {
                                "name": "User",
                                "value": user.username,
                                "inline": false,
                            },
                            {
                                "name": "Reason",
                                "value": reason,
                                "inline": true,
                            },
                            {
                                "name": "Moderator",
                                "value": `<@!${interaction.user?.id}>`,
                                "inline": false,
                            },
                        ],
                    },
                ],
            });

            await user.send({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": `${user.username}`,
                            "icon_url": `${user.displayAvatarURL({ "forceStatic": false, size: 1024 })}`
                        },
                        "title": `${assets.icons.exclamation} | Username Blocked`,
                        "description": `Content in your nickname has been viewed by our moderators as rule-breaking and have blocked it. Please abide by our [rules](https://discord.com/channels/460081436637134859/460082070673424386/882029054033793025) to keep CS a safe and friendly environment for our users.`,
                        "color": assets.colors.primary,
                        "fields": [
                            {
                                "name": "Reason",
                                "value": reason,
                                "inline": true,
                            },
                            {
                                "name": "Reviewed",
                                "value": `<t:${date}:F> • <t:${date}:R>`,
                                "inline": false,
                            },
                        ],
                    },
                ],
            }).catch(() => {
                return;
            });
        } else if (interaction.options?.getSubcommand() === "view") {
            const user = interaction.options?.getUser("user");

            // TODO: Fetch all info from database

            let mod;
            let displayed;
            let reason;

            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": `${interaction.user?.username}`,
                            "icon_url": `${interaction.user?.displayAvatarURL({ "forceStatic": false, size: 1024 })}`
                        },
                        "title": `${assets.icons.info} | ${user?.username}'s Blocked Username`,
                        "color": assets.colors.primary,
                        "fields": [
                            {
                                "name": "Reason",
                                "value": reason,
                                "inline": false,
                            },
                            {
                                "name": "Previously Displayed As",
                                "value": `||${displayed}||`,
                                "inline": false,
                            },
                            {
                                "name": "Moderator",
                                "value": `<@!${mod.user?.id}>`,
                                "inline": false,
                            },
                        ],
                    },
                ],
            });
        } else if (interaction.options?.getSubcommand() === "unblock") {
            const user = interaction.options?.getUser("user");
            const Member = interaction.options?.getMember("user");

            await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": `${interaction.user?.username}`,
                            "icon_url": `${interaction.user?.displayAvatarURL({ forceStatic: false, size: 1024 })}`,
                        },
                        "fields": [
                            {
                                "name": "User",
                                "value": `${user?.username}`,
                                "inline": false,
                            },
                            {
                                "name": "Moderator",
                                "value": `<@!${interaction.user?.id}>`,
                                "inline": false,
                            },
                        ],
                    },
                ],
            });

            await user?.send({
                "content": "",
                "embeds": [
                    {
                        "description": `${assets.icons.info} | Your name has been unblocked. Have fun!`,
                        "color": assets.colors.primary,
                    },
                ],
            });
        } else if (interaction.options?.getSubcommand() === "set") {
            const user = interaction.options?.getUser("user");
            const Member = interaction.options?.getMember("user");
            const name = interaction.options?.getString("name");

            await Member?.setNickname(name);

            await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "description": `${assets.icons.check} | Set **${user?.username}**'s nickname.`,
                        "color": assets.colors.primary,
                    },
                ],
            });
        } else if (interaction.options?.getSubcommand() === "reset") {
            const user = interaction.options?.getUser("user");
            const Member = interaction.options?.getMember("user");

            await Member?.setNickname(null);

            await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "description": `${assets.icons.check} | Reset **${user?.username}**'s nickname.`,
                        "color": assets.colors.primary,
                    },
                ],
            });
        };
    },
};