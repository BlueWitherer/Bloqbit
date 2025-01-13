import ClientModel from '../classes/ClientModel.js';
import { Events, Guild, WebhookClient  } from 'discord.js';
import fetch from '../modules/fetch.mjs';

export default {
    name: Events.GuildCreate,
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

                await fetch.reviseGuild(connect, bot, guild.id);

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
                        "description": `${bot.assets.icons.plus} | **${bot.client?.user?.username}** was authorized to join the guild __${guild.name}__.`,
                        "color": bot.assets.colors.primary,
                        "fields": [
                            {
                                "name": "Time of Join",
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