import { Book } from './Book';
import { User } from './User';

export interface Review {
    id?: number; 
    book: Pick<Book, 'id' | 'title'>; 
    user: Pick<User, 'id' | 'username' | 'email'>; 
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    createdAt?: string; 
}