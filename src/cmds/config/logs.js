import SysAssets from '../../assets.json' with { type: 'json' };
import SysSettings from '../../settings.json' with { type: 'json' };
import { BotDatabase, LogEventType  } from '../../classes.mjs';
import { ChatInputCommandInteraction  } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType, PermissionFlagsBits } from 'discord-api-types/v10';
import fetch from '../../modules/fetch.mjs';

export default {
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
                .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
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
        const subCmd = interaction.options?.getSubcommand(true);

        const configCmd = async () => {
            const toggle = interaction.options?.getBoolean("enable", true);
            const channel = interaction.options?.getChannel("channel", true);

            const allEmbeds = [];

            if (toggle !== null && typeof toggle === "boolean") {
                system.logs.enabled = toggle;

                allEmbeds.push({
                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${resolve.abled(toggle)}__ logs.`,
                    "color": assets.colors.primary,
                });
            };

            if (channel !== null && typeof channel === "object") {
                system.logs.channel = channel.id;

                allEmbeds.push({
                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __set \`#${channel.name}\`__ as the logging channel.`,
                    "color": assets.colors.primary,
                });
            };

            const update = await cache.update(system, db);

            if (update) {
                if (interaction.replied) {
                    await interaction.followUp({
                        "content": `> -# ${assets.icons.check} | Configured **${allEmbeds.length}** ${resolve.isPlural(allEmbeds.length, "setting", "settings")}.`,
                        "embeds": allEmbeds,
                    });
                } else {
                    await interaction.reply({
                        "content": `> -# ${assets.icons.check} | Configured **${allEmbeds.length}** ${resolve.isPlural(allEmbeds.length, "setting", "settings")}.`,
                        "embeds": allEmbeds,
                    });
                };
            } else {
                await fetch.commandErrorResponse(interaction, assets);
            };
        };

        const actionCmd = async () => {
            const action = interaction.options.getString("action", true);
            const toggle = interaction.options.getBoolean("enable", true);

            switch (action) {
                case LogEventType.AutoModerator:
                    system.logs.actions.autoMod = toggle;
                    break;

                case LogEventType.MOD:
                    system.logs.actions.moderator = toggle;
                    break;

                case LogEventType.ServerInvites:
                    system.logs.actions.invites = toggle;
                    break;

                case LogEventType.MemberJoin:
                    system.logs.actions.join = toggle;
                    break;

                case LogEventType.MemberLeave:
                    system.logs.actions.leave = toggle;
                    break;

                case LogEventType.MemberTimeout:
                    system.logs.actions.timeout = toggle;
                    break;

                case LogEventType.MemberBan:
                    system.logs.actions.ban = toggle;
                    break;

                case LogEventType.MemberNickname:
                    system.logs.actions.nickname = toggle;
                    break;

                case LogEventType.MessageDelete:
                    system.logs.actions.msgDel = toggle;
                    break;

                case LogEventType.MessageEdit:
                    system.logs.actions.msgUpd = toggle;
                    break;

                case LogEventType.MessagePin:
                    system.logs.actions.msgPin = toggle;
                    break;

                case LogEventType.RoleCreate:
                    system.logs.actions.rolesAdd = toggle;
                    break;

                case LogEventType.RoleDelete:
                    system.logs.actions.rolesRem = toggle;
                    break;

                case LogEventType.RoleGive:
                    system.logs.actions.rolesAssign = toggle;
                    break;

                case LogEventType.RoleTake:
                    system.logs.actions.rolesUnassign = toggle;
                    break;

                case LogEventType.ChannelCreate:
                    system.logs.actions.channelAdd = toggle;
                    break;

                case LogEventType.ChannelDelete:
                    system.logs.actions.channelDel = toggle;
                    break;
            };

            const update = await cache.update(system, db);

            if (update) {
                if (interaction.replied) {
                    await interaction.followUp({
                        "content": "",
                        "embeds": [
                            {
                                "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${resolve.abled(toggle)}__ logs for action type \`${action}\`.`,
                                "color": assets.colors.primary,
                            },
                        ],
                    });
                } else {
                    await interaction.reply({
                        "content": "",
                        "embeds": [
                            {
                                "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${resolve.abled(toggle)}__ logs for action type \`${action}\`.`,
                                "color": assets.colors.primary,
                            },
                        ],
                    });
                };
            } else {
                await fetch.commandErrorResponse(interaction, assets);
            };
        };

        switch (subCmd) {
            case "config":
                await configCmd();
                break;

            default:
                await fetch.commandErrorResponse(interaction, assets);
                break;
        };
    },
};