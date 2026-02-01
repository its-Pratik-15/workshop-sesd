import { Router } from "express";
import { Routes } from "../utils/route.Interface";
import TodoController from "../controllers/todo.controller";

class TodoRoutes implements Routes {
  path?: string = "/todo";
  router: Router = Router();
  public todoController = new TodoController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/create`, this.todoController.createTodo);
    this.router.get(`${this.path}/list/all`, this.todoController.getAllTodos);
    this.router.get(`${this.path}/stats`, this.todoController.getStats);
    this.router.get(`${this.path}/status/:status`, this.todoController.getTodosByStatus);
    this.router.get(`${this.path}/:id`, this.todoController.getTodo);
    this.router.put(`${this.path}/:id`, this.todoController.updateTodo);
    this.router.delete(`${this.path}/:id`, this.todoController.deleteTodo);
    this.router.patch(`${this.path}/:id/complete`, this.todoController.completeTodo);
    this.router.patch(`${this.path}/:id/pending`, this.todoController.pendingTodo);
  }
}

export default TodoRoutes;
