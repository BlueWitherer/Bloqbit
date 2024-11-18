const SysAssets = require("../../assets.json");
const SysSettings = require("../../settings.json");
const { BotDatabase } = require("../../classes.js");
const { ChatInputCommandInteraction } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ChannelType, PermissionFlagsBits } = require('discord-api-types/v10');
const fetch = require("../../modules/fetch.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Refresh the server's save data.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction The interaction for the slash command.
     * @param {typeof SysAssets} assets The configuration of the client's visual assets.
     * @param {typeof SysSettings} system The settings model for the bot's configuration.
     * @param {BotDatabase} db The database information.
     * @returns {void}
     */
    execute: async (interaction, assets, system, db) => {
        const registered = fetch.fetchGuild(interaction.guild?.id);

        if (registered) {
            console.log(`Manually registered guild ${interaction.guild?.name} (${interaction.guild?.id}) successfully.`);
            interaction.reply({
                "content": "",
                "embeds": [
                    {
                        "title": `${assets.icons.check} | Server Registered`,
                        "description": `Your server, *${interaction.guild?.name}*, has been successfully registered to our database and commands are now available for use.`,
                        "color": assets.colors.primary,
                    },
                ],
            });
        } else {
            try {
                const revised = await fetch.reviseGuild(db, interaction.guildId);

                if (revised) {
                    console.log(`Manually registered guild ${interaction.guild?.name} (${interaction.guild?.id}) successfully.`);
                    interaction.reply({
                        "content": "",
                        "embeds": [
                            {
                                "title": `${assets.icons.check} | Server Registered`,
                                "description": `Your server, *${interaction.guild?.name}*, has been successfully registered to our database and commands are now available for use.`,
                                "color": assets.colors.primary,
                            },
                        ],
                    });
                } else {
                    console.error(`Manual registration of guild ${interaction.guild?.name} (${interaction.guild?.id}) failed.`);
                    interaction.reply({
                        "content": "",
                        "embeds": [
                            {
                                "title": `${assets.icons.xmark} | Failed To Register`,
                                "description": `We faced an issue registering your guild, *${interaction.guild?.name}*. We apologize for the inconvenience, please try again later.`,
                                "color": assets.colors.secondary,
                            },
                        ],
                    });
                };
            } catch (err) {
                await fetch.commandErrorResponse(interaction, assets);
                console.error(err);
            };
        };
    },
};