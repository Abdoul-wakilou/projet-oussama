const mongoose = require('mongoose');

// Définition du schéma pour le feedback (les retours des utilistateurs)
const feedbackSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true // Le contenu est obligatoire
    },
    user: {
        type: String,
        required: false // Le champ user n'est pas obligatoire, peut être null
    },
    date: {
        type: Date,
        default: Date.now // Ajoute automatiquement la date de création
    }
});

// Création du modèle basé sur le schéma
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
