import SysAssets from '../../assets.json' with { type: 'json' };
import SysSettings from '../../settings.json' with { type: 'json' };
import { BotDatabase  } from '../../classes.mjs';
import { ChatInputCommandInteraction  } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits  } from 'discord-api-types/v10';
import fetch from '../../modules/fetch.mjs';

export default {
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
     * 
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
        } finally {
            if (system.logs.enabled && system.logs.actions.moderator) {
                /**
                 * @type {import("discord.js").TextChannel} Logging channel.
                 */
                const logChannel = await interaction.guild?.channels?.fetch(system.logs.channel);
                const date = Math.floor(Date.now() / 1000);

                if (logChannel) {
                    await logChannel.send({
                        "content": "",
                        "embeds": [
                            {
                                "author": {
                                    "name": "Moderation Action",
                                },
                                "description": `**${interaction.user?.username}** has made a moderation action on \`${User.username}\``,
                                "color": assets.colors.terciary,
                                "fields": [
                                    {
                                        "name": "Type",
                                        "value": `Ban`,
                                        "inline": true,
                                    },
                                    {
                                        "name": "Reason",
                                        "value": `${banreason}`,
                                        "inline": true,
                                    },
                                    {
                                        "name": "Action Time",
                                        "value": `<t:${date}:F> • <t:${date}:R>`,
                                        "inline": false,
                                    },
                                ],
                                "footer": {
                                    "text": interaction.user?.username,
                                    "icon_url": interaction.user?.displayAvatarURL({ "forceStatic": false, "size": 128 }),
                                },
                            },
                        ],
                    });
                };
            };
        };
    },
};