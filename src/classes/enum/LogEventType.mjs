/**
 * @enum {string} Type of server action to be logged.
 */
export default class LogEventType {
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

    static values() {
        return [
            this.AutoModerator,
            this.Moderator,
            this.ServerInvites,
            this.MemberJoin,
            this.MemberLeave,
            this.MemberTimeout,
            this.MemberNickname,
            this.MessageDelete,
            this.MessageEdit,
            this.MessagePin,
            this.MessageBulkDelete,
            this.RoleCreate,
            this.RoleDelete,
            this.RoleGive,
            this.RoleTake,
            this.ChannelCreate,
            this.ChannelDelete,
        ];
    };
};