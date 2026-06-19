const mongoose = require('mongoose');
const { type } = require('node:os');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'general'
    }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;