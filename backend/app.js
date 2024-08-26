const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');


// Importation des routes
const chatbotRoutes = require('./routes/chatbot');
const feedbackRoutes = require('./routes/feedback');

// Connexion à MongoDB, la base de données
mongoose.connect('mongodb://127.0.0.1:27017/chatbot')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.log('Connexion à MongoDB échouée !', error));

// Middleware 
app.use(cors({
    origin: [
        'http://localhost:3000',
    ]
}));

app.use(bodyParser.json({ limit: '200MB' }));
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.json({ limit: '16MB' }));

// Routes API
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chatbot', feedbackRoutes);

// Servir les fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
