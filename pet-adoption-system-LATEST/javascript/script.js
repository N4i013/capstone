const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const path = require('path');

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

router.post('/auth', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], (error, results, fields) => {
            if (error) {
                console.error('Database query error:', error);
                response.send('An error occurred, please try again later.');
                response.end();
                return;
            }
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/index');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

router.get('/index', (request, response) => {
    if (request.session.loggedin) {
        response.send('Welcome back, ' + request.session.username + '!');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

router.get('/signup', (request, response) => {
    response.sendFile(path.join(__dirname, 'static', 'signup.html'));
});

router.post('/signup', (request, response) => {
    const username = request.body.username;
    const password = request.body.password;

    if (username && password) {
        connection.query('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, password], (error, results, fields) => {
            if (error) {
                console.error('Database query error:', error);
                response.send('An error occurred, please try again later.');
                response.end();
                return;
            }
            response.redirect('/');
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

module.exports = router;

function getInitials(firstName, lastName) {
    const parts = [firstName, lastName];
    return parts.map(part => part.charAt(0).toUpperCase()).join('');
  }
  
  function updateNavbarAfterSignIn(user) {
    const loginButton = document.getElementById('loginButton');
    const avatarContainer = document.getElementById('avatarContainer');
  
    if (user) {
      loginButton.style.display = 'none'; // Hide the login button
      avatarContainer.style.display = 'flex'; // Show the avatar container
  
      // Clear previous content
      avatarContainer.innerHTML = '';
  
      if (user.profilePic) {
        const img = document.createElement('img');
        img.src = user.profilePic;
        img.alt = "Profile Picture";
        img.className = "notification-profile-pic";
        avatarContainer.appendChild(img);
      } else {
        const initialsDiv = document.createElement('div');
        initialsDiv.className = "initials-background";
  
        const initialsText = document.createElement('p');
        initialsText.className = "initials";
        initialsText.textContent = getInitials(user.firstName, user.lastName);
  
        initialsDiv.appendChild(initialsText);
        avatarContainer.appendChild(initialsDiv);
      }
    } else {
      loginButton.style.display = 'block'; // Show the login button
      avatarContainer.style.display = 'none'; // Hide the avatar container
    }
  }
  
  // Example of how to use the function
  fetch('/signin-status')  // Endpoint that returns the current user session status
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        updateNavbarAfterSignIn(data.user);
      }
    })
    .catch(error => console.error('Error:', error));