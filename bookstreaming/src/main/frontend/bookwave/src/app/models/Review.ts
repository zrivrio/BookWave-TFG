export interface Review {
    id?: number;
    book: {
        id: number;
    };
    user: {
        id: number;
        username: string;
    };
    rating: number;
    comment: string;
    createdAt?: string;
}