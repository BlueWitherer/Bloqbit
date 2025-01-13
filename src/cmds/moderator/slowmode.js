import SysAssets from '../../assets.json' with { type: 'json' };
import SysSettings from '../../settings.json' with { type: 'json' };
import { BotDatabase  } from '../../classes.js';
import { ChatInputCommandInteraction  } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType, PermissionFlagsBits } from 'discord-api-types/v10';

export default {
    premium: true,
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Set slowmode in the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addSubcommand((c) => c
            .setName("set")
            .setDescription("Set the slowmode in this channel.")
            .addNumberOption((n) => n.setName("cooldown").setDescription("Amount of time for the slowmode interval.").setMinValue(1).setMaxValue(59).setRequired(true))
            .addNumberOption((n) => n.setName("time").setDescription("In what time to set the slowmode to.").addChoices(
                {
                    name: "seconds",
                    value: 1,
                },
                {
                    name: "minutes",
                    value: 60,
                },
                {
                    name: "hours",
                    value: 3600,
                }
            ).setRequired(true)))
        .addSubcommand((c) => c
            .setName("remove")
            .setDescription("Remove the slowmode in this channel.")),
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
        if (interaction.options?.getSubcommand() === "set") {
            const cooldown = interaction.options?.getNumber("cooldown") || 1;
            const time = interaction.options?.getNumber("time") || 1;

            const duration = Math.floor(cooldown * time);

            let type = string();

            switch (interaction.options?.getNumber("time")) {
                case (1):
                    type = "seconds";
                    break;

                case (60):
                    type = "minutes";
                    break;

                case (3600):
                    type = "hours";
                    break;
            };

            if (cooldown === 1) {
                type = type.slice(0, -1);
            };

            if (time === 3600 && cooldown > 12) {
                return await interaction.reply({
                    "content": "",
                    "embeds": [
                        {
                            "description": `${assets.icons.xmark} | Slowmode cannot be set to over 12 hours.`,
                            "color": assets.colors.primary,
                        },
                    ],
                    "ephemeral": true,
                });
            };

            await interaction.channel?.setRateLimitPerUser(duration, `${interaction.user?.username} | Slowmode set.`);
            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": interaction.user?.username,
                            "icon_url": interaction.user?.displayAvatarURL({ forceStatic: false }),
                        },
                        "title": `${assets.icons.check} | Slowmode Set`,
                        "color": assets.colors.primary,
                        "fields": [
                            {
                                "name": "Duration",
                                "value": `${cooldown} ${type}`,
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
        } else if (interaction.options?.getSubcommand() === "remove") {
            await interaction.channel?.setRateLimitPerUser(0, `${interaction.user?.username} | Slowmode removed.`);
            return await interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "author": {
                            "name": interaction.user?.username,
                            "icon_url": interaction.user?.displayAvatarURL({ forceStatic: false }),
                        },
                        "title": `${assets.icons.check} | Slowmode Removed`,
                        "color": assets.colors.primary,
                        "fields": [
                            {
                                "name": "Moderator",
                                "value": `<@!${interaction.user?.id}>`,
                                "inline": true,
                            },
                        ],
                    },
                ],
            });
        };
    },
};