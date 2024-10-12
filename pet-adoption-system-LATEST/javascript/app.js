const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./signin_signup'); // Import the auth routes

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL root password if set
    database: 'nodelogin'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

const app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'static', 'signin.html'));
});

app.use('/', authRoutes); // Use the auth routes

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
