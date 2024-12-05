const SysSettings = require("../../settings.json");
const { Message, Client, PermissionsBitField, PermissionFlagsBits, Events } = require("discord.js");
const ModActionType = require("../enum/ModActionType");
const cache = require("../../cache");

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
            const msgCont = message.content.normalize().toLowerCase();

            // I: INVITES
            let regexPatternInvite = new RegExp("\\b(?:https?:\\/\\/)?(?:www\\.)?(?:discord\\.gg\\/[a-zA-Z0-9]+|discord\\.com\\/invite\\/[a-zA-Z0-9]+)\\b", 'g');

            const regexTestInvite = regexPatternInvite.test(msgCont);

            // II: LINKS
            let regexPatternLink = new RegExp("\\bhttps?:\\/\\/[^\\s/$.?#].[^\\s]*");

            const regexTestLink = regexPatternLink.test(msgCont);

            // III: SWEARS
            let swearWords = system.automod.swearFilter.keywords;
            let swearSuperWords = system.automod.swearFilter.superkeywords;

            let regexPatternSwear = new RegExp(`\\b(${swearWords.join('|')})\\b`, 'i');
            let regexPatternSwearSuper = new RegExp(`\\b(${swearSuperWords.join('|')})\\b`, 'i');

            const regexTestSwear = regexPatternSwear.test(msgCont);
            const regexTestSwearSuper = regexPatternSwearSuper.test(msgCont);

            // Priority I
            if (regexTestInvite) {
                console.debug(`${message.guild?.name} • Priority I Auto-moderator | Detected invite link in message ${message.id}`);

                // Priority II
            } else if (regexTestLink) {
                console.debug(`${message.guild?.name} • Priority II Auto-moderator | Detected URL in message ${message.id}`);

                if (message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
                    console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} is moderator.`);
                } else if (system.automod.linkFilter.enabled) {
                    if (message.deletable) await message.delete();

                    switch (system.automod.linkFilter.punishment) {
                        case ModActionType.Warn:
                            //warn
                            console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} warned.`);
                            break;

                        case ModActionType.Mute:
                            //mute
                            console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} muted.`);
                            break;

                        case ModActionType.Timeout:
                            //timeout
                            console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} timed out.`);
                            break;

                        case ModActionType.Blacklist:
                            //blacklist
                            console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} blacklisted.`);
                            break;

                        case ModActionType.Softban:
                            //softban
                            console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} soft-banned.`);
                            break;

                        case ModActionType.Ban:
                            //ban
                            console.debug(`${message.guild?.name} • Priority II Auto-moderator | Author ${message.author?.id} of message ${message.id} banned.`);
                            break;

                        case ModActionType.None:
                            console.debug(`${message.guild?.name} • Priority II Auto-moderator | Link filter punishment for guild ${message.guild?.id} disabled.`);
                            break;

                        default:
                            console.error(`${message.guild?.name} • Priority II Auto-moderator | Server settings not resolvable`);
                            break;
                    };
                };
                // Priority III
            } else if (regexTestSwear || regexTestSwearSuper) {
                console.debug(`${message.guild?.name} • Priority III Auto-moderator | Detected swear word in message ${message.id}`);

                if (message.member?.permissionsIn(message.channel).has(PermissionFlagsBits.ManageMessages)) {
                    console.debug(`${message.guild?.name} • Priority III Auto-moderator | Author ${message.author?.id} of message ${message.id} is moderator.`);
                } else if (system.automod.swearFilter.enabled) {
                    if (message.deletable) await message.delete();
                    if (regexTestSwearSuper && system.automod.swearFilter.punishment < ModActionType.Ban) system.automod.swearFilter.punishment++;

                    switch (system.automod.swearFilter.punishment) {
                        case ModActionType.Warn:
                            //warn
                            console.debug(`${message.guild?.name} • Priority III Auto-moderator | Author ${message.author?.id} of message ${message.id} warned.`);
                            break;

                        case ModActionType.Mute:
                            //mute
                            console.debug(`${message.guild?.name} • Priority III Auto-moderator | Author ${message.author?.id} of message ${message.id} muted.`);
                            break;

                        case ModActionType.Timeout:
                            //timeout
                            console.debug(`${message.guild?.name} • Priority III Auto-moderator | Author ${message.author?.id} of message ${message.id} timed out.`);
                            break;

                        case ModActionType.Blacklist:
                            //blacklist
                            console.debug(`${message.guild?.name} • Priority III Auto-moderator | Author ${message.author?.id} of message ${message.id} blacklisted.`);
                            break;

                        case ModActionType.Softban:
                            //softban
                            console.debug(`${message.guild?.name} • Priority III Auto-moderator | Author ${message.author?.id} of message ${message.id} soft-banned.`);
                            break;

                        case ModActionType.Ban:
                            //ban
                            console.debug(`${message.guild?.name} • Priority III Auto-moderator | Author ${message.author?.id} of message ${message.id} banned.`);
                            break;

                        case ModActionType.None:
                            console.debug(`${message.guild?.name} • Priority III Auto-moderator | Swear filter punishment for guild ${message.guild?.id} disabled.`);
                            break;

                        default:
                            console.error(`${message.guild?.name} • Priority III Auto-moderator | Server settings not resolvable`);
                            break;
                    };
                };
            }
        }
    };
};

module.exports = MessageHandler;