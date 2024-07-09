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
import Jobseekereducation from './pages/jobseeker/Jobseekereducation';
import Jobseekerexperience from './pages/jobseeker/Jobseekerexperience';
import Addeducation from './pages/jobseeker/Addeducation';
import Addexperience from './pages/jobseeker/Addexperience';
import Applicants from './pages/company/applicants';
import Companysearch from './pages/company/companysearch';
import Editjobs from './pages/company/editjobs';
import Myjobs from './pages/company/myjobs';
import Postjob from './pages/company/postjob';
import Profile from './pages/company/profile';
import UserProfile from './pages/company/userprofile';
import Viewjob from './pages/company/viewjob';
import Depts_Sectors from './pages/company/Depts_Sectors';
import Addsector from './pages/company/Addsector';
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
import Activejobs from './pages/admin/Activejobs';
import Jobhistory from './pages/admin/Jobhistory';
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
                <Route path='activejobs/:id' element={<Activejobs/>}/>
                <Route path='jobhistory/:id' element={<Jobhistory/>}/>
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
                <Route path='departments_sectors' element={<Depts_Sectors/>}/>
                <Route path='addsector' element={<Addsector/>}/>
            </Route>

            <Route path='/jobseeker'>
                <Route path='appliedjobs' element={<Appliedjobs/>}/>
                <Route path='jobseekerprofile' element={<JobseekerProfile/>}/>
                <Route path='jobseekerexperience' element={<Jobseekerexperience/>}/>
                <Route path='jobseekereducation' element={<Jobseekereducation/>}/>
                <Route path='addeducation' element={<Addeducation/>}/>
                <Route path='addexperience' element={<Addexperience/>}/>
                <Route path='jobseekersearch' element={<Jobseekersearch/>}/>
                <Route path='savedjobs' element={<Savedjobs/>}/>
                <Route path='jobdetails/:id' element={<Viewjobdetails/>}/>
            </Route>


        </Routes>
    </>
  )
}

export default App
