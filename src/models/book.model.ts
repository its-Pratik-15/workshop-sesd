import { model, Schema } from "mongoose";
import { BookDocument, BookModelInterface } from "../utils/book.interface";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Mystery", "Romance", "Fantasy"],
    },
    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: [1000, "Published year must be valid"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    pages: {
      type: Number,
      required: [true, "Pages is required"],
      min: [1, "Pages must be at least 1"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const BookModel = model<BookDocument, BookModelInterface>("Book", bookSchema);

export default BookModel;
