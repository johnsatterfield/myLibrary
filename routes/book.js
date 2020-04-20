const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Author = require('../models/Author');

// All books
router.get('/', async (req,res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter);
    }
    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        });
    } catch (err) {
        res.redirect('/');
    }
});

// New book
router.get('/new', async (req,res) => {
    renderNewPage(res, new Book());
});

// Create book
router.post('/', async (req,res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    try {
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`);
    } catch(err) {
        console.log(err);
        renderNewPage(res, book, true);
    }
});

// Find book
router.get('/:id', async (req,res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec();
        res.render('books/show', {book:book});
    } catch {
        res.redirect('/');
    }
});

// Edit book
router.get('/:id/edit', async (req,res) => {
    try {
        const book = await (await Book.findById(req.params.id));
        res.render('books/edit', {book: book});
    } catch {
        res.redirect('/books');
    }
    
});

// Update book
router.put('/:id', async (req,res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishedDate = req.body.publishedDate;
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch(err) {
        if (book != null) {
            renderEditPage(res, book, true);
        } else {
            res.redirect('/');
        }
    }
});

// Delete book
router.delete('/:id', async (req,res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        await book.remove();
        res.redirect('/books/');
    } catch(err) {
        if (book != null) {
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            });
        } else {
            res.redirect('/');
        }
    }
});

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError);
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error updating book';
            } else {
                params.errorMessage = 'Error creating book';
            }
        }
        res.render(`books/${form}`,params);
    } catch(err) {
        res.redirect('/books');
    }
}

module.exports = router;