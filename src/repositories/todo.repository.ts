import TodoModel from "../models/todo.model";
import { TodoDocument } from "../utils/todo.interface";

class TodoRepository {
  public async create(todoData: any): Promise<TodoDocument> {
    const todo = await TodoModel.create(todoData);
    return todo;
  }

  public async findById(id: string): Promise<TodoDocument | null> {
    return await TodoModel.findById(id);
  }

  public async findAll(
    page: number = 1,
    limit: number = 10,
    sort?: any
  ): Promise<{ todos: TodoDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await TodoModel.countDocuments();

    let queryBuilder = TodoModel.find();

    if (sort) {
      queryBuilder = queryBuilder.sort(sort);
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 });
    }

    const todos = await queryBuilder.skip(skip).limit(limit).exec();
    return { todos, total };
  }

  public async findByStatus(
    status: boolean,
    page: number = 1,
    limit: number = 10
  ): Promise<{ todos: TodoDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const total = await TodoModel.countDocuments({ status });

    const todos = await TodoModel.find({ status })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return { todos, total };
  }

  public async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ todos: TodoDocument[]; total: number }> {
    const skip = (page - 1) * limit;
    const query = { title: { $regex: searchTerm, $options: "i" } };
    const total = await TodoModel.countDocuments(query);

    const todos = await TodoModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return { todos, total };
  }

  public async update(id: string, updateData: any): Promise<TodoDocument | null> {
    return await TodoModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  public async delete(id: string): Promise<TodoDocument | null> {
    return await TodoModel.findByIdAndDelete(id);
  }

  public async getCompletedCount(): Promise<number> {
    return await TodoModel.countDocuments({ status: true });
  }

  public async getPendingCount(): Promise<number> {
    return await TodoModel.countDocuments({ status: false });
  }
}

export default TodoRepository;
