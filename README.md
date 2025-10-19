# Menu Management API (Node.js + Express + MongoDB)

Backend server for managing Categories, Subcategories, and Items. Designed for deployment on Railway and local development.

Deployed Link: https://guestara-assignment-ib43.onrender.com

## Tech Stack
- Node.js, Express
- MongoDB with Mongoose
- CORS, Morgan, Dotenv

## Getting Started

1) Clone and install
```
npm i
```

2) Configure environment
- Copy `.env.example` to `.env` and set:
```
MONGODB_URI=mongodb+srv://...
PORT=3000
NODE_ENV=development
```

3) Run locally
```
npm run dev
```
Server starts on `http://localhost:3000`.


## Data Model

Category
- name (string, required, unique)
- image (url string)
- description (string)
- taxApplicable (boolean)
- tax (number)
- taxType (string)

SubCategory
- category (ref Category, required)
- name (string, required, unique)
- image, description
- taxApplicable (boolean, defaults from parent Category if omitted)
- tax (number, defaults from parent Category if omitted)

Item
- category (ref Category) or subCategory (ref SubCategory) — exactly one required
- name (string, required, unique)
- image, description
- taxApplicable (boolean, defaults from parent if omitted)
- tax (number, defaults from parent if omitted)
- baseAmount (number, required)
- discount (number, default 0)
- totalAmount (number = baseAmount - discount, computed)

## API
Base URL: `/api`

Categories
- POST `/categories` — create
  - body: { name, image, description, taxApplicable, tax, taxType }
- GET `/categories` — list all
- GET `/categories/:idOrName` — get by id or name
- PATCH `/categories/:id` — update any attributes
- Helpers:
  - POST `/categories/:categoryId/subcategories` — create subcategory under category
  - GET `/categories/:categoryId/subcategories` — list subcategories of category
  - POST `/categories/:categoryId/items` — create item under category
  - GET `/categories/:categoryId/items` — list items under category

SubCategories
- POST `/subcategories` — create (body.categoryId required)
- GET `/subcategories` — list all
- GET `/subcategories/:idOrName` — get by id or name
- PATCH `/subcategories/:id` — update
- Helpers:
  - POST `/subcategories/:subCategoryId/items` — create item under subcategory
  - GET `/subcategories/:subCategoryId/items` — list items under subcategory

Items
- POST `/items` — create (body.categoryId XOR body.subCategoryId)
  - body: { name, image, description, taxApplicable?, tax?, baseAmount, discount? }
- GET `/items` — list all
- GET `/items/search?name=TEXT` — search by name (case-insensitive)
- GET `/items/by-category/:categoryId` — list by category
- GET `/items/by-subcategory/:subCategoryId` — list by subcategory
- GET `/items/:idOrName` — get by id or name
- PATCH `/items/:id` — update

Notes
- SubCategory defaults for tax/taxApplicable inherit from parent Category when omitted.
- Item defaults for tax/taxApplicable inherit from parent SubCategory (if provided) else Category.
- Item `totalAmount` is recalculated on create/update.

## Example Requests

Create Category
```
POST /api/categories
{
  "name": "Beverages",
  "image": "https://example.com/bev.png",
  "description": "Drinks",
  "taxApplicable": true,
  "tax": 10,
  "taxType": "GST"
}
```

Create SubCategory
```
POST /api/categories/{{categoryId}}/items
{
  "name": "Hot Drinks",
  "description": "Warm beverages"
  "baseAmount": 250
}
```

Create Item under SubCategory
```
POST /api/subcategories/{{subcategoryId}}/items
{
  "name": "Espresso",
  "baseAmount": 120,
  "discount": 20
}
```

Search Item by name
```
GET /api/items/search?name=esp
```

## Project Structure
```
src/
  config/db.js
  controllers/
    categoryController.js
    subCategoryController.js
    itemController.js
  middleware/error.js
  models/
    Category.js
    SubCategory.js
    Item.js
  routes/
    categories.js
    subcategories.js
    items.js
  utils/
    mongo.js
    wrapAsync.js
  server.js
```

### 1. Which database you have chosen and why?
I chose MongoDB as the database for this project.
MongoDB’s document-based structure makes it ideal for managing hierarchical data like Categories, Subcategories, and Items without complex joins.

### 2. 3 things that you learned from this assignment?
- Implementing tax inheritance and default values from Category to Subcategory and Items helped me better understand conditional field logic.
- How to use MongoDB to manage hierarchical data.
- Implementing error middleware for consistent error handling.

### 3. What was the most difficult part of the assignment?
The most challenging part was maintaining relational consistency across Categories, Subcategories, and Items, especially ensuring that updates or deletions cascade properly without breaking the structure.

### 4. What you would have done differently given more time?
- Validated input with Zod for better validation and error handling.
- Added pagination and filtering to improve performance for large datasets.
- Would have used typescript to improve code quality and maintainability instead of javascript.