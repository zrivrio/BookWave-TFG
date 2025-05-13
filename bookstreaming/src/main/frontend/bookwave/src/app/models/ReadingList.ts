

import { Book } from './Book';
import { User } from './User';


export interface ReadingList {
    id: number;
    name: string;
    user: User;
    books: Book[]; 
}