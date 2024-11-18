const Moderator = require("../automated/moderator.js");
const cache = require("../cache.js");
const ClientModel = require("../classes/ClientModel.js");
const { Events, Message, ChannelType, WebhookClient } = require("discord.js");

module.exports = {
    name: Events.MessageCreate,
    once: false,
    /**
     * 
     * @param {ClientModel} bot 
     * @param {Message} msg 
     */
    execute: async (bot, msg) => {
        if (msg.guild) {
            msg.channel?.messages?.fetch({ limit: 100 })
                .then(() => {
                    console.log(`Message sent by @${msg.author?.username} (${msg.author?.id}) in #${msg.channel?.name} (${msg.channel?.id}) | Message Count: ${msg.channel?.messages?.cache.size}`);
                });
        } else if (msg.channel?.type === ChannelType.DM) {
            msg.channel?.messages?.fetch({ limit: 100 })
                .then(() => {
                    console.log(`Direct message sent by @${msg.author?.username} (${msg.author?.id}) to @${bot.client?.user?.username} | Message Count: ${msg.channel?.messages?.cache.size}`);
                });
        };

        if (msg.channel?.type === ChannelType.DM || msg.channel?.type === ChannelType.GroupDM) {
            const devWH = new WebhookClient({ url: bot.dev_wh });

            if (msg.author?.bot) {
                console.warn(`Direct messenger ${msg.author?.username} (${msg.author?.id}) is a bot or invalid.`);
            } else if (devWH) {
                const date = Math.floor(Date.now() / 1000);

                await devWH.send({
                    "avatarURL": bot.client?.user?.displayAvatarURL({ "forceStatic": true, "size": 512, }),
                    "content": "",
                    "embeds": [
                        {
                            "author": {
                                "name": "Direct Message",
                            },
                            "color": bot.assets.colors.terciary,
                            "description": msg.content,
                            "fields": [
                                {
                                    "name": "Sent At",
                                    "value": `<t:${date}:F> • <t:${date}:R>`,
                                    "inline": false,
                                },
                            ],
                            "footer": {
                                "text": msg.author?.username,
                                "icon_url": msg.author?.displayAvatarURL({ "forceStatic": false, "size": 128 }),
                            },
                        },
                    ],
                });
            };
        } else if (!msg.author?.bot) {
            const moderation = new Moderator();
            const settings = cache.fetch(msg.guildId);

            await moderation.totalMessageScan(settings, msg);
        };
    },
};