import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/index';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          fontSize: '13px',
          fontFamily: 'Arial',
          maxWidth: '320px',
          padding: '10px 14px',
          borderRadius: '8px',
        },
        success: {
          style: {
            background: '#e8f5e9',
            color: '#2e7d32',
            border: '1px solid #a5d6a7',
          },
          iconTheme: {
            primary: '#2e7d32',
            secondary: '#ffffff',
          },
        },
        error: {
          style: {
            background: '#ffebee',
            color: '#b71c1c',
            border: '1px solid #ef9a9a',
          },
          iconTheme: {
            primary: '#b71c1c',
            secondary: '#ffffff',
          },
        },
      }}
    />
    <App />
  </Provider>
);