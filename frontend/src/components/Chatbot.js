import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { getAllQuestions, createFeedback } from '../services/chatbotService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Salut 👋, je suis un chatbot. Quel service recherchez-vous ?', sender: 'bot', options: [], description: '' }
    ]);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [feedbackMode, setFeedbackMode] = useState(false);
    const [feedbackContent, setFeedbackContent] = useState('');
    const [iaModeQuestion, setIaModeQuestion] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getAllQuestions();
                setQuestions(data);

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
        setMessages(prevMessages => [
            ...prevMessages,
            { text: optionText, sender: 'user', description: '' }
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
                            description: selectedQuestion.description, // Ajout de la description
                            options: childQuestions.map(q => q.content)
                        }
                    ]);
                } else {
                    setFeedbackMode(true);
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: "Nous sommes à la fin, j'espère vous avoir répondu. Sinon, laissez un avis ou votre question.", sender: 'bot', description: '', options: [] }
                    ]);
                }
            } else {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: 'Je n\'ai pas compris votre demande, pouvez-vous préciser ?', sender: 'bot', description: '', options: [] }
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
            user: null,
        };

        try {
            await createFeedback(feedbackObject);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Merci pour votre feedback!", sender: 'bot', description: '', options: [] }
            ]);
            setFeedbackContent('');
            setFeedbackMode(false);
            setIaModeQuestion(true);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du feedback:', error);
        }
    };

    const handleIaModeChoice = (choice) => {
        if (choice === 'oui') {
            navigate('/chatbot-ia'); // Rediriger vers la page /chatbot-ia
        } else {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Merci de nous avoir contactés. N'hésitez pas à revenir si vous avez d'autres questions.", sender: 'bot', description: '', options: [] }
            ]);
        }
        setIaModeQuestion(false);
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">Salut 👋, je réponds à toutes vos questions 😊</div>
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                        {message.description && (
                            <div className="message-description">
                                {message.description}
                            </div>
                        )}
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
                {iaModeQuestion && (
                    <div className="ia-mode-container">
                        <p>Voulez-vous passer en mode IA pour plus d'informations ?</p>
                        <button onClick={() => handleIaModeChoice('oui')} className="ia-mode-button">Oui</button>
                        <button onClick={() => handleIaModeChoice('non')} className="ia-mode-button">Non</button>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default Chatbot;
