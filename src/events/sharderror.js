const ClientModel = require("../classes/ClientModel.js");
const { Events, Error, WebhookClient } = require("discord.js");

module.exports = {
    name: Events.ShardError,
    once: false,
    /**
     * 
     * @param {ClientModel} bot 
     * @param {Error} error 
     * @param {number} shardId
     * 
     * @returns {void}
     */
    execute: async (bot, error, shardId) => {
        const date = Math.floor(Date.now() / 1000);

        const devWH = new WebhookClient({ url: bot.dev_wh });

        try {
            console.error(error);

            await devWH.send({
                "avatarURL": bot.client?.user?.displayAvatarURL({ "forceStatic": true, "size": 512, }),
                "embeds": [
                    {
                        "author": {
                            "name": `Shard Error`,
                        },
                        "description": error,
                        "color": bot.assets.colors.secondary,
                        "fields": [
                            {
                                "name": "Time of Error",
                                "value": `<t:${date}:F> • <t:${date}:R>`,
                                "inline": false,
                            },
                        ],
                        "footer": {
                            "text": bot.client?.user?.username,
                            "icon_url": bot.client?.user?.displayAvatarURL({ "forceStatic": false, "size": 128 }),
                        },
                    },
                ],
            });
        } catch (err) {
            console.error(err);
        };

        return;
    },
};