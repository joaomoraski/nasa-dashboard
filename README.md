# NASA Dashboard

A full-stack web application for exploring NASA's public APIs, featuring user authentication, personalized API key management, and a favorites system. This project serves as a comprehensive refresher on modern React and Node.js development practices, implementing enterprise-level patterns and architecture.

## 🎯 Project Overview

This application provides an intuitive interface for interacting with multiple NASA APIs, allowing users to:
- Browse Astronomy Picture of the Day (APOD) images
- Search NASA's image library
- Explore Near Earth Objects (NEOs) and asteroid data
- Create accounts with custom API keys
- Save and manage favorite discoveries

Built with a focus on clean architecture, separation of concerns, and scalable patterns suitable for production environments.

## ✨ Features

### Public Features
- **APOD (Astronomy Picture of the Day)**: Daily space images with detailed information
- **NASA Image Library**: Searchable collection of NASA's image archives
- **Near Earth Objects**: Browse and explore asteroid data with detailed information

### User Features (Authentication Required)
- **User Registration & Login**: Secure JWT-based authentication system
- **Custom API Key Management**: Users can configure their own NASA API keys for personalized usage
- **Favorites System**: Save and manage favorite APOD images, NASA images, and asteroids
- **User Profile**: View and update account information, including API key customization

## 🏗️ Architecture

### Monorepo Structure
The project follows a monorepo architecture using npm workspaces:

```
nasa-dashboard/
├── apps/
│   ├── api/          # Express.js backend
│   └── web/          # React frontend
├── package.json      # Root workspace configuration
└── README.md
```

### Backend Architecture (`apps/api`)

The backend implements a **layered architecture** with clear separation of concerns:

#### **Repository Pattern**
- **Data Access Layer**: `repos/` - Handles all database interactions using Prisma ORM
- **Business Logic Layer**: `services/` - Contains validation, business rules, and orchestration
- **Presentation Layer**: `controllers/` - Handles HTTP requests/responses and delegates to services

#### **Key Components**
- **Models**: Domain entities (`User`, `Favorite`) with proper encapsulation
- **Middleware**: 
  - `auth.ts` - JWT token verification
  - `errorHandler.ts` - Centralized error handling
  - `asyncHandler.ts` - Async route wrapper for error catching
- **Utilities**: Helper functions for authentication, date formatting, and data transformation
- **Type Definitions**: TypeScript interfaces and Express type extensions

#### **Database Schema**
- **User Model**: Email, hashed password, customizable API key, timestamps
- **Favorite Model**: User favorites with flexible metadata storage (JSON)
- **Relations**: One-to-many relationship between User and Favorites

### Frontend Architecture (`apps/web`)

The frontend follows **component-based architecture** with modern React patterns:

#### **State Management**
- **Context API**: `AuthContext` for global authentication state
- **Local State**: Component-level state for UI interactions
- **Persistence**: localStorage for session management

#### **Routing**
- **React Router DOM**: Client-side routing with protected routes
- **ProtectedRoute Component**: Route guard for authenticated pages
- **Automatic Redirects**: Logged-in users redirected from auth pages

#### **Component Structure**
- **Pages**: Top-level route components (`ApodPage`, `NasaImagesPage`, etc.)
- **Components**: Reusable UI components (`Notification`, `Layout`, `Navigation`)
- **Services**: API communication layer (`authService`, `apodService`, etc.)
- **Hooks**: Custom hooks for data fetching and state management

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) with bcryptjs for password hashing
- **Development**: tsx for hot reloading

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM 7.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: React Context API

### Infrastructure
- **Database**: PostgreSQL 15 (Docker Compose)
- **Package Management**: npm workspaces
- **Development**: Concurrently for running multiple services

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for database)
- NASA API Key ([Get one here](https://api.nasa.gov/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nasa-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   cd apps/api
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Configure environment variables**

   Create `apps/api/.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nasa-dashboard"
   NASA_API_KEY="your-nasa-api-key"
   SECRET_KEY="your-jwt-secret-key"
   PORT=3000
   CORS_ORIGIN="http://localhost:5173"
   ```

   Create `apps/web/.env`:
   ```env
   VITE_API_URL="http://localhost:3000"
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - API server on `http://localhost:3000`
   - Web server on `http://localhost:5173`

## 📡 API Endpoints

### Public Endpoints
- `GET /api/apod` - Get Astronomy Picture of the Day
- `GET /api/images` - Search NASA image library
- `GET /api/asteroids` - List Near Earth Objects
- `GET /api/asteroids/:id` - Get asteroid details

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Protected Endpoints (Require JWT Token)
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/favorites` - Get user favorites
- `PUT /api/users/:id` - Update user (API key)
- `DELETE /api/users/:id` - Delete user account
- `POST /api/favorites` - Add favorite
- `GET /api/favorites/:id` - Get favorite by ID
- `GET /api/favorites/user/:userId` - Get all user favorites
- `DELETE /api/favorites/:id` - Remove favorite

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Authorization**: Users can only access/modify their own data
- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Restricted cross-origin requests
- **Error Handling**: Sanitized error messages to prevent information leakage

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: User-friendly feedback system
- **Loading States**: Visual indicators during async operations
- **Form Validation**: Real-time client-side validation
- **Protected Routes**: Automatic redirects for unauthorized access
- **Session Persistence**: Maintains login state across page reloads

## 📦 Deployment Considerations

### Backend Deployment
- **Environment Variables**: Ensure all required env vars are set
- **Database**: Use managed PostgreSQL service (AWS RDS, Heroku Postgres, etc.)
- **Build Process**: `npm run build` compiles TypeScript to JavaScript
- **Process Manager**: Use PM2 or similar for production
- **Reverse Proxy**: Nginx or similar for SSL termination

### Frontend Deployment
- **Build**: `npm run build` creates optimized production bundle
- **Static Hosting**: Deploy `dist/` folder to Vercel, Netlify, or AWS S3
- **Environment Variables**: Set `VITE_API_URL` to production API URL
- **CDN**: Consider CDN for static assets

### Database
- **Migrations**: Run `prisma migrate deploy` in production
- **Backups**: Implement regular database backups
- **Connection Pooling**: Configure appropriate pool sizes

## 🧪 Development Practices

### Code Organization
- **Separation of Concerns**: Clear boundaries between layers
- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized error handling with custom error types
- **Code Reusability**: Shared utilities and components

### Best Practices Implemented
- Repository pattern for data access
- Service layer for business logic
- Middleware for cross-cutting concerns
- Type guards for runtime type safety
- Environment-based configuration
- Structured error responses

## 📝 Project Goals & Results

### Learning Objectives
This project was developed as a comprehensive refresher on:
- Modern React patterns (Hooks, Context API, TypeScript)
- Node.js/Express.js backend development
- Database design and ORM usage (Prisma)
- Authentication and authorization
- RESTful API design
- Full-stack application architecture

### Achievements
- ✅ Complete authentication system with JWT
- ✅ User management with custom API key support
- ✅ Favorites system with flexible metadata storage
- ✅ Integration with multiple NASA APIs
- ✅ Professional UI with responsive design
- ✅ Clean, maintainable codebase following best practices
- ✅ Type-safe full-stack application
- ✅ Production-ready architecture patterns

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📄 License

This project is for educational purposes.

## 🔗 Resources

- [NASA Open APIs](https://api.nasa.gov/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

---
