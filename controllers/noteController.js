const Note = require('../models/noteModel');

// GET /notes — list all notes, newest first
const note_index = (req, res) => {
    Note.find().sort({ createdAt: -1 })
        .then(notes => {
            res.render('notes/index', { title: 'All Notes', notes });
        })
        .catch(err => console.log(err));
};

// GET /notes/:id — show one note
const note_details = (req, res) => {
    const id = req.params.id;
    Note.findById(id)
        .then(note => {
            if (!note) return res.status(404).render('404', { title: 'Note Not Found' });
            res.render('notes/details', { title: note.title, note });
        })
        .catch(err => {
            console.log(err);
            res.status(404).render('404', { title: 'Note Not Found' });
        });
};

// GET /notes/create — show create form
const note_create_get = (req, res) => {
    res.render('notes/create', { title: 'Create a Note' });
};

// POST /notes — save new note to DB
const note_create_post = (req, res) => {
    const note = new Note(req.body);
    note.save()
        .then(() => res.redirect('/notes'))
        .catch(err => console.log(err));
};

// GET /notes/:id/edit — show pre-filled edit form
const note_edit_get = (req, res) => {
    const id = req.params.id;
    Note.findById(id)
        .then(note => {
            if (!note) return res.status(404).render('404', { title: 'Note Not Found' });
            res.render('notes/edit', { title: 'Edit Note', note });
        })
        .catch(err => {
            console.log(err);
            res.status(404).render('404', { title: 'Note Not Found' });
        });
};

// POST /notes/:id/edit — update note in DB (POST workaround for PUT)
const note_edit_post = (req, res) => {
    const id = req.params.id;
    Note.findByIdAndUpdate(id, req.body)
        .then(() => res.redirect(`/notes/${id}`))
        .catch(err => console.log(err));
};

// POST /notes/:id/delete — delete note (POST workaround for DELETE)
const note_delete = (req, res) => {
    const id = req.params.id;
    Note.findByIdAndDelete(id)
        .then(() => res.redirect('/notes'))
        .catch(err => console.log(err));
};

module.exports = {
    note_index,
    note_details,
    note_create_get,
    note_create_post,
    note_edit_get,
    note_edit_post,
    note_delete,
};