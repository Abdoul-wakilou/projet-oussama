const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Feedback = require('../models/Feedback');

// Route pour récupérer toutes les questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour récupérer une question par son ID 
router.get('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question non trouvée' });
        res.json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route pour ajouter une nouvelle question
router.post('/questions', async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();
        res.status(201).json(question);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour mettre à jour une question par son ID
router.put('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!question) return res.status(404).json({ message: 'Question non trouvée' });
        res.json(question);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Route pour supprimer une question par son ID
router.delete('/questions/:id', async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question non trouvée' });
        res.json({ message: 'Question supprimée avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Route pour obtenir la question dont le parent est null
router.get('/questions/first', async (req, res) => {
    try {
        const question = await Question.findOne({ parent: null });
        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: 'Question not found' });
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la question:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Route POST pour créer un feedback
router.post('/api/chatbot/feedbacks', async (req, res) => {
    try {
        const { content, user } = req.body;

        // Validation simple
        if (!content) {
            return res.status(400).json({ error: 'Le contenu du feedback est requis.' });
        }

        // Création du feedback
        const newFeedback = new Feedback({ content, user });
        await newFeedback.save();

        res.status(201).json(newFeedback);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la création du feedback.' });
    }
});



module.exports = router;
