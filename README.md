# Custom Shorten URL API Documentation

## Project Overview

**Custom Shorten URL** is an API service that allows users to create, manage, and analyze shortened URLs. The project includes OAuth 2.0 Google Sign-In functionality for secure user authentication. It also integrates Docker for containerization and is set up with a microservice architecture using Redis for caching and rate limiting.

---

## Project Structure

```
ALTEROFFICE_ASSIGNMENT
.vscode
logs
node_modules
src
├── config
│   ├── db.js
│   └── redisClient.js
├── controllers
│   ├── user.analyticController.js
│   ├── user.authController.js
│   └── user.urlController.js
├── middleware
│   ├── auth.middleware.js
│   └── ratelimit.middleware.js
├── models
│   ├── analytics.model.js
│   ├── url.model.js
│   └── user.model.js
├── routes
│   ├── analyticsRoutes.js
│   ├── urlRoutes.js
│   └── userRoutes.js
├── utils
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── logger.js
│   └── RandomString.js
├── app.js
├── index.js
├── .dockerignore
├── .env
├── .env.sample
├── .gitignore
├── .prettierignore
├── .prettierrc
├── Custom Shorten URL API.postman_collection.json
├── Dockerfile
├── package-lock.json
├── package.json
├── README.md
└── swagger.json
```

---

## Setup Instructions

### 1. Prerequisites
- **Node.js**: Ensure Node.js is installed.
- **Docker Desktop**: For containerization.
- **Google Cloud Console**: To create OAuth 2.0 credentials.
- **Postman**: For API testing.

### 2. Environment Variables
Create a `.env` file in the root directory based on `.env.sample`:
```plaintext
MONGODB_URI = <mongodb_url>
PORT = <port>
CORS_ORIGIN = <origin>
ACCESS_TOKEN_SECRET = <access_token>
ACCESS_TOKEN_EXPIRY = <expire_access_token>
REFRESH_TOKEN_SECRET = <refresh_token>
REFRESH_TOKEN_EXPIRY = <expire_refresh_token>
NODE_ENV = "production/development"
GOOGLE_CLIENT_ID = <google_client_id>
GOOGLE_CLIENT_SECRET = <google_client_secret>
REDIS_HOST = <name_of_root>
REDIS_PORT = <port>
REDIS_PASSWORD = <your_redis_password>
```

### 3. Docker Setup
To containerize the project:
```bash
# Build Docker image
docker build -t custom-shorten-url-api .

# Run Docker container
docker run -p 5000:5000 custom-shorten-url-api
```

### 4. Run Locally
To run the server locally:
```bash
npm install
install nodemon
*Server-run-commend*-`npm run dev`
```

---

## Features

### 1. User Authentication
- **Google OAuth 2.0**: Secure sign-in with Google using Client ID and Secret created in Google Cloud Console.
- **Middleware**: `auth.middleware.js` ensures protected routes.

### 2. URL Shortening
- **CRUD Operations**:
  - Create a shortened URL.
  - Retrieve original URLs.
  - Update or delete shortened URLs.
- **Controller**: `user.urlController.js` handles URL logic.

### 3. Analytics
- **Track and analyze usage**: Monitor clicks and performance of shortened URLs.
- **Controller**: `user.analyticController.js` manages analytics.

### 4. Rate Limiting
- **Redis**: Utilized to prevent abuse by implementing rate limiting.
- **Middleware**: `ratelimit.middleware.js` handles request limits.

### 5. Error Handling
- **Utilities**: `ApiError.js` and `ApiResponse.js` provide a standardized structure for errors and responses.

---

## API Documentation

### Base URL
`http://localhost:5000`

### Authentication Routes
| Method | Endpoint                   | Description          |
|--------|----------------------------|----------------------|
| POST   | `/api/auth/google-singin`  | Sign in using Google |

### URL Management Routes
| Method | Endpoint                      | Description           |
|--------|-------------------------------|-----------------------|
| POST   | `/api/url/short-url`          | Create a shortened URL|
| GET   | `/api/url/short-url/:shortUrl`| RedirectToOriginal URL|
| GET   | `/api/url/urls`               | GetAll shortened URL  |
| GET    | `/api/url/:urlId`             |Retrieve a shortened URL|
| PUT    | `/api/url/:urlId`             |Update a shortened URL  |
| DELETE | `/api/url/:urlId`             | Delete a shortened URL |

### Analytics Routes
| Method | Endpoint                          | Description                     |
|--------|-----------------------------------|---------------------------------|
| GET    | `/api/user/analytics/:alias`      | Retrieve analytics data         |
| GET    | `/api/user/analytics/topic/:topic`| Retrieve analytics data by topic|
| GET    | `/api/user/analytics/overall`     | Retrieve analytics data overall |

---

## Tools and Technologies Used

### 1. **Google Cloud**
- OAuth 2.0 Playground: Used for testing authentication.
- Client ID and Client Secret generated for integration.

### 2. **Postman**
- Used to test API endpoints.
- Used for testing authentication.
- Used token through Postman authenticate google Account.


### 3. **Docker**
- Dockerfile provided for creating and running containers.

### 4. **Swagger**
- API documentation available in `swagger.json`.

---

## Contribution Guidelines
1. Clone the repository.
2. Create a new branch for your feature or bugfix.
3. Make changes and commit.
4. Push your branch and create a pull request.

## Deployment

This project has been successfully deployed on Vercel. You can access the live API at [Vercel Deployment URL](<https://alteroffice-assignment-7oqy.vercel.app/>).

---
---

## License
This project is licensed under the MIT License. See `LICENSE` for more details.

---

## Notes
- Use the provided Postman collection (`Custom Shorten URL API.postman_collection.json`) to test API functionality.
- Swagger documentation can be accessed for detailed API specs.

---

## Contact
- For any queries, reach out to the project maintainer at [sunilrajputhrathod@gmail.com].
- Reach to github account and Repo of this project [https://github.com/sunilrathod098/Alteroffice_Assignment].
- Explore the personal portfolio at [https://sunilrathod-dashboard-sunilrathod098s-projects.vercel.app/].


## Conclusion
-The Custom Shorten URL API project is a powerful and user-friendly tool for creating and managing shortened URLs. It combines secure Google OAuth 2.0 authentication, fast performance with Redis caching, and the convenience of Docker for easy deployment. With features like detailed analytics and robust error handling, it’s designed to be both practical and scalable. This project serves as a solid foundation for future improvements and can easily adapt to larger, real-world use cases.