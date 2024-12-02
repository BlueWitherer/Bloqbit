/**
 * @enum {string} Type of server action to be logged.
 */
class LogEventType {
    static AutoModerator = "automod";
    static Moderator = "mod";
    static ServerInvites = "serverInv";
    static MemberJoin = "memJoin";
    static MemberLeave = "memLeave";
    static MemberTimeout = "memTimeout";
    static MemberBan = "memBan";
    static MemberNickname = "memNickname";
    static MessageDelete = "msgDel";
    static MessageEdit = "msgUpd";
    static MessagePin = "msgPin";
    static MessageBulkDelete = "msgBulkDel";
    static RoleCreate = "rolesAdd";
    static RoleDelete = "rolesRem";
    static RoleGive = "rolesAssign";
    static RoleTake = "rolesUnassign";
    static ChannelCreate = "channelAdd";
    static ChannelDelete = "channelRem";
};

module.exports = LogEventType;