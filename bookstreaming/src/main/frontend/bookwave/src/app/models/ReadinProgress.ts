import { User } from './user';
import { Book } from './Book';

export interface ReadingProgress {
    id: number;
    user: User;
    book: Book;
    currentPage: number;
    percentageRead: number;
}