export interface Review {
    id?: number;
    book: {
        id: number;
        title: string;
    };
    user: {
        id: number;
        username: string;
    };
    rating: number;
    comment: string;
}