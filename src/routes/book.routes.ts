import { Router } from "express";
import { Routes } from "../utils/route.Interface";
import BookController from "../controllers/book.controller";

class BookRoutes implements Routes {
  path?: string = "/book";
  router: Router = Router();
  public bookController = new BookController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, this.bookController.createBook);
    this.router.get(`${this.path}/list/all`, this.bookController.getAllBooks);
    this.router.get(`${this.path}/price-range`, this.bookController.getBooksByPriceRange);
    this.router.get(`${this.path}/genre/:genre`, this.bookController.getBooksByGenre);
    this.router.get(`${this.path}/author/:author`, this.bookController.getBooksByAuthor);
    this.router.get(`${this.path}/:id`, this.bookController.getBook);
    this.router.put(`${this.path}/:id`, this.bookController.updateBook);
    this.router.delete(`${this.path}/:id`, this.bookController.deleteBook);
  }
}

export default BookRoutes;
