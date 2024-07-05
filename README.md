# Dev Site
[http://railway.app](http://railway.app)

# API Endpoints

### Auth

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| /auth/register | POST | Register a new user |
| /auth/login | POST | Login a user |
| /auth/me | GET | Get user profile |
| /auth/profile | PUT | Update user profile |

### Products

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| /products | GET | Get all products |
| /products | POST | Create a new product |
| /products/:id | GET | Get a product by ID |
| /products/:id | PUT | Update a product by ID |
| /products/:id | DELETE | Delete a product by ID |

### Categories

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| /categories | GET | Get all categories |
| /categories | POST | Create a new category |
| /categories/:id | GET | Get a category by ID |
| /categories/:id | PUT | Update a category by ID |
| /categories/:id | DELETE | Delete a category by ID |

### Orders

| Endpoint | Method | Description |
| -------- | ------ | ----------- |
| /orders | GET | Get all orders |
| /orders | POST | Create a new order |
