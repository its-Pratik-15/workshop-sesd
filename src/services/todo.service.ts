import TodoRepository from "../repositories/todo.repository";
import { TodoInterface } from "../utils/todo.interface";

class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  public async createTodo(todoData: TodoInterface): Promise<any> {
    if (!todoData.title || typeof todoData.title !== "string") {
      throw new Error("Title is required and must be a string");
    }

    if (todoData.title.trim().length === 0) {
      throw new Error("Title cannot be empty");
    }

    if (todoData.status !== undefined && typeof todoData.status !== "boolean") {
      throw new Error("Status must be a boolean");
    }

    return await this.todoRepository.create({
      title: todoData.title.trim(),
      status: todoData.status || false,
    });
  }

  public async getTodoById(id: string): Promise<any> {
    if (!id) {
      throw new Error("Todo ID is required");
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    return todo;
  }

  public async getAllTodos(
    page: number = 1,
    limit: number = 10,
    sort?: any,
    search?: string
  ): Promise<any> {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    if (search && search.trim()) {
      return await this.todoRepository.search(search.trim(), page, limit);
    }

    return await this.todoRepository.findAll(page, limit, sort);
  }

  public async getTodosByStatus(
    status: boolean,
    page: number = 1,
    limit: number = 10
  ): Promise<any> {
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100;

    return await this.todoRepository.findByStatus(status, page, limit);
  }

  public async updateTodo(id: string, updateData: Partial<TodoInterface>): Promise<any> {
    if (!id) {
      throw new Error("Todo ID is required");
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    if (updateData.title !== undefined) {
      if (typeof updateData.title !== "string") {
        throw new Error("Title must be a string");
      }
      if (updateData.title.trim().length === 0) {
        throw new Error("Title cannot be empty");
      }
      updateData.title = updateData.title.trim();
    }

    if (updateData.status !== undefined && typeof updateData.status !== "boolean") {
      throw new Error("Status must be a boolean");
    }

    const updatedTodo = await this.todoRepository.update(id, updateData);
    return updatedTodo;
  }

  public async deleteTodo(id: string): Promise<any> {
    if (!id) {
      throw new Error("Todo ID is required");
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    return await this.todoRepository.delete(id);
  }

  public async completeTodo(id: string): Promise<any> {
    if (!id) {
      throw new Error("Todo ID is required");
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    return await this.todoRepository.update(id, { status: true });
  }

  public async pendingTodo(id: string): Promise<any> {
    if (!id) {
      throw new Error("Todo ID is required");
    }

    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error("Todo not found");
    }

    return await this.todoRepository.update(id, { status: false });
  }

  public async getStats(): Promise<any> {
    const completed = await this.todoRepository.getCompletedCount();
    const pending = await this.todoRepository.getPendingCount();
    const total = completed + pending;

    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(2) : 0,
    };
  }
}

export default TodoService;
