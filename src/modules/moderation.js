import Discord from 'discord.js';

import SysSettings from '../settings.json' with { type: 'json' };

import resolve from './resolve.js';

import { ModActionType  } from '../classes.js';

export default {
    /**
     * 
     * @param {number} level Severity of punishment
     * @param {Discord.GuildMember} member Server member to receive punishment
     * @param {string} reason Reason behind punishment
     * 
     * @returns 
     */
    punish: async (level, member, reason) => {
        if (level > ModActionType.Ban) level = ModActionType.Ban;

        /**
         * 
         * @param {Discord.GuildMember} m Member to ban
         * @param {string} r Reason for ban
         */
        const ban = async (m, r) => {
            await m.ban({
                "reason": r,
                "deleteMessageSeconds": 7 * 86400,
            });
        };

        /**
         * 
         * @param {Discord.GuildMember} m Member to softban
         * @param {string} r Reason for softban
         */
        const softban = async (m, r) => {
            const g = m.guild;

            await m.ban({
                "reason": r,
                "deleteMessageSeconds": 7 * 86400,
            });

            await g.members.unban(m.user, r);
        };

        /**
         * 
         * @param {Discord.GuildMember} m Member to timeout
         * @param {string} r Reason for timeout
         */
        const timeout = async (m, r) => {
            await m.timeout(7 * 86400000, r);
        };

        switch (level) {
            case ModActionType.Warn:
                //warn
                console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} warned.`);
                break;

            case ModActionType.Mute:
                //mute
                console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} muted.`);
                break;

            case ModActionType.Timeout:
                await timeout(member, reason);
                console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} timed out.`);
                break;

            case ModActionType.Blacklist:
                //blacklist
                console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} blacklisted.`);
                break;

            case ModActionType.Softban:
                await softban(member, reason);
                console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} soft-banned.`);
                break;

            case ModActionType.Ban:
                await ban(member, reason);
                console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} banned.`);
                break;

            case ModActionType.None:
                console.debug(`${message.guild?.name} • Priority II Auto-moderator | URL filter punishment for guild ${message.guild?.id} disabled.`);
                break;

            default:
                console.error(`${message.guild?.name} • Priority II Auto-moderator | Server settings not resolvable`);
                break;
        };
    },

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
                        return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Message doesn't violate rule."));
                    };
                } else {
                    return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Filter disabled."));
                };
            } catch (err) {
                console.error(err);
                return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Programming error."));
            };
        } else {
            return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Programming error."));
        };
    },

    /**
     * 
     * @param {typeof SysSettings} system Server settings object
     * @param {Discord.Message} msg Discord message to inspect
     * 
     * @returns {{ punishment: number, warning: { name: string, value: string }}} Warning object
     */
    elFilter: (system, msg) => {
        if (system && msg) {
            try {
                const auto = system.automod;

                if (auto.enabled && auto.linkFilter.enabled) {
                    const urlRegex = new RegExp("\\bhttps?:\\/\\/[^\\s/$.?#].[^\\s]*");

                    if (urlRegex.test(msg.content)) {
                        return resolve.warnObj(auto.linkFilter.punishment, resolve.msgWarning("External URL", "Posted an external URL with the message."));
                    } else {
                        return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Message doesn't violate rule."));
                    };
                } else {
                    return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Filter disabled."));
                };
            } catch (err) {
                console.error(err);
                return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Programming error."));
            };
        } else {
            return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Programming error."));
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
                console.debug(`Invite filter: ${ModActionType}`);
                console.debug(`Invite filter: ${FilterClass}`);
                console.debug(`Invite filter: ${CommandCategory}`);

                if (auto.enabled && auto.inviteFilter.enabled) {
                    const inviteRegex = new RegExp("\\b(?:https?:\\/\\/)?(?:www\\.)?(?:discord\\.gg\\/[a-zA-Z0-9]+|discord\\.com\\/invite\\/[a-zA-Z0-9]+)\\b", 'g');

                    if (inviteRegex.test(msg.content)) {
                        return resolve.warnObj(auto.inviteFilter.punishment, resolve.msgWarning("Server Invite", "Posted a server invite with the message."));
                    } else {
                        return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Message doesn't violate rule."));
                    };
                } else {
                    return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Filter disabled."));
                };
            } catch (err) {
                console.error(err);
                return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Programming error."));
            };
        } else {
            return resolve.warnObj(ModActionType.None, resolve.msgWarning("Clear", "Programming error."));
        };
    },
};