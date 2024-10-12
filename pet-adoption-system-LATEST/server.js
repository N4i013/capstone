const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const mysql = require("mysql2");
console.log("Error parameter detected:", error);

// Create the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const dbOptions = {
  host: "localhost",
  user: "root",
  database: "qcacac_pet_adoption",
};

const pool = mysql.createPool(dbOptions);

// Set up sessions
const sessionStore = new MySQLStore({}, pool);
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Error handling for database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  } else {
    console.log("Database connected successfully");
    connection.release();
  }
});

