import { Book } from './book';

export interface Category {
    id: number;
    nombre: string;
    books?: Book[];
}