# E-Commerce Platform Backend API

A robust RESTful API built with Node.js, Express, and MongoDB for managing an e-commerce platform. This backend service provides complete user authentication, product management, and order processing functionality.

## 🚀 Features

- **User Management**

  - User registration and authentication
  - JWT-based authorization
  - Role-based access control (Customer/Admin)
  - Secure password hashing with bcrypt

- **Product Management**

  - CRUD operations for products
  - Category-based product organization (Electronics, Fashion, Sports, Home, Toys)
  - Admin-only product creation, update, and deletion
  - Public product listing and retrieval

- **Order Management**
  - Create orders with multiple products
  - Order status tracking (pending, processing, completed, cancelled)
  - Comprehensive order history with filtering and pagination
  - User-specific order history with statistics
  - Admin dashboard for all orders
  - Date range filtering and sorting options
  - Automatic total price calculation

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **File Upload:** multer
- **CORS:** Cross-Origin Resource Sharing enabled
- **Environment Variables:** dotenv

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd E-Commerce-Platform
```

### 2. Navigate to Backend Directory

```bash
cd Backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Configuration

Create a `.env` file in the `Backend` directory with the following variables:

```env
PORT=8085
DEV_MODE=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**Example Configuration:**

```env
PORT=8085
DEV_MODE=development
MONGO_URI=mongodb://localhost:27017/ecommerce
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
JWT_SECRET=mysupersecretjwtkey123456
```

### 5. Start the Server

**Development Mode (with auto-restart):**

```bash
npm run dev
```

**Production Mode:**

```bash
npm start
```

The server will start on `http://localhost:8085`

## 📁 Project Structure

```
Backend/
├── config/
│   └── db.js                      # Database configuration
├── controllers/
│   ├── userController.js          # User business logic
│   ├── productController.js       # Product business logic
│   ├── orderController.js         # Order business logic
│   └── orderHistoryController.js  # Order history & analytics
├── middlewares/
│   ├── AuthMiddleware.js          # Authentication & Authorization
│   └── validationMiddleware.js    # Input validation
├── models/
│   ├── user.js                    # User schema
│   ├── product.js                 # Product schema
│   ├── order.js                   # Order schema
│   └── orderHistory.js            # Order history schema
├── routes/
│   ├── userRoutes.js              # User endpoints
│   ├── productRoutes.js           # Product endpoints
│   ├── orderRoutes.js             # Order endpoints
│   └── orderHistoryRoutes.js      # Order history endpoints
├── .env                           # Environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # Dependencies and scripts
└── server.js                      # Application entry point
```

## 🔌 API Endpoints

## Postman URL

https://www.postman.com/aviation-geoscientist-71375974/gamage/collection/32083296-f442a40c-1398-42a5-9a57-67f92bdd66de?action=share&source=copy-link&creator=32083296

### User Routes (`/api/v1/users`)

| Method | Endpoint    | Description       | Access |
| ------ | ----------- | ----------------- | ------ |
| POST   | `/register` | Register new user | Public |
| POST   | `/login`    | User login        | Public |

**Register Request Body:**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": 1
}
```

**Login Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Product Routes (`/api/v1/products`)

| Method | Endpoint             | Description        | Access |
| ------ | -------------------- | ------------------ | ------ |
| GET    | `/getProducts`       | Get all products   | Public |
| POST   | `/createProduct`     | Create new product | Admin  |
| PUT    | `/updateProduct/:id` | Update product     | Admin  |
| DELETE | `/deleteProduct/:id` | Delete product     | Admin  |

**Create Product Request Body:**

```json
{
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "quantity": 100,
  "category": "Electronics"
}
```

**Categories:** `Electronics`, `Fashion`, `Sports`, `Home`, `Toys`

### Order Routes (`/api/v1/order`)

| Method | Endpoint  | Description      | Access        |
| ------ | --------- | ---------------- | ------------- |
| POST   | `/orders` | Create new order | Authenticated |

**Create Order Request Body:**

```json
{
  "items": [
    {
      "product": "product_id",
      "name": "Product Name",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "totalPrice": 199.98,
  "status": "Pending"
}
```

### Order History Routes (`/api/v1/orderHistory`)

| Method | Endpoint        | Description              | Access        |
| ------ | --------------- | ------------------------ | ------------- |
| GET    | `/my-orders`    | Get user's order history | Authenticated |
| GET    | `/admin/orders` | Get all orders (Admin)   | Admin         |

**Query Parameters for Order History:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, processing, completed, cancelled)
- `fromDate` - Filter orders from date (ISO format)
- `toDate` - Filter orders to date (ISO format)
- `sortBy` - Sort field:direction (e.g., createdAt:desc, totalAmount:asc)

**Example Request:**

```
GET /api/v1/orderHistory/my-orders?page=1&limit=10&status=completed&sortBy=createdAt:desc
```

**Response includes:**

- Order list with populated product details
- Pagination metadata (total, pages, current page)
- User statistics (total orders, total spent, order counts by status)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. After successful login, include the token in your requests:

**Header:**

```
Authorization: Bearer <your_jwt_token>
```

Or the token can be sent via cookies as `token`.

## 👥 User Roles

- **Role 1:** Customer (default) - Can create orders, view products
- **Role 2:** Admin - Full access including product management

## 🧪 Testing the API

You can test the API using:

- **Postman** - Import endpoints and test
- **Thunder Client** - VS Code extension
- **cURL** - Command line testing

**Example cURL request:**

```bash
curl -X POST http://localhost:8085/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "role": 1
  }'
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running locally or check Atlas connection string
- Ensure IP whitelist is configured for MongoDB Atlas
- Check firewall settings

### Port Already in Use

- Change the PORT in `.env` file
- Kill the process using the port: `netstat -ano | findstr :8085` (Windows)

### JWT Token Issues

- Ensure JWT_SECRET is set in `.env`
- Check token expiration settings
- Verify token is included in request headers

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run server` - Alternative dev command

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

## 👨‍💻 Author

**Gamage Recruiters**

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB for the robust database solution
- All open-source contributors

---

**Note:** Remember to never commit your `.env` file to version control. Add it to `.gitignore` to keep your sensitive information secure.
