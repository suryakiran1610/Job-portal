import React, { useState, useEffect } from "react";
import RegisterNavbar from '../../components/navbars/Registrationnav'
import Companyinfo from "../../components/companyregistration/Companyinfo";
import CompanyDetails from "../../components/companyregistration/Companydetails";

function Companydetails() {
    const [activeComponent, setActiveComponent] = useState("companydetails");

  return (
    <div>
        <RegisterNavbar/>
        <div className="w-full h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-1 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
            {activeComponent === 'companyinfo' && <Companyinfo setActiveComponent={setActiveComponent}/> }
            {activeComponent === 'companydetails' && <CompanyDetails/>}
        </div>
    </div>
  )
}

export default Companydetails
