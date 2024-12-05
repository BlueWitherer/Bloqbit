const Discord = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');

const SysSettings = require("../settings.json");

const fetch = require("./fetch.js");
const resolve = require("./resolve.js");

module.exports = {
    /**
     * 
     * @param {typeof SysSettings} system Server settings object
     * @param {Discord.Message} msg Discord message to inspect
     */
    blFilter: (system, msg) => {
        if (system && msg) {
            try {
                const auto = system.automod;

                if (auto.enabled && auto.swearFilter.enabled) {
                    const blWords = auto.swearFilter.keywords;
                    const blWordsExtra = auto.swearFilter.keywordsSuper;

                    if (blWords.some((v) => msg.content.includes(v))) {
                        return resolve.warnObj(auto.swearFilter.punishment, resolve.msgWarning("Blacklisted Words", "Used words included in the keyword blacklist."));
                    } else if (blWordsExtra.some((v) => msg.content.includes(v))) {
                        return resolve.warnObj(auto.swearFilter.punishment + 1, resolve.msgWarning("Severe Blacklisted Words", "Used words included in the severe keyword blacklist."));
                    } else {
                        return resolve.warnObj(0, resolve.msgWarning("Clear", "Message doesn't violate rule."));
                    };
                } else {
                    return resolve.warnObj(0, resolve.msgWarning("Clear", "Filter disabled."));
                };
            } catch (err) {
                console.error(err);
                return resolve.warnObj(0, resolve.msgWarning("Clear", "Programming error."));
            };
        } else {
            return resolve.warnObj(0, resolve.msgWarning("Clear", "Programming error."));
        };
    },

    /**
     * 
     * @param {typeof SysSettings} system Server settings object
     * @param {Discord.Message} msg Discord message to inspect
     */
    elFilter: (system, msg) => {
        if (system && msg) {
            try {
                const auto = system.automod;

                if (auto.enabled && auto.linkFilter.enabled) {
                    const urlRegex = /https?:\/\/[^\s]+/;

                    if (urlRegex.test(msg.content)) {
                        return resolve.warnObj(auto.swearFilter.punishment, resolve.msgWarning("External URL", "Posted an external URL with the message."));
                    } else {
                        return resolve.warnObj(0, resolve.msgWarning("Clear", "Message doesn't violate rule."));
                    };
                } else {
                    return resolve.warnObj(0, resolve.msgWarning("Clear", "Filter disabled."));
                };
            } catch (err) {
                console.error(err);
                return resolve.warnObj(0, resolve.msgWarning("Clear", "Programming error."));
            };
        } else {
            return resolve.warnObj(0, resolve.msgWarning("Clear", "Programming error."));
        };
    },

    /**
     * 
     * @param {typeof SysSettings} system Server settings object
     * @param {Discord.Message} msg Discord message to inspect
     */
    inFilter: (system, msg) => {
        if (system && msg) {
            try {
                const auto = system.automod;

                if (auto.enabled && auto.inviteFilter.enabled) {
                    const inviteRegex = /discord\.gg\/[a-z0-9]+/i;

                    if (inviteRegex.test(msg.content)) {
                        return resolve.warnObj(auto.swearFilter.punishment, resolve.msgWarning("Server Invite", "Posted a server invite with the message."));
                    } else {
                        return resolve.warnObj(0, resolve.msgWarning("Clear", "Message doesn't violate rule."));
                    };
                } else {
                    return resolve.warnObj(0, resolve.msgWarning("Clear", "Filter disabled."));
                };
            } catch (err) {
                console.error(err);
                return resolve.warnObj(0, resolve.msgWarning("Clear", "Programming error."));
            };
        } else {
            return resolve.warnObj(0, resolve.msgWarning("Clear", "Programming error."));
        };
    },
};