const ClientModel = require("../classes/ClientModel.js");
const { Events, WebhookClient } = require("discord.js");

module.exports = {
    name: Events.Warn,
    once: false,
    /**
     * 
     * @param {ClientModel} bot 
     * @param {string} message 
     * 
     * @returns {void}
     */
    execute: async (bot, message) => {
        const date = Math.floor(Date.now() / 1000);

        const devWH = new WebhookClient({ url: bot.dev_wh });

        try {
            console.warn(message);

            await devWH.send({
                "avatarURL": bot.client?.user?.displayAvatarURL({ "forceStatic": true, "size": 512, }),
                "embeds": [
                    {
                        "author": {
                            "name": `Warning`,
                        },
                        "description": message,
                        "color": bot.assets.colors.terciary,
                        "fields": [
                            {
                                "name": "Time of Warning",
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
            console.message(err);
        };

        return;
    },
};