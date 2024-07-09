import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { IoLocationOutline } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import CompanyNavbar from "../../components/navbars/companynavbar";
import BeatLoader from "react-spinners/BeatLoader";
import { BiCategory } from "react-icons/bi";




function Viewjob() {
  const token = Cookies.get("token");
  const [job, setJob] = useState(null);
  const { id } = useParams();
  const [isloading, setIsloading] = useState(false);



  

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const params = {
      jobid: id,
    };

    setIsloading(true);
    MakeApiRequest(
      "get",
      `${config.baseUrl}company/viewjob/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setJob(response);
        setIsloading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsloading(false);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  }, []);


  return (
    <>
      <CompanyNavbar/>
      {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : !job ? (
        <div className="h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <h1 className="text-red-700">Job Expired...</h1>
        </div>
      ) : (
    <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
      <div className="flex flex-col md:flex-row p-4">
        <div className="flex-1 bg-white p-9 shadow-md mb-4 md:mb-0 rounded-sm">
          <h2 className="text-2xl font-bold text-green-600 mb-3">
            {job.jobtitle}
          </h2>
          <div className="flex items-center">
            <IoLocationOutline />
            <p className="text-gray-500 ml-1 mr-1">{job.joblocation}</p>
            <CiClock2 />
            <p className="text-gray-500 ml-1">{job.jobnature}</p>
            <BiCategory className="text-center ml-1" />
            <p className="text-gray-500 ml-1">{job.jobcategory}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Job description</h3>
            <p className="text-gray-600 mt-2">{job.jobdescription}</p>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Responsibility</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {job.jobresponsibility.split(".").map((responsibility, index) => (
                <li key={index}>{responsibility.trim()}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Qualification</h3>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {job.jobqualification.split(".").map((qualification, index) => (
                <li key={index}>{qualification.trim()}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Keywords</h3>
            <div className="flex flex-wrap">
              {job.jobkeywords.split(",").map((keyword, index) => (
                <div key={index} className="border rounded-md px-3 py-1 m-1 bg-slate-300">
                  {keyword.trim()}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Divs */}
        <div className="flex flex-col space-y-4 md:ml-4 w-full md:w-1/3">
          <div className="bg-white p-6 shadow-md rounded-sm">
            <h3 className="text-xl font-semibold">Job Summary</h3>
            <ul className="mt-2 text-gray-600">
              <li>
                <strong className="mr-2">Published on:</strong>
                {job.jobposteddate}
              </li>
              <li>
                <strong className="mr-2">Vacancy:</strong>
                {job.jobvacancy} Positions
              </li>
              <li>
                <strong className="mr-2">Salary:</strong>
                {job.jobsalary}
              </li>
              <li>
                <strong className="mr-2">Location:</strong>
                {job.joblocation},{job.joblocationstate}
              </li>
              <li>
                <strong className="mr-2">Job Nature:</strong>
                {job.jobnature}
              </li>
              <li>
                <strong className="mr-2">Experience:</strong>
                {job.jobexperiance} Year
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 shadow-md rounded-sm">
            <h3 className="text-xl font-semibold">Company Details</h3>
            <ul className="mt-2 text-gray-600">
              <li>
                <strong className="mr-2">Name:</strong>
                {job.companyname}
              </li>
              <li>
                <strong className="mr-2">Location:</strong>
                {job.companylocation}
              </li>
              <li>
                <strong className="mr-2">Website:</strong>
                {job.companywebsite}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
}

export default Viewjob;
