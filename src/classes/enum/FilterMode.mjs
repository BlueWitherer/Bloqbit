/**
 * @enum {number} Type of filtering.
 */
export default class FilterMode {
    static INCLUDE = 1;
    static EXCLUDE = 0;

    static values() {
        return [
            this.INCLUDE,
            this.EXCLUDE,
        ];
    };
};