import { model, Schema } from "mongoose";
import { TodoDocument, TodoModelInterface } from "../utils/todo.interface";

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const TodoModel = model<TodoDocument, TodoModelInterface>("Todo", todoSchema);

export default TodoModel;
