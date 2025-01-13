const { Message } = require("discord.js");
import SysSettings from '../settings.json' assert { type: 'json' };

class Moderator {
    /**
     * @returns {Moderator}
     */
    constructor() {
        return this;
    };

    /**
     * 
     * @param {typeof SysSettings} system Bot settings model.
     * @param {Message} msg Discord message.
     * 
     * @returns {Promise<*>}
     */
    totalMessageScan = async (system, msg) => {
        if (system && msg) {
            const am = system.automod;

            if (am.enabled) {
                if (am.antichain.enabled) {
                    console.log(`${msg.guild?.name} | Anti-chain enabled.`);
                };

                if (am.antiping.enabled) {
                    console.log(`${msg.guild?.name} | Anti-ping enabled.`);
                };

                if (am.antispam.enabled) {
                    console.log(`${msg.guild?.name} | Anti-spam enabled.`);
                };

                return;
            } else {
                console.warn(`Auto-moderator for guild ${msg.guild?.name} disabled.`);
                return;
            };
        } else {
            console.error("Bot settings or message invalid or missing.");
            return;
        };
    };
};

module.exports = Moderator;