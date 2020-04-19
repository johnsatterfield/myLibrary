const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
require('dotenv/config');

// Import Routes
const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth');
const authorRoute = require('./routes/author');
const postRoute = require('./routes/posts');

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));


app.use(cors());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// Connect to database
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log('Connected to DB');
    }
);
app.use('/', indexRoute);
app.use('/authors', authorRoute);
app.use('/api/user', authRoute);
app.use('/posts', postRoute);


app.get('/', (req,res) => {
    res.render('index.ejs');
});

app.get('/login', (req,res) => {
    res.render('login.ejs');
});

app.get('/register', (req,res) => {
    res.render('register.ejs');
});

// Listen to port 3000
app.listen(process.env.PORT || 3000);