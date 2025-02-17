import express from 'express';
import axios from 'axios';
import books from './booksdb.js';
import { reviews } from './auth_users.js';

const router = express.Router();

// GET a list of all books available in the bookshop
router.get("/", (req, res) => {
    function getAll() {
        return new Promise((resolve, reject) => {
            let availableBook = [];
            for (let i=0; i<books.length; i++) {
                if (books[i].stock > 0) {
                    availableBook.push({
                        title: books[i].title,
                        author: books[i].author,
                        price: books[i].price,
                        stock: books[i].stock
                    })
                }
            }

            if (availableBook.length > 0) {
                resolve(availableBook);
            }
            else {
                reject("No Available book");
            }
        })
    }

    getAll()
        .then(result => {
            return res.send(JSON.stringify(result, null, 4));
        })
        .catch(error => {
            console.log(error);
            return res.send({message: error});
        })
})

// GET books detail based on ISBN code, author, and titles
router.get("/isbn/:isbn", (req, res) => {
    function getByIsbn(isbn) {
        return new Promise((resolve, reject) => {
            let bookDetail = books.find(book => book.ISBN === isbn);
            if (bookDetail) {
                resolve(bookDetail);
            }
            else {
                reject("Book not found");
            }
        })
    }

    getByIsbn(req.params.isbn)
        .then(result => {
            return res.send(JSON.stringify(result, null, 4));
        })
        .catch(err => {
            return res.send({message: "Invalid ISBN code"});
        })
})

// GET books detail based on ISBN code, author, and titles
router.get("/author/:author", (req, res) => {
    function getByAuthor(author) {
        return new Promise((resolve, reject) => {
            let bookDetail = books.find(book => book.author === author);
            if (bookDetail) {
                resolve(bookDetail);
            }
            else {
                reject("Book not found");
            }
        })
    }

    getByAuthor(req.params.author)
        .then(result => {
            return res.send(JSON.stringify(result, null, 4));
        })
        .catch(err => {
            return res.send({message: "Invalid author"});
        })
})

// GET books detail based on ISBN code, author, and titles
router.get("/title/:title", (req, res) => {
    function getByTitle(title) {
        return new Promise((resolve, reject) => {
            let bookDetail = books.find(book => book.title === title);
            if (bookDetail) {
                resolve(bookDetail);
            }
            else {
                reject("Book not found");
            }
        })
    }

    getByTitle(req.params.title)
        .then(result => {
            return res.send(JSON.stringify(result, null, 4));
        })
        .catch(err => {
            return res.send({message: "Invalid title"});
        })
})

// GET books detail based on ISBN code, author, and titles
router.get("/detail", (req, res) => {
    let bookDetail = {};
    if (req.query.ISBN) {
        bookDetail = books.find(book => book.ISBN === req.query.ISBN);
    }
    else if (req.query.author) {
        bookDetail = books.find(book => book.author === req.query.author);
    }
    else if (req.query.title) {
        bookDetail = books.find(book => book.title === req.query.title);
    }
    else {
        res.send({message: "Please specify ISBN code, author, or title"});
    }

    res.send(bookDetail);
})

// GET reviews/comments for specified books
router.get('/review/:isbn', (req, res) => {
    let book = books.find(book => book.ISBN === req.params.isbn);
    let bookReview = reviews.filter(review => review.bookISBN === req.params.isbn && !review.isDeleted);
    if (bookReview.length > 0) {
        res.send(JSON.stringify(bookReview, null, 4));
    }
    else {
        // console.log(req.params.bookId);
        res.send({message: `No review for book: ${book.title}`});
    }
})

export default router;