import BookModel from "../models/book.model";
import { BookDocument, FilterOptions, PaginationOptions, SortOptions } from "../utils/book.interface";

class BookRepository {
  public async create(bookData: any): Promise<BookDocument> {
    const book = await BookModel.create(bookData);
    return book;
  }

  public async findById(id: string): Promise<BookDocument | null> {
    return await BookModel.findById(id);
  }

  public async findAll(
    filters?: FilterOptions,
    sort?: SortOptions,
    pagination?: PaginationOptions
  ): Promise<{ books: BookDocument[]; total: number }> {
    const query: any = {};

    if (filters?.genre) {
      query.genre = filters.genre;
    }
    if (filters?.author) {
      query.author = { $regex: filters.author, $options: "i" };
    }
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }
    if (filters?.minYear !== undefined || filters?.maxYear !== undefined) {
      query.publishedYear = {};
      if (filters.minYear !== undefined) query.publishedYear.$gte = filters.minYear;
      if (filters.maxYear !== undefined) query.publishedYear.$lte = filters.maxYear;
    }

    const total = await BookModel.countDocuments(query);

    let queryBuilder = BookModel.find(query);

    if (sort) {
      queryBuilder = queryBuilder.sort(sort);
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    if (pagination) {
      queryBuilder = queryBuilder.skip(pagination.skip).limit(pagination.limit);
    }

    const books = await queryBuilder.exec();
    return { books, total };
  }

  public async search(searchTerm: string, pagination?: PaginationOptions): Promise<{ books: BookDocument[]; total: number }> {
    const query = {
      $or: [
        { title: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
        { author: { $regex: searchTerm, $options: "i" } },
      ],
    };

    const total = await BookModel.countDocuments(query);

    let queryBuilder = BookModel.find(query).sort({ createdAt: -1 });

    if (pagination) {
      queryBuilder = queryBuilder.skip(pagination.skip).limit(pagination.limit);
    }

    const books = await queryBuilder.exec();
    return { books, total };
  }

  public async update(id: string, updateData: any): Promise<BookDocument | null> {
    return await BookModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  public async delete(id: string): Promise<BookDocument | null> {
    return await BookModel.findByIdAndDelete(id);
  }

  public async findByISBN(isbn: string): Promise<BookDocument | null> {
    return await BookModel.findOne({ isbn });
  }

  public async findByGenre(genre: string, pagination?: PaginationOptions): Promise<{ books: BookDocument[]; total: number }> {
    const total = await BookModel.countDocuments({ genre });

    let queryBuilder = BookModel.find({ genre }).sort({ createdAt: -1 });

    if (pagination) {
      queryBuilder = queryBuilder.skip(pagination.skip).limit(pagination.limit);
    }

    const books = await queryBuilder.exec();
    return { books, total };
  }

  public async findByAuthor(author: string, pagination?: PaginationOptions): Promise<{ books: BookDocument[]; total: number }> {
    const query = { author: { $regex: author, $options: "i" } };
    const total = await BookModel.countDocuments(query);

    let queryBuilder = BookModel.find(query).sort({ createdAt: -1 });

    if (pagination) {
      queryBuilder = queryBuilder.skip(pagination.skip).limit(pagination.limit);
    }

    const books = await queryBuilder.exec();
    return { books, total };
  }
}

export default BookRepository;
