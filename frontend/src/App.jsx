import {Routes, Route, Link } from 'react-router-dom';
import 'flowbite/dist/flowbite.css';
import 'flowbite';
import "preline/preline";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './pages/loginpage/login';
import Admin from './pages/adminpage/admin';
import Jobseeker from './pages/jobseekerpage/jobseeker';
import Employer from './pages/employerpage/employer';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/employer' element={<Employer/>}/>
          <Route path='/jobseeker' element={<Jobseeker/>}/>
        </Routes>
    </>
  )
}

export default App
