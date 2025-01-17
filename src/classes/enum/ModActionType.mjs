/**
 * @enum {number} Type of moderation action.
 */
export default class ModActionType {
    static Ban = 7;
    static Softban = 6;
    static Kick = 5;
    static Blacklist = 4;
    static Timeout = 3;
    static Mute = 2;
    static Warn = 1;
    static None = 0;

    static values() {
        return [
            this.Ban,
            this.Softban,
            this.Kick,
            this.Blacklist,
            this.Timeout,
            this.Mute,
            this.Warn,
            this.None,
        ];
    };
};