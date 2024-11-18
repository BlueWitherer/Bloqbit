/**
 * @enum {number} Type of moderation action.
 */
class ModActionType {
    static Ban = 6;
    static Softban = 5;
    static Kick = 4;
    static Timeout = 3;
    static Warn = 2;
    static Delete = 1;
    static None = 0;
};

module.exports = ModActionType;