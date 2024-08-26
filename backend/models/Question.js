// backend/models/Question.js
// pour definir le schéma des questions

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    parent: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
