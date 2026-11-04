const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find(
        (registeredUser) => registeredUser.username === username && registeredUser.password === password

    );
    return user
}

//only registered users can login
regd_users.post("/customer/login", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ 
            message: "Error logging in" });
    }

    // Authenticate user
    const user = users.find(
        (registeredUser) => registeredUser.username === username && registeredUser.password === password

    );
    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const accessToken = jwt.sign(
        { username: user.username },
        "access",
        { expiresIn: "1h" }
    );

    req.session.authorization = {
        accessToken: accessToken,
        username: user.username
    };

    res.status(200).json({
        message: "User successfully logged in",
        token: accessToken
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  if (!books[isbn]) {
    return res.status(404).send("Book not found");
  }

  if (!review) {
    return res.status(400).send("Review is required");
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Adds a new review or modifies the review by this user
  books[isbn].reviews[username] = review;

  res.send(books[isbn]);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!books[isbn]) {
        return res.status(404).send("Book not found");
    }

    if (!books[isbn].reviews) {
        return res.status(404).send("No reviews found for this book");
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).send("You have not reviewed this book");
    }

    delete books[isbn].reviews[username];

    res.send(books[isbn]);

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
