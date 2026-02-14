# Bloglist App (Backend)

A robust RESTful API built with **Node.js** and **Express 5**, designed to serve the Bloglist Frontend. This backend handles user authentication, blog post management, and database interactions using MongoDB.

##  Features

* **REST API:** rigorous implementation of HTTP methods (GET, POST, PUT, DELETE).
* **Authentication:** Secure user login using **JSON Web Tokens (JWT)**.
* **Password Security:** User passwords are hashed using **bcrypt** before storage.
* **Database:** Integration with **MongoDB** via Mongoose schemas and validation.
* **Testing:** Comprehensive test suite using **Jest** and **Supertest**.
* **Error Handling:** Centralized middleware for handling exceptions and validation errors.

##  Tech Stack

**Core:**
* **Node.js** 
* **Express (v5)**
* **MongoDB & Mongoose (v9):** NoSQL database and object modeling.
* **Cors:** Middleware to enable Cross-Origin Resource Sharing.

**Security & Auth:**
* **jsonwebtoken:** For generating and verifying access tokens.
* **bcrypt:** For password hashing.

**Dev & Testing:**
* **Nodemon:** Hot-reloading for development.
* **Jest:** Testing framework.
* **Supertest:** HTTP assertions for testing API endpoints.
* **ESLint** 

##  Installation & Setup

1.  **Clone the repository**
    

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory. Do **not** commit this file. Add the following keys:

    ```env
    PORT=3003
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/blog-list-app
    TEST_MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/test-db
    SECRET=your_super_secret_string_for_signing_tokens
    ```

4.  **Run the Server:**

    * **Development Mode:**
        ```bash
        npm run dev
        ```
    * **Production Mode:**
        ```bash
        npm start
        ```

##  API Endpoints

The API is structured around the following resources.
*Note: Most write operations (POST, PUT, DELETE) require a valid Bearer Token in the `Authorization` header.*

###  Blogs (`/api/blogs`)

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Retrieve all blogs (populated with user info). | ❌ |
| `GET` | `/:id` | Retrieve a single blog by ID. | ❌ |
| `POST` | `/` | Create a new blog post. | ✅ |
| `DELETE` | `/:id` | Delete a blog (User must be the owner). | ✅ |
| `PUT` | `/:id` | Increment likes for a blog by 1. | ✅ |
| `PUT` | `/:id/updateBlog` | Update blog details (title, author, url). | ❌ |

###  Users (`/api/users`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all users (populated with their blogs). |
| `GET` | `/:id` | Get details of a specific user. |
| `POST` | `/` | Register a new user. |
| `DELETE` | `/:id` | Delete a user. |

###  Authentication (`/api/login`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/` | Authenticate user and receive a JWT. |

##  Testing

This project uses Jest for testing. The environment is configured to use a separate test database (`TEST_MONGODB_URI`).

```bash
# Run all tests
npm test

```

##  Contributing

Contributions are welcome! Please follow the existing code style and ensure all tests pass before submitting a Pull Request.

##  License

This project is part of the **Full Stack Open** course curriculum.

---

*Developed by juanma-alb as part of my ongoing training in web development.*





