export interface ReadingProgress {
    id: number;
    book: {
        id: number;
        title: string;
        author: string;
        cover: string;
    };
    currentPage: number;
    totalPages: number;
    lastRead: Date;
    progress: number; // Add this property
}