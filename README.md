
# Blog List Backend 

Backend API for a Blog List application. Built with Node.js, Express, and MongoDB for the **Full Stack Open course - Part 4**.

## Getting Started

To run this project locally, follow these steps:

### 1. Install Dependencies
```bash
npm install

```

### 2. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=3003

```

### 3. Run the Application

* **Development mode:**
```bash
npm run dev

```


* **Production mode:**
```bash
npm start

```


* **Run Tests:**
```bash
npm test

```


## 🛠 Tech Stack

* Node.js & Express
* MongoDB (Mongoose)
* Jest & Supertest (Testing)
* ESLint (Linting)

## API Endpoints (Current)

* `GET /api/blogs` - Fetch all blogs
* `POST /api/blogs` - Add a new blog

