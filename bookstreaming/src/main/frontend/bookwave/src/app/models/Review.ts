import { Book } from './Book';
import { User } from './User';

export interface Review {
    id?: number; 
    bookid: number;
    userid: number; 
    rating: number;
    comment: string;
    createdAt?: string; 
}