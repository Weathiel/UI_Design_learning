import { AgeRange } from "./AgeRange";

export interface Book {
    id: number;
    title: string;
    author: string;
    publisher: string;
    genre: string;
    ageRange: AgeRange;
}