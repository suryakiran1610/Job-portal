import React, { useState, useEffect } from "react";
import RegisterNavbar from '../../components/navbars/Registrationnav'
import Personalinfo from '../../components/jobseekerregistration/Personalinfo'
import Education from '../../components/jobseekerregistration/Education';
import Experience from "../../components/jobseekerregistration/Experience";
import Skills from "../../components/jobseekerregistration/Skills";


function Jobseekerdetails() {
    const [activeComponent, setActiveComponent] = useState("personalinfo");

  return (
    <div>
        <RegisterNavbar/>
        <div className=" min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
            {activeComponent === 'personalinfo' && <Personalinfo setActiveComponent={setActiveComponent}/> }
            {activeComponent === "education" &&<Education  setActiveComponent={setActiveComponent}/>}
            {activeComponent === "experience" && <Experience setActiveComponent={setActiveComponent}/>}
            {activeComponent === "skills" && <Skills/>}
        </div>
    </div>
  )
}

export default Jobseekerdetails
