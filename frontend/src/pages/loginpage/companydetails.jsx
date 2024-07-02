import React, { useState, useEffect } from "react";
import RegisterNavbar from '../../components/navbars/Registrationnav'
import Companyinfo from "../../components/companyregistration/Companyinfo";
import CompanyDetails from "../../components/companyregistration/Companydetails";
import EmployeeDetails from "../../components/companyregistration/Employeedetails";

function Companydetails() {
    const [activeComponent, setActiveComponent] = useState("companyinfo");

  return (
    <div>
        <RegisterNavbar/>
        <div className=" min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
            {activeComponent === 'companyinfo' && <Companyinfo setActiveComponent={setActiveComponent}/> }
            {activeComponent === 'companydetails' && <CompanyDetails setActiveComponent={setActiveComponent}/>}
            {activeComponent === 'employeedetails' && <EmployeeDetails/>}
        </div>
    </div>
  )
}

export default Companydetails
