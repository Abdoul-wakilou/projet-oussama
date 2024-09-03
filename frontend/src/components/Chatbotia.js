import React, { useState, useEffect, useRef } from 'react';
import './Chatbotia.css'; // Assurez-vous que le nom du fichier CSS est correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatbotIA = () => {
    const [messages, setMessages] = useState([
        { text: 'Salut, je suis l\'IA chargée de répondre à vos besoins sur Pixelraise et bien d\'autres, en quoi puis-je vous aider ?', sender: 'bot' }
    ]);
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;
    
        const userMessage = userInput;
        setUserInput('');
        setMessages(prevMessages => [
            ...prevMessages,
            { text: userMessage, sender: 'user' }
        ]);
    
        try {
            const response = await fetch('http://localhost:4000/api/chatbot/ask', { // Assurez-vous que l'URL est correcte
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: userMessage }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data = await response.json();
            setMessages(prevMessages => [
                ...prevMessages,
                { text: data.answer, sender: 'bot' }
            ]);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.', sender: 'bot' }
            ]);
        }
    };
    

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">Chatbot IA</div>
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatbot-input">
                <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Posez votre question ici..."
                    className="chatbot-textarea"
                />
                <button onClick={handleSendMessage} className="send-message-button">
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
        </div>
    );
};

export default ChatbotIA;
