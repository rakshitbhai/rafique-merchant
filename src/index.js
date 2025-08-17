import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/critical.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Defer loading of full theme (bundled via webpack) using dynamic import to avoid direct /src reference
const importFullTheme = () => import(/* webpackChunkName: 'full-theme' */ './styles/theme.css').catch(() => {});
if ('requestIdleCallback' in window) {
  // @ts-ignore
  requestIdleCallback(() => importFullTheme(), { timeout: 2000 });
} else {
  window.addEventListener('load', () => setTimeout(importFullTheme, 300));
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
