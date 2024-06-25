import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { NotificationProvider } from "./context/NotificationContext.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationProvider>
    <ProfileProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ProfileProvider>
    </NotificationProvider>
)
