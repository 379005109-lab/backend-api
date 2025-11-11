# Backend API with MongoDB

This is a RESTful API backend project built with Node.js, Express, and MongoDB.

## Project Description

This project provides a complete backend API with MongoDB integration, featuring user management endpoints (CRUD operations). The project supports both development and production environment modes.

## Environment

This project runs on a Debian 12 system with Node.js, which is pre-configured in the Devbox environment. You don't need to worry about setting up Node.js or system dependencies yourself. The development environment includes all necessary tools for building and running Node.js applications. If you need to make adjustments to match your specific requirements, you can modify the configuration files accordingly.

## Project Execution

### 🚀 Auto-Start with PM2 (Recommended)
The backend is configured to auto-start using PM2 process manager. After initial setup, the server will automatically start when you open Windsurf.

**Quick Start:**
```bash
npm run pm2:start     # Start the backend server
npm run pm2:status    # Check server status
npm run pm2:logs      # View logs
npm run pm2:restart   # Restart server
npm run pm2:stop      # Stop server
```

The PM2 daemon will automatically resurrect your saved processes when you restart Windsurf or your system.

### Manual Execution
**Development mode:** For manual development environment, run `bash entrypoint.sh` or `npm run dev` in the terminal.
**Production mode:** After release, the project will be automatically packaged into a Docker image and deployed according to the `entrypoint.sh` script and command parameters.

Within Devbox, you only need to focus on development - you can trust that everything is application-ready XD


## API Endpoints

### Health Check
- **GET** `/health` - Check server status

### Users
- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
  ```
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

## Technology Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **dotenv** - Environment configuration
- **CORS** - Cross-origin resource sharing

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env`:
   ```
   PORT=8080
   MONGODB_URI=mongodb://root:password@host:27017/database?authSource=admin
   NODE_ENV=development
   ```

3. Run the server:
   ```bash
   bash entrypoint.sh
   ```

DevBox: Code. Build. Deploy. We've Got the Rest.

With DevBox, you can focus entirely on writing great code while we handle the infrastructure, scaling, and deployment. Seamless development from start to production. 