import BookRepository from "../repositories/book.repository";
import { BookInterface, FilterOptions, PaginationOptions, SortOptions } from "../utils/book.interface";

class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  public async createBook(bookData: BookInterface): Promise<any> {
    if (!bookData.title || typeof bookData.title !== "string") {
      throw new Error("Title is required and must be a string");
    }
    if (!bookData.author || typeof bookData.author !== "string") {
      throw new Error("Author is required and must be a string");
    }
    if (!bookData.isbn || typeof bookData.isbn !== "string") {
      throw new Error("ISBN is required and must be a string");
    }
    if (!bookData.genre || typeof bookData.genre !== "string") {
      throw new Error("Genre is required and must be a string");
    }
    if (bookData.publishedYear === undefined || typeof bookData.publishedYear !== "number") {
      throw new Error("Published year is required and must be a number");
    }
    if (bookData.pages === undefined || typeof bookData.pages !== "number") {
      throw new Error("Pages is required and must be a number");
    }
    if (bookData.price === undefined || typeof bookData.price !== "number") {
      throw new Error("Price is required and must be a number");
    }

    const existingBook = await this.bookRepository.findByISBN(bookData.isbn);
    if (existingBook) {
      throw new Error("Book with this ISBN already exists");
    }

    return await this.bookRepository.create(bookData);
  }

  public async getBookById(id: string): Promise<any> {
    if (!id) {
      throw new Error("Book ID is required");
    }

    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error("Book not found");
    }

    return book;
  }

  public async getAllBooks(
    page: number = 1,
    limit: number = 10,
    filters?: FilterOptions,
    sort?: SortOptions,
    search?: string
  ): Promise<any> {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    const skip = (page - 1) * limit;
    const pagination: PaginationOptions = { page, limit, skip };

    if (search && search.trim()) {
      return await this.bookRepository.search(search.trim(), pagination);
    }

    return await this.bookRepository.findAll(filters, sort, pagination);
  }

  public async updateBook(id: string, updateData: Partial<BookInterface>): Promise<any> {
    if (!id) {
      throw new Error("Book ID is required");
    }

    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error("Book not found");
    }

    if (updateData.isbn && updateData.isbn !== book.isbn) {
      const existingBook = await this.bookRepository.findByISBN(updateData.isbn);
      if (existingBook) {
        throw new Error("Book with this ISBN already exists");
      }
    }

    const updatedBook = await this.bookRepository.update(id, updateData);
    return updatedBook;
  }

  public async deleteBook(id: string): Promise<any> {
    if (!id) {
      throw new Error("Book ID is required");
    }

    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new Error("Book not found");
    }

    return await this.bookRepository.delete(id);
  }

  public async getBooksByGenre(genre: string, page: number = 1, limit: number = 10): Promise<any> {
    if (!genre) {
      throw new Error("Genre is required");
    }

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;
    const pagination: PaginationOptions = { page, limit, skip };

    return await this.bookRepository.findByGenre(genre, pagination);
  }

  public async getBooksByAuthor(author: string, page: number = 1, limit: number = 10): Promise<any> {
    if (!author) {
      throw new Error("Author is required");
    }

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;
    const pagination: PaginationOptions = { page, limit, skip };

    return await this.bookRepository.findByAuthor(author, pagination);
  }

  public async getBooksByPriceRange(minPrice: number, maxPrice: number, page: number = 1, limit: number = 10): Promise<any> {
    if (minPrice < 0 || maxPrice < 0) {
      throw new Error("Price cannot be negative");
    }
    if (minPrice > maxPrice) {
      throw new Error("Minimum price cannot be greater than maximum price");
    }

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;
    const pagination: PaginationOptions = { page, limit, skip };
    const filters: FilterOptions = { minPrice, maxPrice };

    return await this.bookRepository.findAll(filters, undefined, pagination);
  }
}

export default BookService;
