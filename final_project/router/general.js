const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  }); 
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

const getAll = ()=>{
  return books;
}

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  const books = await getAll(); 
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  const book = await books[isbn]
  if (book) {
    res.send(JSON.stringify(books[isbn]));
  } else {
    res.send(JSON.stringify({ message: "ISBN not found." }));
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  const allBooks = Object.values(await books);
  const book = allBooks.filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );
  if (book) {
    res.send(book);
  } else {
    res.send(JSON.stringify({ message: "Author not found." }));
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  const allBooks = Object.values(await books);
  const book = allBooks.filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );
  if (book) {
    res.send(book);
  } else {
    res.send(JSON.stringify({ message: "Book not found." }));
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews));
  } else {
    res.send(JSON.stringify({ message: "ISBN not found." }));
  }
});

module.exports.general = public_users;
