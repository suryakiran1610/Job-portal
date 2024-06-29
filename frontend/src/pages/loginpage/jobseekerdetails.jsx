import React from 'react'
import RegisterNavbar from '../../components/navbars/Registrationnav'
import Personalinfo from '../../components/jobseekerregistration/Personalinfo'


function Jobseekerdetails() {
  return (
    <div>
        <RegisterNavbar/>
        <div className="w-full h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-1 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
            <Personalinfo/>
        </div>
    </div>
  )
}

export default Jobseekerdetails
