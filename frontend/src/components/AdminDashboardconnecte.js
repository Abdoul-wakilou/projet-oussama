// Dashboard

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTasks, faComments, faEdit, faTrash, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getAllFeedbacks
} from '../services/chatbotService';

const AdminDashboard = () => {
    const [view, setView] = useState(''); // Pour contrôler la vue actuelle ('ajouter', 'gestion', 'feedbacks')
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [questionId, setQuestionId] = useState('');
    const [parentQuestionId, setParentQuestionId] = useState('');
    const [existingQuestionIds, setExistingQuestionIds] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null); // Pour stocker la question en cours de modification
    const [feedbacks, setFeedbacks] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (view === 'feedbacks') {
            const fetchFeedbacks = async () => {
                try {
                    const data = await getAllFeedbacks();
                    setFeedbacks(data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des feedbacks:', error);
                }
            };

            fetchFeedbacks();
        }
    }, [view]);

    // Charger les questions existantes lors du montage du composant
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const data = await getAllQuestions();
                setQuestions(data);
                setExistingQuestionIds(data.map(q => q.id)); // Utiliser les identifiants des questions
            } catch (error) {
                console.error('Erreur lors de la récupération des questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    const handleSaveQuestion = async () => {
        if (existingQuestionIds.includes(questionId)) {
            setAlertMessage('Échec : l\'identifiant de la question existe déjà.');
            return;
        }

        const newQuestionObject = {
            id: questionId,
            content: newQuestion,
            description,
            parent: parentQuestionId
        };

        try {
            const savedQuestion = await createQuestion(newQuestionObject);
            setQuestions([...questions, savedQuestion]);
            setNewQuestion('');
            setDescription('');
            setQuestionId('');
            setParentQuestionId('');
            setAlertMessage('La question a été ajoutée avec succès.');
        } catch (error) {
            console.error('Erreur lors de la création de la question:', error);
            setAlertMessage('Échec de l\'opération.');
        }
    };

    const handleEditQuestion = (question) => {
        setEditingQuestion(question);
        setNewQuestion(question.content);
        setDescription(question.description);
        setQuestionId(question.id);
        setParentQuestionId(question.parent || '');
    };

    const handleSaveEdit = async () => {
        if (window.confirm('Confirmez la modification de la question')) {
            const updatedQuestionObject = {
                content: newQuestion,
                description,
                id: questionId,
                parent: parentQuestionId
            };
            try {
                const updatedQuestion = await updateQuestion(editingQuestion._id, updatedQuestionObject);
                setQuestions(questions.map(q => (q._id === updatedQuestion._id ? updatedQuestion : q)));
                setEditingQuestion(null);
                setNewQuestion('');
                setDescription('');
                setQuestionId('');
                setParentQuestionId('');
                setAlertMessage('La question a été mise à jour');
            } catch (error) {
                console.error('Erreur lors de la mise à jour de la question:', error);
            }
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (window.confirm('Confirmez la suppression de la question')) {
            try {
                await deleteQuestion(id);
                setQuestions(questions.filter(q => q._id !== id));
                setAlertMessage('La question a été supprimée');
            } catch (error) {
                console.error('Erreur lors de la suppression de la question:', error);
            }
        }
    };

    const renderView = () => {
        switch (view) {
            case 'ajouter':
                return (
                    <div className="question-form mt-3">
                        <input
                            type="text"
                            placeholder="Identifiant de la question"
                            value={questionId}
                            onChange={(e) => setQuestionId(e.target.value)}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Nouvelle question"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="form-control mb-2"
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control mb-2"
                        />
                        <select
                            value={parentQuestionId}
                            onChange={(e) => setParentQuestionId(e.target.value)}
                            className="form-control mb-2"
                        >
                            <option value="">Sélectionner le parent</option>
                            {questions.map(q => (
                                <option key={q.id} value={q.id}>{q.id}</option>
                            ))}
                        </select>
                        <button className="btn btn-primary" onClick={handleSaveQuestion}>
                            Enregistrer
                        </button>
                        {alertMessage && <div className="alert alert-info mt-3">{alertMessage}</div>}
                    </div>
                );
            case 'gestion':
                return (
                    <table className="table table-responsive mt-3">
                        <thead>
                            <tr>
                                <th>Question</th>
                                <th>Description</th>
                                <th>Parent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((question) => (
                                <React.Fragment key={question._id}>
                                    {editingQuestion && editingQuestion._id === question._id ? (
                                        <tr>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={newQuestion}
                                                    onChange={(e) => setNewQuestion(e.target.value)}
                                                    className="form-control"
                                                />
                                            </td>
                                            <td>
                                                <textarea
                                                    value={description}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    className="form-control"
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    value={parentQuestionId}
                                                    onChange={(e) => setParentQuestionId(e.target.value)}
                                                    className="form-control"
                                                >
                                                    <option value="">Sélectionner le parent</option>
                                                    {questions.map(q => (
                                                        <option key={q.id} value={q.id}>{q.id}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <FontAwesomeIcon icon={faPaperPlane} className="save-icon mx-2" onClick={handleSaveEdit} />
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td>{question.content}</td>
                                            <td>{question.description}</td>
                                            <td>{question.parent || '-'}</td>
                                            <td>
                                                <FontAwesomeIcon icon={faEdit} className="edit-icon mx-2" onClick={() => handleEditQuestion(question)} />
                                                <FontAwesomeIcon icon={faTrash} className="delete-icon mx-2" onClick={() => handleDeleteQuestion(question._id)} />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                );
            case 'feedbacks':
                return (
                    <table className="table table-striped mt-3">
                        <thead>
                            <tr>
                                <th scope="col">Numéro</th>
                                <th scope="col">Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feedbacks.map((feedback, index) => (
                                <tr key={feedback._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{feedback.content}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard container">
            <h1 className="mt-2 mb-4 titre">Administration des Questions/Réponses du chatbot de Pixelraise</h1>
            <div className="admin-button row">
                <div className="col-md-4 col-sm-12 text-center question" onClick={() => setView('ajouter')}>
                    <div className="icone">
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                    <div className="texte">
                        <span>Ajouter de nouvelles questions</span>
                    </div>
                </div>
                <div className="col-md-4 col-sm-12 text-center" onClick={() => setView('gestion')}> <div className="icone"> <FontAwesomeIcon icon={faTasks} /> </div> <div className="texte"> <span>Gérer les questions existantes</span> </div> </div> <div className="col-md-4 col-sm-12 text-center" onClick={() => setView('feedbacks')}> <div className="icone"> <FontAwesomeIcon icon={faComments} /> </div> <div className="texte"> <span>Voir les feedbacks</span> </div> </div> </div> {renderView()} </div>);
};

export default AdminDashboard;
