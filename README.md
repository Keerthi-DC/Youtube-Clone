# YouTube Clone - Full-Stack MERN Capstone Project

A full-stack, responsive YouTube Clone application built using the MERN stack (**M**ongoDB, **E**xpress.js, **R**eact 18/19, **N**ode.js with ES Modules). Designed with modern dark theme aesthetics, custom design tokens, responsive breakpoints, real-time title search, category filter chips, dynamic HTML5 video player, like/dislike toggle states, full **Comment CRUD**, and full **Channel & Video CRUD** management.

---

## 🌟 Key Features

### 1. Home Page UI & UX
- **YouTube Header**: Includes hamburger menu toggle, YouTube logo, central title search bar, and user profile avatar / sign-in button.
- **Collapsible Sidebar**: Navigation links (Home, Explore, Subscriptions, Library, History, My Channel, Liked Videos) with responsive mobile drawer support.
- **Category Filter Chips**: Filter bar featuring 8 dynamic categories (`All`, `React`, `Coding`, `Music`, `Gaming`, `News`, `Podcasts`, `Tech`).
- **Responsive Video Grid**: Cards displaying thumbnail, video title, uploader avatar, channel name, views (`15.2K views`), and relative upload time.

### 2. User Authentication (JWT + Password Validation)
- **Register Flow (`/register`)**: Strong password validation enforcing:
  - Minimum 8 characters
  - At least 1 uppercase letter (`A-Z`)
  - At least 1 lowercase letter (`a-z`)
  - At least 1 number (`0-9`)
  - At least 1 special character (`@$!%*?&` etc.)
  - Real-time password requirement checklist UI feedback.
  - **Auth Flow Compliance**: Registration returns a success message **WITHOUT issuing a JWT token** and automatically redirects the user to `/login`.
- **Login Flow (`/login`)**: Authenticates credentials and issues a JWT token. Stores token securely in `localStorage` and updates header state with user details.

### 3. Video Player Page (`/watch/:id`)
- **HTML5 Video Player**: Custom playback with fallback streaming support.
- **Video Metadata**: Title, channel profile, subscriber count, collapsible description box, and view counter.
- **Interactive Likes & Dislikes**: Toggleable like and dislike state per logged-in user with live count updates.
- **Comment Section CRUD**:
  - **Create**: Add new comments saved to MongoDB along with video ID reference.
  - **Read**: View sorted comment thread with user avatars.
  - **Update**: Inline edit comment text (for comment author).
  - **Delete**: Remove comments (for comment author).

### 4. Channel Page & Video Management (`/channel/:id`)
- **Channel Header**: Banner, avatar, channel name, subscriber count, and bio description.
- **Create Channel**: Modal form allowing signed-in users to launch their channel.
- **Video CRUD Management**:
  - **Upload Video**: Modal to publish new videos with thumbnail, video stream URL, category, and description.
  - **Edit Video**: Modal to modify existing video metadata.
  - **Delete Video**: Confirmation prompt to delete videos from channel and database.

### 5. Resilient Database & Zero-Setup Fallback
- Connects automatically to local MongoDB (`mongodb://127.0.0.1:27017/youtube_clone` or `MONGO_URI`).
- **Automatic Memory Fallback**: If local MongoDB is not running, backend automatically boots `mongodb-memory-server`, allowing evaluators to run `npm start` immediately without any database pre-configuration!

---

## 🛠️ Technology Stack & Versions

- **Frontend**: React (`^18.3.1`), Vite (`^6.0.5`), React Router DOM (`^6.28.0`), Axios (`^1.7.9`), Lucide React (`^0.474.0`), Vanilla Dark CSS Design Tokens.
- **Backend**: Node.js (`ES Modules`), Express (`^5.0.1`), Mongoose (`^8.18.0`), Jsonwebtoken (`^9.0.2`), Bcryptjs (`^2.4.3`), Cors (`^2.8.5`), Dotenv (`^16.4.7`), Mongodb-memory-server (`^10.1.0`).

---

## 📁 Repository Structure

```
youtube-clone/
├── README.md
├── .gitignore
├── server/
│   ├── package.json
│   ├── .env
│   ├── .env.example
│   ├── seed.js
│   └── src/
│       ├── config/
│       │   └── db.js
│       ├── models/
│       │   ├── User.js
│       │   ├── Channel.js
│       │   ├── Video.js
│       │   └── Comment.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── validatePassword.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── videoController.js
│       │   ├── channelController.js
│       │   └── commentController.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── videoRoutes.js
│       │   ├── channelRoutes.js
│       │   └── commentRoutes.js
│       └── index.js
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── index.css
        ├── main.jsx
        ├── App.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Header.jsx
        │   ├── Sidebar.jsx
        │   ├── FilterBar.jsx
        │   ├── VideoCard.jsx
        │   ├── CommentItem.jsx
        │   ├── VideoModal.jsx
        │   └── ChannelModal.jsx
        └── pages/
            ├── HomePage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── WatchPage.jsx
            └── ChannelPage.jsx
```

---

## 🚀 Quick Setup & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Backend Setup (`server/`)
```bash
cd server
npm install
```

#### Seed Database with Sample Data
```bash
npm run seed
```

#### Start Backend Server
```bash
npm start
```
*Server will run at `http://localhost:5000`*

### 2. Frontend Setup (`client/`)
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
*Vite Dev Server will run at `http://localhost:5173`*

---

## 🔑 Default Credentials (from `npm run seed`)

| Role | Username | Email | Password |
|---|---|---|---|
| User 1 / Channel Owner | JohnDoe | john@example.com | Pass@1234 |
| User 2 / Channel Owner | CodeWithSara | sara@example.com | Pass@1234 |
| User 3 | TechGeek | alex@example.com | Pass@1234 |

---

## 🌐 API Endpoint Reference

### Auth Routes (`/api/auth`)
- `POST /api/auth/register` - Register user with password validation (Returns success msg, NO JWT).
- `POST /api/auth/login` - Authenticate user credentials and return JWT token.
- `GET /api/auth/me` - Get logged-in user profile (Protected).

### Video Routes (`/api/videos`)
- `GET /api/videos` - Get all videos (Supports `?search=` and `?category=`).
- `GET /api/videos/:id` - Get single video by ID & increment view count.
- `POST /api/videos` - Upload new video for user's channel (Protected).
- `PUT /api/videos/:id` - Edit video details (Protected, owner only).
- `DELETE /api/videos/:id` - Delete video (Protected, owner only).
- `POST /api/videos/:id/like` - Toggle video like state (Protected).
- `POST /api/videos/:id/dislike` - Toggle video dislike state (Protected).

### Channel Routes (`/api/channels`)
- `POST /api/channels` - Create a channel for authenticated user (Protected).
- `GET /api/channels/:id` - Fetch channel details and uploaded videos.
- `GET /api/channels/user/me` - Fetch authenticated user's channels (Protected).

### Comment Routes (`/api/comments`)
- `GET /api/comments/video/:videoId` - Get comments for a video.
- `POST /api/comments` - Post comment on video (Protected).
- `PUT /api/comments/:id` - Edit comment text (Protected, author only).
- `DELETE /api/comments/:id` - Delete comment (Protected, author only).
