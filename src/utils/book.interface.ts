import { Document, Model } from "mongoose";

export interface BookInterface {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publishedYear: number;
  pages: number;
  price: number;
  stock: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookDocument extends Document, BookInterface {}

export type BookModelInterface = Model<BookDocument>;

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface FilterOptions {
  genre?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}

export interface SortOptions {
  [key: string]: 1 | -1;
}
