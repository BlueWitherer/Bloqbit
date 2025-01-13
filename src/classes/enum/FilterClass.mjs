/**
 * @enum {string} Code name for the type of automated filter.
 */
export default class FilterClass {
    static SWEAR = "swearFilter";
    static URL = "linkFilter";
    static INV = "inviteFilter";
    static DUPETXT = "dupetextFilter";
    static MASSPING = "massmentionFilter";

    static values() {
        return [
            this.SWEAR,
            this.URL,
            this.INV,
            this.DUPETXT,
            this.MASSPING,
        ];
    };
};