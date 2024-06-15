import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { IoLocationOutline } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";

function Viewjobdetails({ setActiveComponent }) {
  const token = Cookies.get("token");
  const viewedJobId = localStorage.getItem("viewedJobId");
  const [job, setJob] = useState(null);

  const handlegoback = (e) => {
    e.preventDefault();
    setActiveComponent("search");
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const params = {
      jobid: viewedJobId,
    };

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
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  }, []);

  if (!job) {
    return (
      <div className="max-w-[65rem] h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-[65rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div
        onClick={handlegoback}
        className="flex items-center cursor-pointer text-slate-700"
      >
        <FaArrowLeft className="text-xs mr-1" />
        <p className="text-sm">Back to Jobs</p>
      </div>
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
                <div
                  key={index}
                  className="border rounded-md px-3 py-1 m-1 bg-slate-300"
                >
                  {keyword.trim()}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center mt-6">
            <button
              type="button"
              class="py-2 mr-2 px-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800"
            >
              Apply Now
            </button>
            <button
              type="button"
              class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none dark:bg-white dark:text-neutral-800"
            >
              Save Job
            </button>
            
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
                {job.joblocation}
              </li>
              <li>
                <strong className="mr-2">Job Nature:</strong>
                {job.jobnature}
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
  );
}

export default Viewjobdetails;
