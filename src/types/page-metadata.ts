export class PageMetadata {
    /**
     * The amount of pages in the pagination
     */
    public readonly totalPages: number;

    /**
     * The total amount of items
     */
    public readonly totalItems: number;

    /**
     * The current page
     */
    public readonly page: number;

    /**
     * The amount of items per page
     */
    public readonly itemsPerPage: number;

    /**
     * The start index of the items
     */
    public readonly start: number;

    /**
     * The end index of the items
     */
    public readonly end: number;

    constructor(
        totalPages: number,
        totalItems: number,
        page: number,
        itemsPerPage: number,
        start: number,
        end: number
    ) {
        this.totalPages = totalPages;
        this.totalItems = totalItems;
        this.page = page;
        this.itemsPerPage = itemsPerPage;
        this.start = start;
        this.end = end;
    }
}
