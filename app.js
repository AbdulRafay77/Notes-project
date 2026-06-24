const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/noteModel');

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
app.use(express.urlencoded({ extended: true }));

// -routes----------------------------

// home
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// about
app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

app.get('/notes/create', (req, res) => {
    res.render('notes/create', { title: 'Create a Note' });
});

// list all notes - newest first
app.get('/notes', (req, res) => {
    Note.find().sort({ createdAt: -1 })
        .then(notes => res.render('notes/index', { title: 'All Notes', notes }))
        .catch(err => console.log(err));
});

// save new note
app.post('/notes', (req,res) => {
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