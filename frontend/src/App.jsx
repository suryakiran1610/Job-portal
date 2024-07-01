import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter,useNavigate, useLocation } from 'react-router-dom';
import 'flowbite/dist/flowbite.css';
import 'flowbite';
import "preline/preline";
import { useEffect } from 'react';
import Login from './pages/loginpage/login';
import Appliedjobs from './pages/jobseeker/appliedjobs';
import JobseekerProfile from './pages/jobseeker/jobseekerprofile';
import Jobseekersearch from './pages/jobseeker/jobseekersearch';
import Savedjobs from './pages/jobseeker/savedjobs';
import Viewjobdetails from './pages/jobseeker/viewjobdetails';
import Applicants from './pages/company/applicants';
import Companysearch from './pages/company/companysearch';
import Editjobs from './pages/company/editjobs';
import Myjobs from './pages/company/myjobs';
import Postjob from './pages/company/postjob';
import Profile from './pages/company/profile';
import UserProfile from './pages/company/userprofile';
import Viewjob from './pages/company/viewjob';
import Admindashboard from './pages/admin/admindashboard';
import Adminprofile from './pages/admin/adminprofile';
import Companyprofile from './pages/admin/companyprofile';
import Editjobdetails from './pages/admin/editjobdetails';
import Jobdetails from './pages/admin/jobdetails';
import Jobseekerprofile from './pages/admin/jobseekerprofile';
import Notification from './pages/admin/notification';
import Viewcompanies from './pages/admin/viewcompanies';
import ViewJobs from './pages/admin/viewjobs';
import Viewjobseeker from './pages/admin/viewjobseekers';
import Pagenotfound from './pages/pagenotfound/Pagenotfound';
import Jobseekerdetails from './pages/loginpage/jobseekerdetails';
import Companydetails from './pages/loginpage/companydetails';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    // const token = Cookies.get('token');

    // if (token) {
    //   try {
    //     const decodedToken = jwtDecode(token);
    //     const currentTime = Date.now() / 1000;

    //     if (decodedToken.exp < currentTime) {
    //       Cookies.remove('token');
    //       navigate('/');
    //     }
    //   } catch (error) {
    //     console.error("Invalid token:", error);
    //     Cookies.remove('token');
    //     navigate('/');
    //   }
    // } else {
    //   navigate('/');
    // }

    window.HSStaticMethods.autoInit();
  }, [location.pathname]);



  return (
    <>
        <Routes>
          <Route path='/' element={<Login/>}/>
          {/* <Route path="*" element={<Pagenotfound/>}/> */}
          <Route path='jobseekerdetails/:id' element={<Jobseekerdetails/>}/>
          <Route path='companydetails/:id' element={<Companydetails/>}/>

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


            <Route path='/employer'>
                <Route path='applicants/:id' element={<Applicants/>}/>
                <Route path='employersearch' element={<Companysearch/>}/>
                <Route path='editjobs/:id' element={<Editjobs/>}/>
                <Route path='myjobs' element={<Myjobs/>}/>
                <Route path='postjob' element={<Postjob/>}/>
                <Route path='employerprofile' element={<Profile/>}/>
                <Route path='jobseekerprofile/:id' element={<UserProfile/>}/>
                <Route path='jobdetails/:id' element={<Viewjob/>}/>
            </Route>

            <Route path='/jobseeker'>
                <Route path='appliedjobs' element={<Appliedjobs/>}/>
                <Route path='jobseekerprofile' element={<JobseekerProfile/>}/>
                <Route path='jobseekersearch' element={<Jobseekersearch/>}/>
                <Route path='savedjobs' element={<Savedjobs/>}/>
                <Route path='jobdetails/:id' element={<Viewjobdetails/>}/>
            </Route>


        </Routes>
    </>
  )
}

export default App
