const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

// routes

// home route
app.get('/', (req, res) =>{
    res.render('index', { title: 'Home Page', message: 'Welcome' });
});

// about route
app.get('/about', (req, res) =>{
    res.render('about', { title: 'About Page'});

});

// details route
app.get('/notes', (req, res) =>{
    res.render('index', { title: 'Notes Page'});
});

// create route
app.get('/create', (req, res) =>{
    res.render('create', { title: 'Create Page'});
});

// edit
app.get('/edit', (req, res) =>{
    res.render('edit', { title: 'Edit Page'});
});

// 404 route
app.use((req, res) =>{
    res.status(404).render('404', { title: '404 Not found' });
});

app.listen(3000);