const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const { BotDatabase, LogEventType } = require("../../classes.js");
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
                .setName("enable")
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
                        value: LogEventType.AutoModerator,
                    },
                    {
                        name: "Moderator",
                        value: LogEventType.Moderator,
                    },
                    {
                        name: "Server invites",
                        value: LogEventType.ServerInvites,
                    },
                    {
                        name: "Member joins",
                        value: LogEventType.MemberJoin,
                    },
                    {
                        name: "Member leaves",
                        value: LogEventType.MemberLeave,
                    },
                    {
                        name: "Member timed out",
                        value: LogEventType.MemberTimeout,
                    },
                    {
                        name: "Member banned",
                        value: LogEventType.MemberBan,
                    },
                    {
                        name: "Member nickname updated",
                        value: LogEventType.MemberNickname,
                    },
                    {
                        name: "Message deleted",
                        value: LogEventType.MessageDelete,
                    },
                    {
                        name: "Message edited",
                        value: LogEventType.MessageEdit,
                    },
                    {
                        name: "Message pinned",
                        value: LogEventType.MessagePin,
                    },
                    {
                        name: "Messages bulk deleted",
                        value: LogEventType.MessageBulkDelete,
                    },
                    {
                        name: "All reactions removed from message",
                        value: LogEventType.MessageReactionClear,
                    },
                    {
                        name: "Role created",
                        value: LogEventType.RoleCreate,
                    },
                    {
                        name: "Role deleted",
                        value: LogEventType.RoleDelete,
                    },
                    {
                        name: "Role assigned",
                        value: LogEventType.RoleGive,
                    },
                    {
                        name: "Role taken",
                        value: LogEventType.RoleTake,
                    },
                    {
                        name: "Channel created",
                        value: LogEventType.ChannelCreate,
                    },
                    {
                        name: "Channel deleted",
                        value: LogEventType.ChannelDelete,
                    },
                )
                .setRequired(true))
            .addBooleanOption((o) => o
                .setName("enable")
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
     * 
     * @returns {void}
     */
    execute: async (interaction, assets, system, db) => {
        const configCmd = async () => {
            const toggle = interaction.options?.getBoolean("enable", true);
            const channel = interaction.options?.getChannel("channel", true);

            if (typeof toggle === "boolean") {
                system.logs.enabled = toggle;

                const update = await cache.update(system, db);

                if (update) {
                    if (interaction.replied) {
                        await interaction.followUp({
                            "content": "",
                            "embeds": [
                                {
                                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${resolve.abled(toggle)}__ logs.`,
                                    "color": assets.colors.primary,
                                },
                            ],
                        });
                    } else {
                        await interaction.reply({
                            "content": "",
                            "embeds": [
                                {
                                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${resolve.abled(toggle)}__ logs.`,
                                    "color": assets.colors.primary,
                                },
                            ],
                        });
                    };
                } else {
                    await fetch.commandErrorResponse(interaction, assets);
                };
            };

            if (typeof channel === "object") {
                system.logs.channel = channel.id;

                const update = await cache.update(system, db);

                if (update) {
                    if (interaction.replied) {
                        await interaction.followUp({
                            "content": "",
                            "embeds": [
                                {
                                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __set \`#${channel.name}\`__ as the logging channel.`,
                                    "color": assets.colors.primary,
                                },
                            ],
                        });
                    } else {
                        await interaction.reply({
                            "content": "",
                            "embeds": [
                                {
                                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __set \`#${channel.name}\`__ as the logging channel.`,
                                    "color": assets.colors.primary,
                                },
                            ],
                        });
                    };
                } else {
                    await fetch.commandErrorResponse(interaction, assets);
                };
            };
        };

        switch (interaction.options?.getSubcommand()) {
            case "config":
                await configCmd();
                break;

            default:
                await fetch.commandErrorResponse(interaction, assets);
                break;
        };
    },
};