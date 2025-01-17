import SysAssets from '../../assets.json' with { type: 'json' };
import SysSettings from '../../settings.json' with { type: 'json' };
import { BotDatabase  } from '../../classes.mjs';
import { ChatInputCommandInteraction  } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType, PermissionFlagsBits } from 'discord-api-types/v10';

export default {
    premium: true,
    data: new SlashCommandBuilder()
        .setName("soft-ban")
        .setDescription("Softban a user.")
        .addUserOption(option => option.setName("user").setDescription("User to softban.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Reason for softban.").setRequired(true))
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

        if (Member.permissions.has([PermissionFlagsBits.BanMembers])) {
            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "description": `${assets.icons.xmark} | You cannot softban another moderator.`,
                        "color": assets.colors.primary,
                    },
                ],
                "ephemeral": true,
            });
        };

        return await interaction.guild?.members?.ban(User?.id, {
            deleteMessageSeconds: 7 * 86400,
            reason: `${interaction.user?.username} | Softban - ${banreason}`
        }).then(async () => {
            await interaction.guild?.members?.unban(User?.id, `${interaction.user?.username} | Softban - ${banreason}`);
        }).catch(async (err) => {
            await interaction.reply({
                "content": `> ${assets.icons.xmark} | **${interaction.user?.username}** - An error occurred.`,
                "ephemeral": true,
            });
            console.log(err);
        }).then(async () => {
            await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": `${interaction.user?.username}`,
                            "icon_url": `${interaction.user?.displayAvatarURL({ "forceStatic": false, size: 1024 })}`
                        },
                        "title": `${assets.icons.noentry} | User Softbanned`,
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
                        "title": `${assets.icons.noentry} | Soft-banned`,
                        "description": `You were __soft-banned__ from **${interaction.guild?.name}**.`,
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
                            {
                                "name": `Appeal`,
                                "value": `Rejoin whenever you feel most comfortable`,
                                "inline": true,
                            },
                        ],
                    },
                ],
            }).catch(() => {
                return;
            });
        });
    },
};