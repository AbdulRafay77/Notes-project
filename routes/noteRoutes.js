const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// IMPORTANT: /notes/create must come BEFORE /notes/:id
// otherwise Express will treat "create" as an :id param
router.get('/create', noteController.note_create_get);
router.post('/', noteController.note_create_post);

router.get('/', noteController.note_index);
router.get('/:id', noteController.note_details);

router.get('/:id/edit', noteController.note_edit_get);
router.post('/:id/edit', noteController.note_edit_post);

router.post('/:id/delete', noteController.note_delete);

module.exports = router;