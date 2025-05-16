export interface ReadingProgress {
    id?: number;
    user: {
        id: number;
        username: string;
    };
    book: {
        id: number;
        title: string;
        cover?: string;
        totalPages?: number;
    };
    currentPage: number;
    percentageRead: number;
}