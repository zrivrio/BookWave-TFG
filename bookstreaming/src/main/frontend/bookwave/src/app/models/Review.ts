
import { Book } from './Book';
import { User } from './User';

export interface Review {
    id: number;
    book: Book;
    user: User;
    rating: number;
    comment: string;
}