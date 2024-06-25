import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import 'flowbite/dist/flowbite.css';
import 'flowbite';
import "preline/preline";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Login from './pages/loginpage/login';
import Appliedjobs from './components/jobseeker/appliedjobs';
import JobseekerProfile from './components/jobseeker/jobseekerprofile';
import Jobseekersearch from './components/jobseeker/jobseekersearch';
import Savedjobs from './components/jobseeker/savedjobs';
import Viewjobdetails from './components/jobseeker/viewjobdetails';
import Applicants from './components/company/applicants';
import Companysearch from './components/company/companysearch';
import Editjobs from './components/company/editjobs';
import Myjobs from './components/company/myjobs';
import Postjob from './components/company/postjob';
import Profile from './components/company/profile';
import UserProfile from './components/company/userprofile';
import Viewjob from './components/company/viewjob';
import Admindashboard from './components/admin/admindashboard';
import Adminprofile from './components/admin/adminprofile';
import Companyprofile from './components/admin/companyprofile';
import Editjobdetails from './components/admin/editjobdetails';
import Jobdetails from './components/admin/jobdetails';
import Jobseekerprofile from './components/admin/jobseekerprofile';
import Notification from './components/admin/notification';
import Viewcompanies from './components/admin/viewcompanies';
import ViewJobs from './components/admin/viewjobs';
import Viewjobseeker from './components/admin/viewjobseekers';
import Pagenotfound from './pages/pagenotfound/Pagenotfound';

function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path="*" element={<Pagenotfound/>}/>

            <Route path='/admin'>
            <Route path='dashboard' element={<Admindashboard/>}/>
            <Route path='adminprofile' element={<Adminprofile/>}/>
            <Route path='companyprofile/:id' element={<Companyprofile/>}/>
            <Route path='editjobs/:id' element={<Editjobdetails/>}/>
            <Route path='jobdetails/:id' element={<Jobdetails/>}/>
            <Route path='jobseekerprofile/:id' element={<Jobseekerprofile/>}/>
            <Route path='notifications' element={<Notification/>}/>
            <Route path='viewcompanies' element={<Viewcompanies/>}/>
            <Route path='viewjobs' element={<ViewJobs/>}/>
            <Route path='viewjobseekers' element={<Viewjobseeker/>}/>
            </Route>

          
            <Route path='/employer/applicants/:id' element={<Applicants/>}/>
            <Route path='/employer/employersearch' element={<Companysearch/>}/>
            <Route path='/employer/editjobs/:id' element={<Editjobs/>}/>
            <Route path='/employer/myjobs' element={<Myjobs/>}/>
            <Route path='/employer/postjob' element={<Postjob/>}/>
            <Route path='/employer/employerprofile' element={<Profile/>}/>
            <Route path='/employer/jobseekerprofile/:id' element={<UserProfile/>}/>
            <Route path='/employer/jobdetails/:id' element={<Viewjob/>}/>


            <Route path='/jobseeker/appliedjobs' element={<Appliedjobs/>}/>
            <Route path='/jobseeker/jobseekerprofile' element={<JobseekerProfile/>}/>
            <Route path='/jobseeker/jobseekersearch' element={<Jobseekersearch/>}/>
            <Route path='/jobseeker/savedjobs' element={<Savedjobs/>}/>
            <Route path='/jobseeker/jobdetails/:id' element={<Viewjobdetails/>}/>
        </Routes>
    </>
  )
}

export default App
