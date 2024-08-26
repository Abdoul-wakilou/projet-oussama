// routes/feedback.js
//pour gérer les actions relatives aux feedbacks

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Route pour récupérer tous les feedbacks
router.get('/feedbacks', async (req, res) => {
    console.log('GET /feedbacks called');
    try {
        // Récupérer tous les feedbacks, triés par date décroissante
        const feedbacks = await Feedback.find().sort({ date: -1 });
        console.log('Feedbacks found: ', feedbacks);
        res.json(feedbacks); // Envoyer tous les feedbacks au client
    } catch (err) {
        console.error('Error retrieving feedbacks: ', err);
        res.status(500).json({ message: err.message });
    }
});


// Route POST pour créer un feedback
router.post('/feedbacks', async (req, res) => {
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
