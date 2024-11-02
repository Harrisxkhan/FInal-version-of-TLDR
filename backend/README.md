Folders Structure

- Models/
    - Models.js
- Routes/
    - Routes.js
- Index.js
- .env

### Start the server at port: 3000 (localhost:3000)

Models

Models.js

This file defines the User model using Mongoose and sets up authentication strategies using Passport.js.

User Model

The User model is defined using a Mongoose schema, which includes the following fields:

- username: String
- email: String
- password: String


The User model uses the passport-local-mongoose plugin to handle local authentication and the findorcreate plugin to enable find or create functionality.

Exports

The file exports the User model as a module.

Routes

Routes.js

The routes.js file defines various routes for the application using Express.js. 

Index.js

The index.js file sets up an Express.js server and configures various middleware.. Here's a breakdown of the code:

Imports and constants

- Express.js
- Body-parser
- Mongoose
- bycrpt
- Models (User)
- Routes
- Path module
- PORT (from environment variable or default 3000)

App setup

- Uses body-parser for URL-encoded requests
- Serves static files from the frontend/public directory
- Connects to the MongoDB database using Mongoose


Routes

- Uses the routes defined in the routes.js file

Server start

- Listens on the specified PORT and logs a message to the console


