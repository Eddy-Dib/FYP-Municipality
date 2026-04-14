# Munciplaity System: Backend Documentation

## 1. Introduction
This document describes the organisation and structure of the backend for the Municipality System project. This backend is built using Node.js and Express.js and follows a modular structure design that allows for scalabilitt and easier maintenance.

## 2. Directory Structure

- ### config/
Contains configuration file for the database connection: `db.js`. It sets up a database connection with credentials extracted from a `.env` preserving secret information.

- ### controllers/
Contains core backend logic that control the business logic of the application. It is used to validate input, enforce rules, query the database and retuned standardized responses.

- ### routes/
Define the HTTP endpoints that the backend handles. It calls the appropriate controller functions to handle requests 

- ### utilities/
Contains shared helper functions and common logic that might be used by multiple controllers. It standardises API responses and handles repetitive tasks (formatting, validation...).

- ### middleware/
Intercepts requests for authentication, authorization and role checks. It can also be used for error handling.

- ### index.js
Initialises and starts the backend server. Sets up core middleware like Express, CORS and JSON parsing. It is used to call route modules and listen on the configured port.

## 3. Response Standards
All responses follow this JSON structure:
``` {
        success: boolean,
        message: string,
        data: object | null,
        error: string | null
    }
```
Response structures are handled by `utils/responses.js`

## 4. Database Queries
All queries should be handled in controllers and should be parametrised to avoid SQL injections.