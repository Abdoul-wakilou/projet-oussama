# Pixelraise Chatbot

## Description

Ce projet est un chatbot interactif développé pour le site web de Pixelraise. Le chatbot guide les utilisateurs à travers un arbre décisionnel en fonction de leurs besoins (Développement Web, Marketing Digital, UX/UI Design, etc.). Le projet comprend également une interface d'administration pour gérer les questions, réponses, services, et feedbacks des utilisateurs.

## Technologies Utilisées

- **MongoDB** : Base de données pour stocker les services, questions, réponses, feedbacks, etc.
- **Express.js** : Backend pour gérer les requêtes et réponses du chatbot.
- **React.js** : Frontend pour l'interface utilisateur du chatbot et l'interface d'administration.
- **Node.js** : Serveur pour exécuter l'application.

## Fonctionnalités

### Chatbot Interactif

- Guide les utilisateurs en fonction de leurs besoins à travers un arbre décisionnel.
- Conçu pour s'intégrer harmonieusement avec le design du site de Pixelraise.
- Ajouter l'api de chat gpt pour continuer la discussion avec le client au cas où il n'est pas satisfait et veux poursuivre.

### Interface d'Administration

- Permet à l'administrateur de :
  - Voir, ajouter, modifier et supprimer les questions et les réponses du chatbot.
  - Voir les feedbacks des utilisateurs.


## Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB

### Avoir le projet sur votre ordinateur

- cloner le projet pour l'avoir sur votre ordinateur en tapant cette commande

```bash
git clone https://github.com/Abdoul-wakilou/projet-oussama.git

```
- nom du projet : projet-oussama

## Configuration de la base de données mongodb

### Créer la base de données : chatbot

- Créer la collection des questions : questions
- Importer le fichier questions.json , c'est dans ce fichier il y a les questions enrégistrées par defaut

- Créer la collection des feedbacks : feedbacks
- Importer le fichier feedbacks.json , c'est dans ce fichier il y a les feedbacks enrégistrés par defaut

NB: ces fichiers sont à la racine de votre projet


### Installation des Dépendances

## Backend
Accédez au dossier backend :
```bash
cd projet-oussama/backend

```
Installez les dépendances :

```bash
 
npm install
```

Lancer le backend :
```bash
 
npm start
```

## Frontend
Accédez au dossier frontend :
```bash
 
cd projet-oussama/frontend
```
Installez les dépendances :
```bash
 
npm install
```
Lancer le frontend :
```bash
 
npm start
```

Ouvrez votre navigateur et accédez à :

http://localhost:3000 pour la page du chatbot.
http://localhost:3000/administration pour accéder à l'interface d'administration.

