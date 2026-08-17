# Notes App

A full-stack notes application with user authentication.

## Features
- User registration and login
- JWT authentication with httpOnly cookies
- Create, read, update, and delete notes
- Protected routes — users can only access their own notes
- Responsive UI built with EJS

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT + bcrypt
- **Deployment:** Railway

## Live Demo
[View Live App](https://your-railway-url.up.railway.app)

## Run Locally
1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with `MONGO_URI` and `JWT_SECRET`
4. Run `node app.js`
