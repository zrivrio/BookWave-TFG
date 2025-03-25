
import { Book } from './Book';
import { User } from './User';

export interface ReadingProgress {
    id: number;
    user: User;
    book: Book;
    currentPage: number;
    percentageRead: number;
}