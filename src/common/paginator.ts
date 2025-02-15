import { PageMetadata } from "~/types/page-metadata";

type FetchItemsFunction<T> = (fetchItems: FetchItems) => Promise<T[]>;

export class Paginator<T> {
    private itemsPerPage = 0;
    private totalItems = 0;
    private items: T[] | null = null; // Optional array to hold set items

    /**
     * Sets the number of items per page.
     * @param itemsPerPage - The number of items per page.
     * @returns the pagination
     */
    setItemsPerPage(itemsPerPage: number): Paginator<T> {
        this.itemsPerPage = itemsPerPage;
        return this;
    }

    /**
     * Sets the items to paginate.
     * @param items - The items to paginate.
     * @returns the pagination
     */
    setItems(items: T[]): Paginator<T> {
        this.items = items;
        this.totalItems = items.length;
        return this;
    }

    /**
     * Sets the total number of items.
     * @param totalItems - Total number of items.
     * @returns the pagination
     */
    setTotalItems(totalItems: number): Paginator<T> {
        this.totalItems = totalItems;
        return this;
    }

    /**
     * Gets a page of items, using either static items or a dynamic fetchItems callback.
     * @param page - The page number to retrieve.
     * @returns A promise resolving to the page of items.
     * @throws throws an error if the page number is invalid.
     */
    async getPage(
        page: number,
        fetchItems?: FetchItemsFunction<T>
    ): Promise<Page<T>> {
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        if (totalPages === 0) {
            return new Page<T>(
                [],
                new PageMetadata(0, 0, page, this.itemsPerPage, 0, 0)
            );
        }
        if (page < 1 || page > totalPages) {
            throw new Error("Invalid page number");
        }

        // Calculate the range of items to fetch for the current page
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        let pageItems: T[];

        // Use set items if they are present, otherwise use fetchItems callback
        if (this.items) {
            pageItems = this.items.slice(start, end);
        } else if (fetchItems) {
            pageItems = await fetchItems(new FetchItems(start, end));
        } else {
            throw new Error(
                "Items function is not set and no fetchItems callback provided"
            );
        }

        return new Page<T>(
            pageItems,
            new PageMetadata(
                totalPages,
                this.totalItems,
                page,
                this.itemsPerPage,
                start,
                end
            )
        );
    }
}

class FetchItems {
    readonly start: number;
    readonly end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}

export class Page<T> {
    readonly items: T[];
    readonly metadata: PageMetadata;

    constructor(items: T[], metadata: PageMetadata) {
        this.items = items;
        this.metadata = metadata;
    }

    /**
     * Converts the page to a JSON object.
     */
    toJSON() {
        return { items: this.items, metadata: this.metadata };
    }
}
