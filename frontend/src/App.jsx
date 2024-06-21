import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import 'flowbite/dist/flowbite.css';
import 'flowbite';
import "preline/preline";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './pages/loginpage/login';
import Admin from './pages/adminpage/admin';
import Jobseeker from './pages/jobseekerpage/jobseeker';
import Appliedjobs from './components/jobseeker/appliedjobs';
import JobseekerProfile from './components/jobseeker/jobseekerprofile';
import Jobseekersearch from './components/jobseeker/jobseekersearch';
import Savedjobs from './components/jobseeker/savedjobs';
import Viewjobdetails from './components/jobseeker/viewjobdetails';
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
              <Route path='/appliedjobs' element={<Appliedjobs/>}/>
              <Route path='/jobseekerprofile' element={<JobseekerProfile/>}/>
              <Route path='/jobseekersearch' element={<Jobseekersearch/>}/>
              <Route path='/savedjobs' element={<Savedjobs/>}/>
              <Route path='/jobdetails' element={<Viewjobdetails/>}/>
        </Routes>
    </>
  )
}

export default App
