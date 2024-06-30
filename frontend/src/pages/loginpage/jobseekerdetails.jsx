import React, { useState, useEffect } from "react";
import RegisterNavbar from '../../components/navbars/Registrationnav'
import Personalinfo from '../../components/jobseekerregistration/Personalinfo'
import Education from '../../components/jobseekerregistration/Education';
import Experience from "../../components/jobseekerregistration/Experience";
import Skills from "../../components/jobseekerregistration/Skills";


function Jobseekerdetails() {
    const [activeComponent, setActiveComponent] = useState("skills");

  return (
    <div>
        <RegisterNavbar/>
        <div className="w-full h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-1 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
            {activeComponent === 'personalinfo' && <Personalinfo setActiveComponent={setActiveComponent}/> }
            {activeComponent === "education" &&<Education  setActiveComponent={setActiveComponent}/>}
            {activeComponent === "experience" && <Experience setActiveComponent={setActiveComponent}/>}
            {activeComponent === "skills" && <Skills/>}
        </div>
    </div>
  )
}

export default Jobseekerdetails
