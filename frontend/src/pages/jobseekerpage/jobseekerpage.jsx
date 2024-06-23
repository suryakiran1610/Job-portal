import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import JobseekerNavbar from "../../components/navbars/jobseekernavbar";
import JobseekerProfile from '../../components/jobseeker/jobseekerprofile'

function Jobseekerpage() {
    const location = useLocation();
    const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  return (
    <div>
        <JobseekerNavbar/>
        <div className="h-full" style={{ backgroundColor: "#EEEEEE" }}>
        </div>
      
    </div>
  )
}

export default Jobseekerpage
