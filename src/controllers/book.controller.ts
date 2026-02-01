import { Request, Response } from "express";
import BookService from "../services/book.service";
import { FilterOptions, SortOptions } from "../utils/book.interface";

class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  public createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const bookData = req.body;
      const book = await this.bookService.createBook(bookData);
      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create book",
      });
    }
  };

  public getBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const book = await this.bookService.getBookById(id);
      res.status(200).json({
        success: true,
        data: book,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Failed to fetch book",
      });
    }
  };

  public getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const filters: FilterOptions = {};
      if (req.query.genre) filters.genre = req.query.genre as string;
      if (req.query.author) filters.author = req.query.author as string;
      if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice as string);
      if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice as string);
      if (req.query.minYear) filters.minYear = parseInt(req.query.minYear as string);
      if (req.query.maxYear) filters.maxYear = parseInt(req.query.maxYear as string);

      let sort: SortOptions | undefined;
      if (req.query.sort) {
        sort = {};
        const sortParams = (req.query.sort as string).split(",");
        sortParams.forEach((param) => {
          const [field, order] = param.split(":");
          sort![field] = order === "-1" ? -1 : 1;
        });
      }

      const result = await this.bookService.getAllBooks(page, limit, filters, sort, search);

      res.status(200).json({
        success: true,
        data: result.books,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch books",
      });
    }
  };

  public updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const updateData = req.body;

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({
          success: false,
          message: "No data provided for update",
        });
        return;
      }

      const updatedBook = await this.bookService.updateBook(id, updateData);
      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update book",
      });
    }
  };

  public deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const deletedBook = await this.bookService.deleteBook(id);
      res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Failed to delete book",
      });
    }
  };

  public getBooksByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
      const { genre } = req.params as { genre: string };
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.bookService.getBooksByGenre(genre, page, limit);

      res.status(200).json({
        success: true,
        data: result.books,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch books by genre",
      });
    }
  };

  public getBooksByAuthor = async (req: Request, res: Response): Promise<void> => {
    try {
      const { author } = req.params as { author: string };
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.bookService.getBooksByAuthor(author, page, limit);

      res.status(200).json({
        success: true,
        data: result.books,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch books by author",
      });
    }
  };

  public getBooksByPriceRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const minPrice = parseFloat(req.query.minPrice as string);
      const maxPrice = parseFloat(req.query.maxPrice as string);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (isNaN(minPrice) || isNaN(maxPrice)) {
        res.status(400).json({
          success: false,
          message: "minPrice and maxPrice must be valid numbers",
        });
        return;
      }

      const result = await this.bookService.getBooksByPriceRange(minPrice, maxPrice, page, limit);

      res.status(200).json({
        success: true,
        data: result.books,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch books by price range",
      });
    }
  };
}

export default BookController;
