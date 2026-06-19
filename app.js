const express = require('express');
const mongoose = require('mongoose');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

// connect to MongoDB 
const dbURI = 'mongodb://localhost:27017/notes-app';
mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    })
    .catch(err => console.log(err));

// middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// all /notes routes handled by noteRoutes
app.use('/notes', noteRoutes);

// 404 fallback
app.use((req, res) => {
    res.status(404).render('404', { title: '404 Not Found' });
});