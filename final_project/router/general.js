const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if(!username || !password) {
    return res.status(400).json({
        message: "Username and password are required"
    });
  }

  const existingUser = users.find(
    (user) => user.username === username
  );
  if (existingUser) {
    return res.status(409).json({
        message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });
  
  res.status(201).json({
    message: "User successfully registered"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    res.send(JSON.stringify(books,null,4));
    return res.status(300).json({message: "All available books retrieved"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn]);
    return res.status(300).json({message: "Retrieved book by ISBN"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    const matchingBooks = [];

    Object.keys(books).forEach(function (isbn) {
        if (books[isbn].author === author) {
            matchingBooks.push(books[isbn]);
        }
    });

    res.send(JSON.stringify(matchingBooks));

    return res.status(300).json({message: "Retrieved books authored by author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = [];

  Object.keys(books).forEach(function (isbn) {
      if (books[isbn].title === title) {
          matchingBooks.push(books[isbn]);
      }
  });

  res.send(JSON.stringify(matchingBooks));
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]["reviews"]);

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
