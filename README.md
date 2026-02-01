# Book Management System - CRUD Backend

A full-fledged CRUD backend application built with Node.js, Express, TypeScript, and MongoDB. This project demonstrates proper OOP architecture with a clean separation of concerns: Controllers → Services → Repositories.

## Features

### Core CRUD Operations
- ✅ **Create** - Add new books to the system
- ✅ **Read** - Retrieve single book or list of books
- ✅ **Update** - Modify existing book details
- ✅ **Delete** - Remove books from the system

### Advanced Features
- 🔍 **Search** - Full-text search across title, description, and author
- 🎯 **Filtering** - Filter by genre, author, price range, and publication year
- 📊 **Sorting** - Sort results by any field in ascending or descending order
- 📄 **Pagination** - Paginate results with configurable page size
- ✔️ **Validation** - Comprehensive input validation and error handling
- 🏗️ **Clean Architecture** - Repository → Service → Controller pattern

### Data Model
Books include:
- Title, Author, ISBN (unique)
- Genre (Fiction, Non-Fiction, Science, History, Biography, Mystery, Romance, Fantasy)
- Published Year, Pages, Price, Stock
- Description, Timestamps (createdAt, updatedAt)

## Project Structure

```
src/
├── controllers/
│   ├── book.controller.ts      # Request handlers
│   └── todo.controller.ts
├── services/
│   └── book.service.ts         # Business logic
├── repositories/
│   └── book.repository.ts      # Data access layer
├── models/
│   ├── book.model.ts           # Mongoose schema
│   └── todo.model.ts
├── routes/
│   ├── book.routes.ts          # Route definitions
│   └── todo.routes.ts
├── utils/
│   ├── book.interface.ts       # TypeScript interfaces
│   ├── todo.interface.ts
│   └── route.Interface.ts
├── app.ts                      # Express app setup
└── server.ts                   # Server entry point
```

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd workshop
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file in the root directory
```env
MONGODB_URI=mongodb://localhost:27017/book-management
PORT=8080
```

4. Start the development server
```bash
npm run dev
```

The server will start on `http://localhost:8080`

## API Endpoints

### Create Book
```
POST /book/create
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0743273565",
  "genre": "Fiction",
  "publishedYear": 1925,
  "pages": 180,
  "price": 12.99,
  "stock": 50,
  "description": "A classic American novel"
}
```

### Get All Books (with filtering, sorting, pagination)
```
GET /book/list/all?page=1&limit=10&genre=Fiction&sort=title:1&search=gatsby

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 10, max: 100)
- genre: Filter by genre
- author: Filter by author (case-insensitive)
- minPrice: Minimum price filter
- maxPrice: Maximum price filter
- minYear: Minimum publication year
- maxYear: Maximum publication year
- sort: Sort fields (format: field:1 for asc, field:-1 for desc, comma-separated)
- search: Search in title, description, and author
```

### Get Single Book
```
GET /book/:id
```

### Update Book
```
PUT /book/:id
Content-Type: application/json

{
  "price": 14.99,
  "stock": 45
}
```

### Delete Book
```
DELETE /book/:id
```

### Get Books by Genre
```
GET /book/genre/:genre?page=1&limit=10

Example: GET /book/genre/Fiction?page=1&limit=10
```

### Get Books by Author
```
GET /book/author/:author?page=1&limit=10

Example: GET /book/author/F.%20Scott%20Fitzgerald?page=1&limit=10
```

### Get Books by Price Range
```
GET /book/price-range?minPrice=10&maxPrice=50&page=1&limit=10
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "genre": "Fiction",
    "publishedYear": 1925,
    "pages": 180,
    "price": 12.99,
    "stock": 50,
    "description": "A classic American novel",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### List Response with Pagination
```json
{
  "success": true,
  "data": [
    { /* book object */ },
    { /* book object */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Book with this ISBN already exists"
}
```

## Architecture Overview

### Repository Pattern
The `BookRepository` class handles all database operations:
- Encapsulates MongoDB queries
- Provides reusable data access methods
- Enables easy testing and database switching

### Service Layer
The `BookService` class contains business logic:
- Validates input data
- Implements business rules
- Coordinates between controller and repository
- Handles error scenarios

### Controller Layer
The `BookController` class manages HTTP requests:
- Parses query parameters and request body
- Calls appropriate service methods
- Formats and returns responses
- Handles HTTP status codes

## Validation

The system includes comprehensive validation:
- **Required Fields**: Title, Author, ISBN, Genre, PublishedYear, Pages, Price
- **Field Types**: Proper type checking for all inputs
- **Unique Constraints**: ISBN must be unique
- **Range Validation**: Pages > 0, Price >= 0, Stock >= 0
- **Enum Validation**: Genre must be from predefined list
- **Year Validation**: Published year cannot be in the future

## Error Handling

All endpoints include proper error handling:
- 400 Bad Request - Invalid input or validation errors
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server errors

## Technologies Used

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Development**: ts-node-dev

## Development

### Scripts
```bash
npm run dev    # Start development server with auto-reload
npm test       # Run tests (to be implemented)
```

### Code Style
- TypeScript strict mode enabled
- Proper type annotations throughout
- Clean, readable code with comments
- Follows OOP principles

## Future Enhancements

- Authentication & Authorization (JWT)
- Rate limiting
- Caching (Redis)
- Advanced search with Elasticsearch
- Unit and integration tests
- API documentation with Swagger
- Book reviews and ratings
- Inventory management
- Order management system

## License

ISC

## Author

SESD Workshop Submission
