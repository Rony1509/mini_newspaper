# Post CRUD — Angular + Node.js + Express + MongoDB

Full-stack Post CRUD application with Angular 17 standalone frontend and Node.js/Express/MongoDB backend.

---

## Project Structure

```
project/
├── backend/
│   ├── models/Post.js
│   ├── routes/posts.js
│   ├── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── main.ts
    │   ├── styles.css
    │   ├── index.html
    │   └── app/
    │       ├── app.component.ts
    │       ├── app.config.ts
    │       ├── models/post.model.ts
    │       ├── services/post.service.ts
    │       └── components/posts/
    │           ├── posts.component.ts
    │           ├── posts.component.html
    │           └── posts.component.css
    ├── angular.json
    ├── tsconfig.json
    └── package.json
```

---

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongod`)
- Angular CLI: `npm install -g @angular/cli`

---

## Backend Setup

```bash
cd backend
npm install
# Edit .env if needed (default: PORT=3000, local MongoDB)
node server.js
```

The server starts at **http://localhost:3000**

### REST API Endpoints

| Method | URL               | Description         |
|--------|-------------------|---------------------|
| GET    | /api/posts        | Get all posts       |
| GET    | /api/posts/:id    | Get single post     |
| POST   | /api/posts        | Create post         |
| PUT    | /api/posts/:id    | Update post         |
| DELETE | /api/posts/:id    | Delete post         |

### Post Schema

```json
{
  "_id":       "MongoDB ObjectId",
  "title":     "String (required)",
  "body":      "String (required)",
  "userId":    "Number (default: 1)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## Frontend Setup

```bash
cd frontend
npm install
ng serve
```

The app runs at **http://localhost:4200**

---

## Features

- ✅ Full CRUD — Create, Read, Update, Delete
- ⚡ Optimistic UI updates with automatic rollback on failure
- 🔍 Real-time search by title or body
- 📄 Load More pagination (10 posts at a time)
- 🔔 Toast notifications (success & error)
- 🏷️ NEW and UPDATED badges on posts
- 💀 Skeleton loading state
- 📱 Responsive layout

---

## .env Variables

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/postdb
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/postdb?retryWrites=true&w=majority
```
# mini_newspaper
