const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const { BotDatabase, FilterMode, ModActionType } = require("../../classes.js");
const { ChatInputCommandInteraction, Role, BaseChannel } = require("discord.js");
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
            .setName("enable")
            .setDescription("Activate or deactivate the Auto-moderator module.")
            .addBooleanOption((o) => o
                .setName("enable")
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
            .addNumberOption((o) => o
                .setName("punishment")
                .setDescription("The action that will be taken on the user.")
                .addChoices(
                    {
                        name: "none",
                        value: ModActionType.None,
                    },
                    {
                        name: "warn",
                        value: ModActionType.Warn,
                    },
                    {
                        name: "mute",
                        value: ModActionType.Mute,
                    },
                    {
                        name: "timeout",
                        value: ModActionType.Timeout,
                    },
                    {
                        name: "blacklist",
                        value: ModActionType.Blacklist,
                    },
                    {
                        name: "kick",
                        value: ModActionType.Kick,
                    },
                    {
                        name: "softban",
                        value: ModActionType.Softban,
                    },
                    {
                        name: "ban",
                        value: ModActionType.Ban,
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
                        value: FilterMode.Include,
                    },
                    {
                        name: "exclude",
                        value: FilterMode.Exclude,
                    },
                ))
            .addNumberOption((o) => o
                .setName("permission_filter_mode")
                .setDescription("Whether to exclude or include the filtered roles and channels.")
                .addChoices(
                    {
                        name: "include",
                        value: FilterMode.Include,
                    },
                    {
                        name: "exclude",
                        value: FilterMode.Exclude,
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
            .addNumberOption((o) => o
                .setName("punishment")
                .setDescription("The action that will be taken on the user.")
                .addChoices(
                    {
                        name: "none",
                        value: ModActionType.None,
                    },
                    {
                        name: "warn",
                        value: ModActionType.Warn,
                    },
                    {
                        name: "mute",
                        value: ModActionType.Mute,
                    },
                    {
                        name: "timeout",
                        value: ModActionType.Timeout,
                    },
                    {
                        name: "blacklist",
                        value: ModActionType.Blacklist,
                    },
                    {
                        name: "kick",
                        value: ModActionType.Kick,
                    },
                    {
                        name: "softban",
                        value: ModActionType.Softban,
                    },
                    {
                        name: "ban",
                        value: ModActionType.Ban,
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
            .addNumberOption((o) => o
                .setName("punishment")
                .setDescription("The action that will be taken on the user.")
                .addChoices(
                    {
                        name: "none",
                        value: ModActionType.None,
                    },
                    {
                        name: "warn",
                        value: ModActionType.Warn,
                    },
                    {
                        name: "mute",
                        value: ModActionType.Mute,
                    },
                    {
                        name: "timeout",
                        value: ModActionType.Timeout,
                    },
                    {
                        name: "blacklist",
                        value: ModActionType.Blacklist,
                    },
                    {
                        name: "kick",
                        value: ModActionType.Kick,
                    },
                    {
                        name: "softban",
                        value: ModActionType.Softban,
                    },
                    {
                        name: "ban",
                        value: ModActionType.Ban,
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
                        value: FilterMode.Include,
                    },
                    {
                        name: "exclude",
                        value: FilterMode.Exclude,
                    },
                ))),
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

        /**
         * 
         * @param {number} number Amount.
         * @param {string} singular Singular word.
         * @param {string} plural Plural word.
         * 
         * @returns {string} Singular or plural based on amount.
         */
        const isPlural = (number, singular, plural) => {
            if (number < 1 || 1 < number) {
                return plural;
            } else {
                return singular
            };
        };

        const toggleCmd = async () => {
            const toggle = interaction.options?.getBoolean("enable", true);

            system.automod.enabled = toggle;

            const update = await cache.update(system, db);

            if (update) {
                if (interaction.replied) {
                    await interaction.followUp({
                        "content": "",
                        "embeds": [
                            {
                                "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${abled(toggle)}__ auto-moderator.`,
                                "color": assets.colors.primary,
                            },
                        ],
                    });
                } else {
                    await interaction.reply({
                        "content": "",
                        "embeds": [
                            {
                                "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${abled(toggle)}__ auto-moderator.`,
                                "color": assets.colors.primary,
                            },
                        ],
                    });
                };
            } else {
                await fetch.commandErrorResponse(interaction, assets);
            };
        };

        const swearsCmd = async () => {
            const toggle = interaction.options?.getBoolean("enable", true);

            const filter = interaction.options?.getString("filter");
            const superFilter = interaction.options?.getString("super_filter");
            const channel = interaction.options?.getChannel("toggle_channel");
            const role = interaction.options?.getRole("toggle_role");
            const punishment = interaction.options?.getNumber("punishment");
            const logChannel = interaction.options?.getChannel("log_channel");
            const filterMode = interaction.options?.getNumber("filter_mode");
            const permissionFilterMode = interaction.options?.getNumber("permission_filter_mode");

            const allEmbeds = [];

            if (toggle !== null && typeof toggle === "boolean") {
                system.automod.swearFilter.enabled = toggle;

                allEmbeds.push({
                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __${abled(toggle)}__ the swear filter.`,
                    "color": assets.colors.primary,
                });
            };

            if (filter !== null && typeof filter === "string") {
                if (filter === "<RESET>") {
                    system.automod.swearFilter.keywords.splice(0, system.automod.swearFilter.keywords.length());

                    allEmbeds.push({
                        "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __cleared__ the swear filter.`,
                        "color": assets.colors.primary,
                    });
                } else {
                    const list = filter.split(",");

                    list.forEach((w) => system.automod.swearFilter.keywords.push(w.replace(/\s+/g, ' ').trim()));

                    allEmbeds.push({
                        "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __added \`${list.length}\` words__ to the swear filter.`,
                        "color": assets.colors.primary,
                    });
                };
            };

            if (superFilter !== null && typeof superFilter === "string") {
                if (superFilter === "<RESET>") {
                    system.automod.swearFilter.superkeywords.splice(0, system.automod.swearFilter.superkeywords.length());

                    allEmbeds.push({
                        "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __cleared__ the severe swear filter.`,
                        "color": assets.colors.primary,
                    });
                } else {
                    const list = superFilter.split(",");

                    list.forEach((w) => system.automod.swearFilter.superkeywords.push(w.replace(/\s+/g, ' ').trim()));

                    allEmbeds.push({
                        "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __added \`${list.length}\` words__ to the severe swear filter.`,
                        "color": assets.colors.primary,
                    });
                };
            };

            if (channel !== null && typeof channel === "object") {
                const foundChannel = system.automod.swearFilter.channels.findIndex((c) => c === channel.id);

                if (foundChannel >= 0) {
                    system.automod.swearFilter.channels.splice(foundChannel, 1);

                    allEmbeds.push(
                        {
                            "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __removed \`#${channel.name}\`__ from the swear filter.`,
                            "color": assets.colors.primary,
                        });
                } else {
                    system.automod.swearFilter.channels.push(channel.id);

                    allEmbeds.push(
                        {
                            "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __added \`#${channel.name}\`__ to the swear filter.`,
                            "color": assets.colors.primary,
                        });
                };
            };

            if (role !== null && typeof role === "object") {
                const foundRole = system.automod.swearFilter.roles.findIndex((r) => r === role.id);

                if (foundRole >= 0) {
                    system.automod.swearFilter.roles.splice(foundRole, 1);

                    allEmbeds.push(
                        {
                            "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __removed \`@${role.name}\`__ from the swear filter.`,
                            "color": assets.colors.primary,
                        });
                } else {
                    system.automod.swearFilter.roles.push(role.id);

                    allEmbeds.push(
                        {
                            "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __added \`@${role.name}\`__ to the swear filter.`,
                            "color": assets.colors.primary,
                        });
                };
            };

            if (punishment !== null && typeof punishment === "number") {
                system.automod.swearFilter.punishment === punishment;

                allEmbeds.push({
                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __set the punishment to \`${resolve.punishmentType(punishment)}\`__ for the swear filter.`,
                    "color": assets.colors.primary,
                });
            };

            if (logChannel !== null && typeof logChannel === "object") {
                system.automod.swearFilter.logs = logChannel.id;

                allEmbeds.push({
                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __set \`#${channel.name}\`__ as the logging channel for the swear filter.`,
                    "color": assets.colors.primary,
                });
            };

            if (filterMode !== null && typeof filterMode === "number") {
                system.automod.swearFilter.filterMode = filterMode;

                allEmbeds.push({
                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __set \`${resolve.filterMode(filterMode)}\`__ as the swear filter mode.`,
                    "color": assets.colors.primary,
                });
            };

            if (permissionFilterMode !== null && typeof permissionFilterMode === "number") {
                system.automod.swearFilter.permFilterMode = permissionFilterMode;

                allEmbeds.push({
                    "description": `${assets.icons.check} | **${interaction.user?.username}** - Successfully __set \`${resolve.filterMode(permissionFilterMode)}\`__ as the swear filter mode.`,
                    "color": assets.colors.primary,
                });
            };

            const update = await cache.update(system, db);

            if (update) {
                await interaction.reply({
                    "content": `> -# ${assets.icons.check} | Configured **${allEmbeds.length}** ${isPlural(allEmbeds.length, "setting", "settings")}.`,
                    "embeds": allEmbeds,
                });
            } else {
                await fetch.commandErrorResponse(interaction, assets);
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