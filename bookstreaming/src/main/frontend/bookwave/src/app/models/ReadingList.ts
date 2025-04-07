
import { Book } from './book';
import { User } from './User';


export interface ReadingList {
    id: number;
    name: string;
    user: User;
    books: Book[];
}