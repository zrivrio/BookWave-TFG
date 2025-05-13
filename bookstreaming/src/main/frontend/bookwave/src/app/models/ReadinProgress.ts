export interface ReadingProgress {
    id?: number;
    user: {
        id: number;
        username: string;
    };
    book: {
        id: number;
        title: string;
    };
    currentPage: number;
    percentageRead: number;
}