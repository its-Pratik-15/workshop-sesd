import App from "./app";
import TodoRoutes from "./routes/todo.routes";
import BookRoutes from "./routes/book.routes";
import "dotenv/config";

const app = new App([new TodoRoutes(), new BookRoutes()]);
app.startServer();
