import ClientModel from '../classes/ClientModel.js';
const { Events, Guild, ActivityType, PresenceUpdateStatus } = require("discord.js");
import fetch from '../modules/fetch.js';

module.exports = {
    name: Events.GuildDelete,
    once: false,
    /**
     * 
     * @param {ClientModel} bot 
     * @param {Guild} guild 
     * @returns {void}
     */
    execute: async (bot, guild) => {
        const isLogged = fetch.fetchGuild(guild.id);

        if (isLogged) {
            return;
        } else {
            try {
                const connect = await fetch.openConnect(bot.db);

                await fetch.closeConnect(connect);
            } catch (err) {
                console.error(err);
            };
        };

        try {
            const devWH = new WebhookClient({ url: bot.dev_wh, });
            const date = Math.floor(Date.now() / 1000);

            await devWH.send({
                "avatarURL": bot.client?.user?.displayAvatarURL({ "forceStatic": true, "size": 512, }),
                "embeds": [
                    {
                        "author": {
                            "name": `Servers`,
                        },
                        "description": `${bot.assets.icons.minus} | **${bot.client?.user?.username}** was forced to leave the server __${guild.name}__.`,
                        "color": bot.assets.colors.secondary,
                        "fields": [
                            {
                                "name": "Time of Leave",
                                "value": `<t:${date}:F> • <t:${date}:R>`,
                                "inline": false,
                            },
                        ],
                        "footer": {
                            "text": guild.name,
                            "icon_url": guild.iconURL({ "forceStatic": false, "size": 128 }),
                        },
                    },
                ],
            });

            bot.client.user?.setPresence({
                "activities": [
                    {
                        "name": `chat`,
                        "state": `Active across ${client.guilds.cache.size} servers!`,
                        "type": Discord.ActivityType.Streaming,
                        "url": `https://www.youtube.com/@CubicCommunity/`,
                    }
                ],
                "afk": false,
                "status": Discord.PresenceUpdateStatus.DoNotDisturb,
            });
        } catch (err) {
            console.error(err);
        };

        return;
    },
};