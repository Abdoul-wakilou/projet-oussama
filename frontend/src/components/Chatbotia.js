import React, { useState, useEffect, useRef } from 'react';
import './Chatbotia.css'; // Assurez-vous que le nom du fichier CSS est correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatbotIA = () => {
    const [messages, setMessages] = useState([
        { text: 'Salut, je suis l\'IA chargée de répondre à vos besoins sur Pixelraise et bien d\'autres, en quoi puis-je vous aider ?', sender: 'bot' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false); // État pour gérer l'animation de saisie
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const simulateTyping = (text) => {
            const typingSpeed = 10; // Réduit la vitesse de frappe (ms par caractère)
            let index = 0;

            const typeCharacter = () => {
                setMessages(prevMessages => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage && lastMessage.sender === 'bot') {
                        const newText = text.slice(0, index + 1);
                        return [
                            ...prevMessages.slice(0, -1),
                            { text: newText, sender: 'bot' }
                        ];
                    }
                    return prevMessages;
                });

                index += 1;
                if (index < text.length) {
                    setTimeout(() => {
                        requestAnimationFrame(typeCharacter);
                    }, typingSpeed);
                } else {
                    setIsTyping(false);
                }
            };

            typeCharacter();
        };

        if (isTyping) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.sender === 'bot') {
                simulateTyping(lastMessage.text);
            }
        }
    }, [isTyping, messages]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const userMessage = userInput;
        setUserInput('');
        setMessages(prevMessages => [
            ...prevMessages,
            { text: userMessage, sender: 'user' }
        ]);

        // Attendre 2 secondes avant de simuler la réponse du bot
        setIsTyping(true);
        setTimeout(() => {
            const responses = [
                'Pixelraise est une entreprise spécialisée dans la transformation digitale, le développement web et mobile, le conseil en informatique, et le marketing digital. Leur objectif est d\'aider les entreprises à adopter des solutions numériques sur mesure pour améliorer leur efficacité et leur présence en ligne. Ils offrent également des services en design graphique UI/UX, gestion des données, et développement d\'applications. Pixelraise opère à l\'international avec des agences en France, Tunisie, Suisse, et Canada.',
                'Pixelraise offre une gamme complète de services, notamment :\n\nDéveloppement web et mobile : Conception et développement de sites et applications.\nConsulting IT : Accompagnement dans la transformation digitale.\nMarketing digital : Stratégies de marketing en ligne sur mesure.\nDesign graphique UI/UX : Création d\'interfaces utilisateur attrayantes et fonctionnelles.\nGestion des données : Collecte et exploitation des données pour améliorer les performances.\nDéveloppement d\'applications : Solutions mobiles sur mesure pour répondre aux besoins spécifiques des entreprises.\nPour plus de détails, visitez leur site officiel.',
                'Pour contacter Pixelraise, voici les informations :\n\nTéléphone : +33 1 74 87 26 40\nEmail : Vous pouvez utiliser leur formulaire de contact sur leur site.\nEmplacement physique : Leur bureau principal est situé à Paris, France.\nPour des détails supplémentaires ou pour prendre rendez-vous, visitez leur site officiel ici​(Pixelraise).'
            ];

            const currentResponseIndex = messages.length % responses.length;
            const currentResponse = responses[currentResponseIndex];

            setMessages(prevMessages => [
                ...prevMessages,
                { text: '', sender: 'bot' } // Message temporaire pendant la saisie
            ]);

            setTimeout(() => {
                setMessages(prevMessages => [
                    ...prevMessages.slice(0, -1),
                    { text: currentResponse, sender: 'bot' }
                ]);
                setIsTyping(false);
            }, 100); // Délai pour permettre la mise à jour du message temporaire
        }, 2000); // Délai de 2 secondes avant de commencer à afficher le message du bot
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">Chatbot IA</div>
            <div className="chatbot-messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.sender}`}>
                        {message.text}
                        {message.sender === 'bot' && isTyping && index === messages.length - 1 && (
                            <div className="typing-indicator">...</div>
                        )}
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
