const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const { BotDatabase } = require("../../classes.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');
const fetch = require("../../modules/fetch.js");
const resolve = require("../../modules/resolve.js");
const cache = require("../../cache.js");

module.exports = {
    premium: true,
    data: new SlashCommandBuilder()
        .setName("automod")
        .setDescription("Configure auto-moderator settings to your server's needs.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((c) => c
            .setName("toggle")
            .setDescription("Activate or deactivate the Auto-moderator module.")
            .addBooleanOption((o) => o
                .setName("enabled")
                .setDescription("Toggle auto-moderator module.")
                .setRequired(true)))
        .addSubcommand((c) => c
            .setName("swears")
            .setDescription("Adjust swear filter settings.")
            .addBooleanOption((o) => o
                .setName("enable")
                .setDescription("Toggle this setting on or off.")
                .setRequired(true))
            .addStringOption((o) => o
                .setName("filter")
                .setDescription("Seperate each keyword by comma. Input <RESET> if you would like to clear.")
                .setMinLength(5)
                .setMaxLength(6000))
            .addStringOption((o) => o
                .setName("super_filter")
                .setDescription("Seperate each keyword by comma. Input <RESET> if you would like to clear.")
                .setMinLength(5)
                .setMaxLength(6000))
            .addChannelOption((o) => o
                .setName("toggle_channel")
                .setDescription("Enable or disable the filter in this channel.")
                .addChannelTypes([ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildStageVoice]))
            .addRoleOption((o) => o
                .setName("toggle_role")
                .setDescription("Enable or disable the filter for this role."))
            .addStringOption((o) => o
                .setName("warning")
                .setDescription("Add a custom warning message to be sent to the user.")
                .setMinLength(5)
                .setMaxLength(255))
            .addNumberOption((o) => o
                .setName("punishment")
                .setDescription("The action that will be taken on the user.")
                .addChoices(
                    {
                        name: "none",
                        value: 0,
                    },
                    {
                        name: "warn",
                        value: 1,
                    },
                    {
                        name: "mute",
                        value: 2,
                    },
                    {
                        name: "timeout",
                        value: 3,
                    },
                    {
                        name: "blacklist",
                        value: 4,
                    },
                    {
                        name: "kick",
                        value: 5,
                    },
                    {
                        name: "softban",
                        value: 6,
                    },
                    {
                        name: "ban",
                        value: 7,
                    },
                ))
            .addBooleanOption((o) => o
                .setName("del_message")
                .setDescription("Whether or not to remove the message when detected."))
            .addChannelOption((o) => o
                .setName("log_channel")
                .setDescription("Choose a different channel to log this moderation action.")
                .addChannelTypes([ChannelType.GuildText, ChannelType.GuildVoice]))
            .addNumberOption((o) => o
                .setName("filter_mode")
                .setDescription("Whether to exclude or include the filtered keywords.")
                .addChoices(
                    {
                        name: "include",
                        value: 1,
                    },
                    {
                        name: "exclude",
                        value: 0,
                    },
                ))
            .addNumberOption((o) => o
                .setName("permission_filter_mode")
                .setDescription("Whether to exclude or include the filtered roles and channels.")
                .addChoices(
                    {
                        name: "include",
                        value: 1,
                    },
                    {
                        name: "exclude",
                        value: 0,
                    },
                )))
        .addSubcommand((c) => c
            .setName("invites")
            .setDescription("Adjust invite filter settings.")
            .addBooleanOption((o) => o
                .setName("enable")
                .setDescription("Toggle this setting on or off.")
                .setRequired(true))
            .addStringOption((o) => o
                .setName("filter")
                .setDescription("Seperate each invite code by comma. Input <RESET> if you would like to clear.")
                .setMinLength(5)
                .setMaxLength(6000))
            .addChannelOption((o) => o
                .setName("toggle_channel")
                .setDescription("Enable or disable the filter in this channel.")
                .addChannelTypes([ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildStageVoice]))
            .addRoleOption((o) => o
                .setName("toggle_role")
                .setDescription("Enable or disable the filter for this role."))
            .addStringOption((o) => o
                .setName("warning")
                .setDescription("Add a custom warning message to be sent to the user.")
                .setMinLength(5)
                .setMaxLength(255))
            .addNumberOption((o) => o
                .setName("punishment")
                .setDescription("The action that will be taken on the user.")
                .addChoices(
                    {
                        name: "none",
                        value: 0,
                    },
                    {
                        name: "warn",
                        value: 1,
                    },
                    {
                        name: "mute",
                        value: 2,
                    },
                    {
                        name: "timeout",
                        value: 3,
                    },
                    {
                        name: "blacklist",
                        value: 4,
                    },
                    {
                        name: "kick",
                        value: 5,
                    },
                    {
                        name: "softban",
                        value: 6,
                    },
                    {
                        name: "ban",
                        value: 7,
                    },
                ))
            .addBooleanOption((o) => o
                .setName("del_message")
                .setDescription("Whether or not to remove the message when detected."))
            .addChannelOption((o) => o
                .setName("log_channel")
                .setDescription("Choose a different channel to log this moderation action.")
                .addChannelTypes([ChannelType.GuildText]))
            .addNumberOption((o) => o
                .setName("filter_mode")
                .setDescription("Whether to exclude or include the filtered channels.")
                .addChoices(
                    {
                        name: "include",
                        value: 1,
                    },
                    {
                        name: "exclude",
                        value: 0,
                    },
                )))
        .addSubcommand((c) => c
            .setName("links")
            .setDescription("Adjust URL filter settings.")
            .addBooleanOption((o) => o
                .setName("enable")
                .setDescription("Toggle this setting on or off.")
                .setRequired(true))
            .addStringOption((o) => o
                .setName("filter")
                .setDescription("Seperate each domain by comma. Input <RESET> if you would like to clear.")
                .setMinLength(5)
                .setMaxLength(6000))
            .addChannelOption((o) => o
                .setName("toggle_channel")
                .setDescription("Enable or disable the filter in this channel.")
                .addChannelTypes([ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildStageVoice]))
            .addRoleOption((o) => o
                .setName("toggle_role")
                .setDescription("Enable or disable the filter for this role."))
            .addStringOption((o) => o
                .setName("warning")
                .setDescription("Add a custom warning message to be sent to the user.")
                .setMinLength(5)
                .setMaxLength(255))
            .addNumberOption((o) => o
                .setName("punishment")
                .setDescription("The action that will be taken on the user.")
                .addChoices(
                    {
                        name: "none",
                        value: 0,
                    },
                    {
                        name: "warn",
                        value: 1,
                    },
                    {
                        name: "mute",
                        value: 2,
                    },
                    {
                        name: "timeout",
                        value: 3,
                    },
                    {
                        name: "blacklist",
                        value: 4,
                    },
                    {
                        name: "kick",
                        value: 5,
                    },
                    {
                        name: "softban",
                        value: 6,
                    },
                    {
                        name: "ban",
                        value: 7,
                    },
                ))
            .addBooleanOption((o) => o
                .setName("del_message")
                .setDescription("Whether or not to remove the message when detected."))
            .addChannelOption((o) => o
                .setName("log_channel")
                .setDescription("Choose a different channel to log this moderation action.")
                .addChannelTypes([ChannelType.GuildText]))
            .addNumberOption((o) => o
                .setName("filter_mode")
                .setDescription("Whether to exclude or include the filtered channels.")
                .addChoices(
                    {
                        name: "include",
                        value: 1,
                    },
                    {
                        name: "exclude",
                        value: 0,
                    },
                ))),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction The interaction for the slash command.
     * @param {typeof SysAssets} assets The configuration of the client's visual assets.
     * @param {typeof SysSettings} system The settings model for the bot's configuration.
     * @param {BotDatabase} db The database information.
     * @returns {void}
     */
    execute: async (interaction, assets, system, db) => {
        const subCmd = interaction.options?.getSubcommand(true);

        /**
         * 
         * @param {boolean} bool Boolean
         * 
         * @returns {string} "enabled" or "disabled"
         */
        const abled = (bool) => {
            if (bool) {
                return "enabled";
            } else {
                return "disabled";
            };
        };

        const toggleCmd = async () => {
            const toggle = interaction.options?.getBoolean("enabled", true);

            system.automod.enabled = toggle;

            const update = await cache.update(system);

            if (update) {
                await interaction.reply({
                    "content": "",
                    "embeds": [
                        {
                            "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${abled(toggle)}__ auto-moderator.`,
                            "color": assets.colors.primary,
                        },
                    ],
                });
            } else {
                await fetch.commandErrorResponse(interaction, assets);
            };
        };

        const swearsCmd = async () => {
            const toggle = interaction.options?.getBoolean("enable", true);
            const result_toggle = resolve.numberBool(toggle);

            const filter = interaction.options?.getString("filter");
            const channel = interaction.options?.getChannel("toggle_channel");
            const role = interaction.options?.getRole("toggle_role");
            const warning = interaction.options?.getString("warning");
            const punishment = interaction.options?.getNumber("punishment");
            const deleteMsg = interaction.options?.getBoolean("del_message");
            const logChannel = interaction.options?.getChannel("log_channel");
            const filterMode = interaction.options?.getNumber("filter_mode");
            const permissionFilterMode = interaction.options?.getNumber("permission_filter_mode");

            if (filter && filter !== null) {
                const list = filter.split(",");

                list.forEach((w) => system.automod.swearFilter.keywords.push(w.replace(/\s+/g, ' ').trim()));

                const update = await cache.update(system);

                if (update) {
                    if (interaction.replied) {
                        await interaction.followUp({
                            "content": "",
                            "embeds": [
                                {
                                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __added \`${list.length}\` words__ to the swear filter.`,
                                    "color": assets.colors.primary,
                                },
                            ],
                        });
                    } else {
                        await interaction.reply({
                            "content": "",
                            "embeds": [
                                {
                                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __added \`${list.length}\` words__ to the swear filter.`,
                                    "color": assets.colors.primary,
                                },
                            ],
                        });
                    };
                } else {
                    await fetch.commandErrorResponse(interaction, assets);
                };
            };

            if (channel && channel !== null) {
                const foundChannel = system.automod.swearFilter.channels.findIndex((c) => c === channel.id);

                if (foundChannel >= 0) {
                    system.automod.swearFilter.channels.splice(foundChannel, 1);

                    const update = await cache.update(system);

                    if (update) {
                        if (interaction.replied) {
                            await interaction.followUp({
                                "content": "",
                                "embeds": [
                                    {
                                        "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __removed \`#${channel.name}\`__ from the swear filter.`,
                                        "color": assets.colors.primary,
                                    },
                                ],
                            });
                        } else {
                            await interaction.reply({
                                "content": "",
                                "embeds": [
                                    {
                                        "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __removed \`#${channel.name}\`__ from the swear filter.`,
                                        "color": assets.colors.primary,
                                    },
                                ],
                            });
                        };
                    } else {
                        await fetch.commandErrorResponse(interaction, assets);
                    };
                } else {
                    system.automod.swearFilter.channels.push(channel.id);

                    const update = await cache.update(system);

                    if (update) {
                        if (interaction.replied) {
                            await interaction.followUp({
                                "content": "",
                                "embeds": [
                                    {
                                        "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __added \`#${channel.name}\`__ to the swear filter.`,
                                        "color": assets.colors.primary,
                                    },
                                ],
                            });
                        } else {
                            await interaction.reply({
                                "content": "",
                                "embeds": [
                                    {
                                        "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __added \`#${channel.name}\`__ to the swear filter.`,
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
        };

        if (interaction.memberPermissions.has(PermissionFlagsBits.Administrator, true)) {
            switch (subCmd) {
                case "toggle":
                    await toggleCmd();
                    break;

                case "swears":
                    await swearsCmd();
                    break;

                default:
                    await fetch.commandErrorResponse(interaction, assets);
                    break;
            };
        };
    },
};