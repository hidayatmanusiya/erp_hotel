import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.scss';
import Router from './navigation/Router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);