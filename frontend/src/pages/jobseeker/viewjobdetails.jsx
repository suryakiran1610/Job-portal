import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { IoLocationOutline } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";
import JobseekerNavbar from "../../components/navbars/jobseekernavbar";
import { useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

function Viewjobdetails() {
  const token = Cookies.get("token");
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [job, setJob] = useState(null);
  const [allappliedjobs, setAllappliedjobs] = useState([]);
  const [allsavedjobs, setAllsavedjobs] = useState([]);
  const [addresumemodal, setAddresumemodal] = useState(false);
  const [addresume, setAddresume] = useState(null);
  const [message, setMessage] = useState("");
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
      console.log("Redirecting to login component");
      MakeApiRequest(
        "get",
        `${config.baseUrl}company/viewjob/`,
        headers,
        params,
        {}
      )
        .then((response) => {
          console.log("Job Details Response:", response);
          setJob(response);
          setIsloading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setIsloading(false);
        });
  }, []);

  useEffect(() => {
    const params = {
      userid: userdetails.id,
    };

    MakeApiRequest(
      "get",
      `${config.baseUrl}jobseeker/applyjob/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("Applied Jobs Response:", response);
        setAllappliedjobs(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const params = {
      userid: userdetails.id,
    };

    MakeApiRequest(
      "get",
      `${config.baseUrl}jobseeker/savejob/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("Saved Jobs Response:", response);
        setAllsavedjobs(response);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const Applyjob = () => {
    if (!addresume) {
      setMessage("Please upload a resume before applying");
      return;
    }

    const formData = new FormData();
    formData.append("job_id", job.id);
    formData.append("jobtitle", job.jobtitle);
    formData.append("companyname", job.companyname);
    formData.append("user_id", userdetails.id);
    formData.append("resume", addresume);
    formData.append("companyuserid", job.company_user_id);
    formData.append("username", userdetails.fullname);

    MakeApiRequest(
      "post",
      `${config.baseUrl}jobseeker/applyjob/`,
      headers,
      {},
      formData
    )
      .then((response) => {
        console.log("Apply Job Response:", response);
        setMessage("Job Applied successfully");
        setTimeout(() => {
          setAddresumemodal(false);
          setMessage("");
        }, 2000);
        setAllappliedjobs((prev) => [...prev, response]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const Savejob = () => {
    const formData = new FormData();
    formData.append("jobid", job.id);
    formData.append("job_title", job.jobtitle);
    formData.append("company_name", job.companyname);
    formData.append("userid", userdetails.id);

    MakeApiRequest(
      "post",
      `${config.baseUrl}jobseeker/savejob/`,
      headers,
      {},
      formData
    )
      .then((response) => {
        console.log("Save Job Response:", response);
        setMessage("Job Saved successfully");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        setAllsavedjobs((prev) => [...prev, response]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const isJobApplied =
    job && allappliedjobs.some((appliedJob) => appliedJob.job_id === job.id);

  const isSaved =
    job && allsavedjobs.some((savedJob) => Number(savedJob.jobid) === job.id);

  

  return (
    <>
      <JobseekerNavbar />
      {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : !job ? (
        <div className="h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <h1 className="text-red-700">Job Expired...</h1>
        </div>
      ) : (
      <div
        className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto"
        style={{ backgroundColor: "#EEEEEE" }}
      >
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
                {job.jobresponsibility
                  .split(".")
                  .map((responsibility, index) => (
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
              {isJobApplied ? (
                <button
                  type="button"
                  className="py-2 mr-2 px-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-800 text-white disabled:opacity-50"
                  disabled
                >
                  Applied
                </button>
              ) : (
                <button
                  onClick={() => setAddresumemodal(true)}
                  type="button"
                  className="py-2 mr-2 px-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-800 text-white hover:bg-gray-900"
                >
                  Apply Now
                </button>
              )}
              {isSaved ? (
                <button
                  type="button"
                  className="py-2 mr-2 px-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-800 text-white disabled:opacity-50"
                  disabled
                >
                  Saved
                </button>
              ) : (
                <button
                  onClick={Savejob}
                  type="button"
                  className="py-2 mr-2 px-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-800 text-white hover:bg-gray-900"
                >
                  Save Now
                </button>
              )}
            </div>
            {message &&
              (message === "Job Saved successfully" ? (
                <div
                  className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                  role="alert"
                >
                  <span className="font-bold">Success:</span> Job Saved
                  successfully.
                </div>
              ) : null)}
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

        {addresumemodal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center py-3 px-4 border-b">
                <h3 className="font-bold text-gray-800">ADD Resume</h3>
                <button
                  onClick={() => setAddresumemodal(false)}
                  type="button"
                  className="text-gray-800 hover:bg-gray-100 rounded-full p-1"
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-2">
                <label className="block text-sm font-medium mb-2">
                  Resume:
                </label>
                <input
                  onChange={(e) => setAddresume(e.target.files[0])}
                  type="file"
                  className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                <button
                  onClick={() => setAddresumemodal(false)}
                  type="button"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={Applyjob}
                  type="submit"
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
              {message && (
                <div
                  className={`mt-2 border rounded-lg p-4 ${
                    message === "Job Applied successfully"
                      ? "bg-teal-100 border-teal-200 text-teal-800 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                      : "bg-yellow-100 border-yellow-200 text-yellow-800 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                  }`}
                  role="alert"
                >
                  <span className="font-bold">
                    {message === "Job Applied successfully"
                      ? "Success:"
                      : "Warning:"}
                  </span>{" "}
                  {message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      )}
    </>
  );
}

export default Viewjobdetails;
