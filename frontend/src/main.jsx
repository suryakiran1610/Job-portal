import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ProfileProvider } from './context/ProfileContext.jsx'
import JobseekerProfile from './components/jobseeker/jobseekerprofile.jsx'
import JobseekerNavbar from './components/navbars/jobseekernavbar.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <ProfileProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ProfileProvider>
)
