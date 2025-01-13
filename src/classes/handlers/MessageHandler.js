import SysSettings from '../../settings.json' assert { type: 'json' };
const { Message, Client, PermissionsBitField, PermissionFlagsBits, Events } = require("discord.js");
import cache from '../../cache';
import moderation from '../../modules/moderation';

class MessageHandler {
    /**
     * 
     * @param {Client} client Discord bot client.
     */
    constructor(client) {
        console.debug("Initiating global message handler...");

        client.on(Events.MessageCreate, async (m) => {
            const s = cache.fetch(m.guild?.id);

            if (s && m) {
                console.debug(`Handling message of ID ${m.id}...`);
                await this.messageSend(s, m);
            };
        });
    };

    /**
     * @param {typeof SysSettings} system Server settings.
     * @param {Message} message Discord message.
     */
    messageSend = async (system, message) => {
        if (message.guild) {
            if (message.author.bot) {
                return;
            } else {
                const inF = moderation.inFilter(system, message);
                const liF = moderation.elFilter(system, message);
                const blF = moderation.blFilter(system, message);

                if (inF.punishment) return await moderation.punish(inF.punishment, message.member, inF.warning.value);
                if (liF.punishment) return await moderation.punish(liF.punishment, message.member, liF.warning.value);
                if (blF.punishment) return await moderation.punish(blF.punishment, message.member, blF.warning.value);
            };
        };
    };
};

module.exports = MessageHandler;