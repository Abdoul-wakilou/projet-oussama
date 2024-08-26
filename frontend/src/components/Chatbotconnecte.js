//le chatbot

import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { getAllQuestions, createFeedback } from '../services/chatbotService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Salut 👋, je suis un chatbot Quel service recherchez-vous ?', sender: 'bot', options: [] }
    ]);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const messagesEndRef = useRef(null);

    // gérer les feedbacks
    const [feedbackMode, setFeedbackMode] = useState(false);
    const [feedbackContent, setFeedbackContent] = useState('');

    // Fonction pour faire défiler vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Charger les questions existantes lors du montage du composant
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getAllQuestions();
                setQuestions(data);

                // Définir les options de la première question (root)
                const rootQuestion = data.find(q => q.parent === null);
                if (rootQuestion) {
                    setMessages(prevMessages => {
                        const updatedMessages = [...prevMessages];
                        updatedMessages[0].options = data
                            .filter(q => q.parent === rootQuestion.id)
                            .map(q => q.content);
                        return updatedMessages;
                    });
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    const handleOptionClick = (optionText) => {
        // Ajouter le message de l'utilisateur avec un fond bleu
        setMessages(prevMessages => [
            ...prevMessages,
            { text: optionText, sender: 'user' }
        ]);

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            const selectedQuestion = questions.find(q => q.content === optionText);
            if (selectedQuestion) {
                const childQuestions = questions.filter(q => q.parent === selectedQuestion.id);
                
                if (childQuestions.length > 0) {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        {
                            text: selectedQuestion.content,
                            sender: 'bot',
                            options: childQuestions.map(q => q.content)
                        }
                    ]);
                } else {
                    // Si aucune option n'est disponible, activer le mode feedback
                    setFeedbackMode(true);
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: "Nous sommes à la fin, j'espère vous avoir répondu, sinon laissez un avis ou votre question.", sender: 'bot', options: [] }
                    ]);
                }
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: 'Je n\'ai pas compris votre demande, pouvez-vous préciser ?', sender: 'bot', options: [] }
                ]);
            }
        }, 1000);
    };

    const handleSendFeedback = async () => {
        if (!feedbackContent.trim()) {
            alert("Veuillez entrer un avis avant d'envoyer.");
            return;
        }

        const feedbackObject = {
            content: feedbackContent,
            user: null, // ou vous pouvez récupérer l'utilisateur si nécessaire
        };

        try {
            await createFeedback(feedbackObject);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Merci pour votre feedback!", sender: 'bot', options: [] }
            ]);
            setFeedbackContent('');
            setFeedbackMode(false); // Désactiver le mode feedback
        } catch (error) {
            console.error('Erreur lors de l\'envoi du feedback:', error);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">Salut 👋, je réponds à toutes vos questions 😊</div>
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                        {message.options && (
                            <div className="options">
                                {message.options.map((option, i) => (
                                    <button key={i} onClick={() => handleOptionClick(option)} className="option-button">
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                )}
                {feedbackMode && (
                    <div className="feedback-container">
                        <textarea
                            value={feedbackContent}
                            onChange={(e) => setFeedbackContent(e.target.value)}
                            placeholder="Écrivez votre avis ici..."
                            className="feedback-textarea"
                        />
                        <button className="send-feedback-button" onClick={handleSendFeedback}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default Chatbot;
