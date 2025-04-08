import { Category } from "./Category";
import { ReadingProgress } from "./ReadinProgress";


export interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    cover: string;
    language: string;
    year: number;
    totalPages?: number;
    averageRating?: number;
    categories?: Category[];
    readingProgresses?: ReadingProgress[];
}