import axios from 'axios';

const API_URL = 'http://localhost:4000/api/chatbot';

// recuperer les questions
export const getAllQuestions = async () => {
    try {
        const response = await axios.get(`${API_URL}/questions`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des questions:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Nouvelle fonction pour récupérer les feedbacks
export const getAllFeedbacks = async () => {
    try {
        const response = await axios.get(`${API_URL}/feedbacks`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des feedbacks:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Nouvelle fonction pour ajouter un feedback
export const createFeedback = async (feedback) => {
    try {
        const response = await axios.post(`${API_URL}/feedbacks`, feedback, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création du feedback:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Nouvelle fonction pour ajouter une question
export const createQuestion = async (question) => {
    try {
        const response = await axios.post(`${API_URL}/questions`, question, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la question:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Existant
export const updateQuestion = async (id, question) => {
    try {
        const response = await axios.put(`${API_URL}/questions/${id}`, question, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la question:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Existant
export const deleteQuestion = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/questions/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la question:', error.response ? error.response.data : error.message);
        throw error;
    }
};

