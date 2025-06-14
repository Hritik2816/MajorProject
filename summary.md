1. Frameworks & Libraries Used
   Backend Framework
   Express: Main web framework for routing, middleware, and server logic (express).
   Templating
   EJS: For rendering dynamic HTML views (ejs).
   ejs-mate: Layout support for EJS (ejs-mate).
   Database
   Mongoose: ODM for MongoDB (mongoose).
   Authentication
   Passport: Authentication middleware (passport).
   passport-local: Local username/password strategy (passport-local).
   passport-local-mongoose: Mongoose plugin for local authentication (passport-local-mongoose).
   Session & Flash
   express-session: Session management (express-session).
   connect-flash: Flash messages for sessions (connect-flash).
   Validation
   joi: Schema validation for request bodies (joi).
   File Uploads & Cloud Storage
   multer: Middleware for handling multipart/form-data (multer).
   cloudinary: Cloud image storage (cloudinary).
   multer-storage-cloudinary: Multer storage engine for Cloudinary (multer-storage-cloudinary).
   Other Utilities
   dotenv: Loads environment variables from .env (dotenv).
   method-override: Allows HTTP verbs like PUT/DELETE in places where the client doesn’t support it (method-override).
   nodemon: Development tool for auto-restarting the server (nodemon).

2. Types of Packages Used
   Web Framework: express
   Templating: ejs, ejs-mate
   Database/ODM: mongoose
   Authentication: passport, passport-local, passport-local-mongoose
   Session/Flash: express-session, connect-flash
   Validation: joi
   File Upload/Cloud: multer, cloudinary, multer-storage-cloudinary
   Environment: dotenv
   HTTP Method Override: method-override
   Development Tool: nodemon
3. Usage in the Project
   Express: Used for routing, middleware, and server setup (app.js).
   EJS & ejs-mate: Used for rendering views and layouts (views/).
   Mongoose: Used for defining models and interacting with MongoDB (models/).
   Passport & passport-local(-mongoose): Used for user authentication (models/users.js, routes/user.js).
   express-session & connect-flash: Used for session management and flash messages (app.js).
   joi: Used for validating request data (schema.js, middleware.js).
   multer, cloudinary, multer-storage-cloudinary: Used for image upload and storage (cloudConfig.js, routes/listing.js).
   dotenv: Loads environment variables (app.js, cloudConfig.js).
   method-override: Allows PUT/DELETE via POST (app.js).
   nodemon: For development, not used in code but as a dev tool.
4. Frontend Libraries
   Bootstrap: Used via CDN for styling (views/layouts/boilerplate.ejs).
   Mapbox GL JS: Used for map display (views/layouts/boilerplate.ejs, views/show.ejs).
5. Summary Table
   Package Name Type/Category Usage Example/Location
   express Web Framework app.js
   ejs, ejs-mate Templating views/
   mongoose ODM/Database models/
   passport, passport-local Authentication routes/user.js
   passport-local-mongoose Auth Helper models/users.js
   express-session Session app.js
   connect-flash Flash Messages app.js
   joi Validation schema.js
   multer, cloudinary, multer-storage-cloudinary File Upload/Cloud cloudConfig.js
   dotenv Env Variables app.js
   method-override HTTP Override app.js
   nodemon Dev Tool Not in code, used for development
