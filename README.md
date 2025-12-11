# 🍌 Banana Match-up

Banana Match-up is an interactive fruit-matching game built using **React.js**, with a backend using **Node.js + Express + MySQL**.  
This project is developed as part of the SLIIT City University Software for Enterprise module assignment.

## 🚀 Features
- User authentication (login/signup) with JWT token validation
- Interactive game interface with **Banana API** puzzles
- Animated score tracking for Beginner, Intermediate, and Advanced levels
- Leaderboard to display top players
- Virtual player identity and progression system
- Event-driven game mechanics with rounds, levels, and bonus bananas
- Backend REST API for game logic, scoring, and dashboard

## 🧩 Tech Stack
- **Frontend:** React.js, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js, Sequelize ORM
- **Database:** MySQL
- **APIs:** Banana API

## 🗂 Project Structure (Backend)
- `models/` – Sequelize models (`User`, `Player`, `Level`, `Round`, `Score`, `BananaGame`) with associations
- `routes/` – Express routes (`authRoutes`, `userRoutes`, `dashboardRoutes`, `levelRoutes`, `bananaRoutes`, `leaderboardRoutes`, `playerRoutes`)
- `controllers/` – Game and score logic (save beginner/intermediate/advanced scores, fetch leaderboard, player results)
- `config/db.js` – Sequelize database connection
- `server.js` – Express server setup with middleware, routes, and error handling

### Key Model Associations
- **User → Player:** 1:1 (User has one Player)
- **Level → Round:** 1:N (Level has many Rounds)
- **Player → Score:** 1:N (Player has many Scores)
- **Level → Score:** 1:N (Level has many Scores)
- **Player → BananaGame:** 1:N (Player has many BananaGame entries)

### Game Logic
- Levels: Beginner → Intermediate → Advanced
- Each level has multiple rounds with clues, options, and answers
- Bonus bananas are converted into points dynamically per level
- Score transactions are additive and merged if submitted recently to avoid double-counting
- Dashboard shows total scores, current level, and points needed for next level

## 💻 Setup Instructions
```bash
# Clone the repository
git clone https://github.com/dilushisewwandi/Banana-Match-up.git

# Frontend setup
cd client
npm install
npm start

# Backend setup
cd ../server
npm install

# Create .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, PORT
npm start
