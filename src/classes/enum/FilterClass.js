/**
 * @enum {string} Code name for the type of automated filter.
 */
class FilterClass {
    static Swear = "swearFilter";
    static Link = "linkFilter";
    static Invite = "inviteFilter";
    static DupeText = "dupetextFilter";
    static MassMention = "massmentionFilter";
};

module.exports = FilterClass;