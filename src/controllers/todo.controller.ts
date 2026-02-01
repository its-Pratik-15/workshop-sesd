import { Request, Response } from "express";
import TodoService from "../services/todo.service";

class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  public createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const todoData = req.body;
      const todo = await this.todoService.createTodo(todoData);
      res.status(201).json({
        success: true,
        message: "Todo created successfully",
        data: todo,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create todo",
      });
    }
  };

  public getTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const todo = await this.todoService.getTodoById(id);
      res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Failed to fetch todo",
      });
    }
  };

  public getAllTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      let sort: any;
      if (req.query.sort) {
        sort = {};
        const sortParams = (req.query.sort as string).split(",");
        sortParams.forEach((param) => {
          const [field, order] = param.split(":");
          sort[field] = order === "-1" ? -1 : 1;
        });
      }

      const result = await this.todoService.getAllTodos(page, limit, sort, search);

      res.status(200).json({
        success: true,
        data: result.todos,
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
        message: error.message || "Failed to fetch todos",
      });
    }
  };

  public updateTodo = async (req: Request, res: Response): Promise<void> => {
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

      const updatedTodo = await this.todoService.updateTodo(id, updateData);
      res.status(200).json({
        success: true,
        message: "Todo updated successfully",
        data: updatedTodo,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update todo",
      });
    }
  };

  public deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const deletedTodo = await this.todoService.deleteTodo(id);
      res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: deletedTodo,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Failed to delete todo",
      });
    }
  };

  public getTodosByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.params as { status: string };
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const statusBool = status.toLowerCase() === "completed" ? true : false;

      const result = await this.todoService.getTodosByStatus(statusBool, page, limit);

      res.status(200).json({
        success: true,
        data: result.todos,
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
        message: error.message || "Failed to fetch todos by status",
      });
    }
  };

  public completeTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const completedTodo = await this.todoService.completeTodo(id);
      res.status(200).json({
        success: true,
        message: "Todo marked as completed",
        data: completedTodo,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Failed to complete todo",
      });
    }
  };

  public pendingTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const pendingTodo = await this.todoService.pendingTodo(id);
      res.status(200).json({
        success: true,
        message: "Todo marked as pending",
        data: pendingTodo,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "Failed to mark todo as pending",
      });
    }
  };

  public getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.todoService.getStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch statistics",
      });
    }
  };
}

export default TodoController;
