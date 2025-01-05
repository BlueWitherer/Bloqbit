/**
 * @enum {number} Type of filtering.
 */
class FilterMode {
    static INCLUDE = 1;
    static EXCLUDE = 0;

    static values() {
        return [
            this.INCLUDE,
            this.EXCLUDE,
        ];
    };
};

module.exports = FilterMode;