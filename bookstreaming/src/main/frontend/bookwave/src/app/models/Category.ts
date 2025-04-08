import { Book } from './Book';

export interface Category {
    id: number;
    nombre: string;
    books?: Book[];
}