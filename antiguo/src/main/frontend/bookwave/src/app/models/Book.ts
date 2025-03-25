import { Category } from "./Category";

export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    cover: string;
    language: string;
    year: number;
    categories?: Category[];
    readCount?: number;
    readingLists?: Book[];
}