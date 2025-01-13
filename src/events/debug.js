import ClientModel from '../classes/ClientModel.js';
const { Events, WebhookClient } = require("discord.js");

module.exports = {
    name: Events.Debug,
    once: false,
    /**
     * 
     * @param {ClientModel} bot 
     * @param {string} message 
     * 
     * @returns {void}
     */
    execute: async (bot, message) => {
        try {
            console.debug(message);
        } catch (err) {
            console.message(err);
        };

        return;
    },
};