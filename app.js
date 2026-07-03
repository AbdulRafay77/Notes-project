const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/noteModel');
const User = require('./models/User');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// connect to MongoDB 
const dbURI = 'mongodb+srv://abdulrafaysiddiquib153_db_user:Rafaycoc2002@cluster0.fwab6im.mongodb.net/?appName=Cluster0'
mongoose.connect(dbURI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => console.log('Server running on local host 3000'));
    })
    .catch(err => console.log(err));

// -middleware------------------------
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// -routes----------------------------
app.use(checkUser);
// JWT authentication routes

// handle errors
const handleErrors = (err) =>{
    console.log(err.message, err.code);
    let errors = { email: '', password:'' };

    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
    }

    // incorrect password
    if (err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'that email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, 'note secret', {
        expiresIn: maxAge
    });
}

app.get('/login', (req, res) => {
    res.render('login', { title: 'Log in' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign up' });
});

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

app.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
});

// home
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// about
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// create note page
app.get('/notes/create', requireAuth, (req, res) => {
    res.render('notes/create', { title: 'Create a Note' });
});

// list all notes - newest first
app.get('/notes', requireAuth, (req, res) => {
    Note.find().sort({ createdAt: -1 })
        .then(notes => res.render('notes/index', { title: 'All Notes', notes }))
        .catch(err => console.log(err));
});

// save new note
app.post('/notes', requireAuth, (req,res) => {
    const note = new Note(req.body);
    note.save()
        .then(() => res.redirect('/notes'))
        .catch(err => console.log(err));
});

// show one note
app.get('/notes/:id', (req, res) => {
    Note.findById(req.params.id)
        .then(note => {
            if (!note) return res.status(404).render('404', { title: '404 Not Found' });
            res.render('notes/details', { title: note.title, note });
        })
        .catch(() => res.status(404).render('404', { title: '404 Not Found' }));
});

// show edit form
app.get('/notes/:id/edit', (req, res) => {
    Note.findById(req.params.id)
        .then(note => {
            if (!note) return res.status(404).render('404', { title: '404 Not Found' });
            res.render('notes/edit', { title: 'Edit Note', note });
        })
        .catch(() => res.status(404).render('404', { title: '404 Not Found' }));
});

// update note
app.post('/notes/:id/edit', (req, res) => {
    Note.findByIdAndUpdate(req.params.id, req.body)
        .then(() => res.redirect(`/notes/${req.params.id}`))
        .catch(err => console.log(err));
});

// delete note
app.post('/notes/:id/delete', (req, res) => {
    Note.findByIdAndDelete(req.params.id)
        .then(() => res.redirect('/notes'))
        .catch(err => console.log(err));
});

// 404 fallback
app.use((req,res) => {
    res.status(404).render('404', { title: '404 Not Found' });
});