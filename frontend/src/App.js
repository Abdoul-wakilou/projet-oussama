
import React from 'react';
import './fontAwesome';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chatbotconnecte from './components/Chatbotconnecte';
import AdminDashboardconnecte from './components/AdminDashboardconnecte';


import './App.css';
import logo from './images/pixelraise.png';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} alt="Pixelraise Logo" className="App-logo" />
          <h1>Pixelraise Chatbot</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Chatbotconnecte />} />
            <Route path="/administration" element={<AdminDashboardconnecte />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
