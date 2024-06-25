import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import CompanyNavbar from "../navbars/companynavbar";
import { useNavigate, Link, useLocation } from "react-router-dom";


function Myjobs() {
  const token = Cookies.get("token");
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [jobs, setJobs] = useState([]);
  const [limit, setLimit] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [togglemodal, setTogglemodal] = useState(false);
  const [message, setMessage] = useState("");
  const [jobid, setJobid] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [buttonstatus, setButtonstatus] = useState(true);
  const [applicants,setApplicants]=useState([])
  const [applicantCounts, setApplicantCounts] = useState({});
  const navigate=useNavigate()


  const handleViewJob = (jobId) => {
    navigate(`/employer/jobdetails/${jobId}`) 

  };

  const handleEditJob = (jobId) => {
    navigate(`/employer/editjobs/${jobId}`) 
  };

  const Handlejobpost = () => {
    navigate("/employer/postjob") 

  };

  const handleViewapplicants = (jobId) => {
    navigate(`/employer/applicants/${jobId}`) 

  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    loadJobs();
  }, [limit, startIndex]);

  const loadJobs = () => {
    const params = {
      limit: limit,
      user_id: userdetails.id,
      startIndex: startIndex,
    };

    MakeApiRequest(
      "get",
      `${config.baseUrl}company/postjob/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        if (response.length < 5) {
          setButtonstatus(false);
        } else {
          setButtonstatus(true);
        }
        setJobs(response);
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
  };

  useEffect(() => {
    loadApplicants();
  }, [jobs]);


  const loadApplicants = () => {
    MakeApiRequest(
      "get",
      `${config.baseUrl}company/allapplicants/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        setApplicants(response);
        const counts = response.reduce((acc, applicant) => {
          acc[applicant.job_id] = (acc[applicant.job_id] || 0) + 1;
          return acc;
        }, {});
        setApplicantCounts(counts);
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
  };




  const handleLoadMore = () => {
    setStartIndex(startIndex + limit);
  };

  const handleLoadPrevious = () => {
    setStartIndex(Math.max(0, startIndex - limit));
  };

  const handledeletemodal = (jobId) => {
    setShowDropdown(false);
    setJobid(jobId);
    setTogglemodal(true);
  };

  const handleDeleteJob = () => {
    const params = {
      jobid: jobid,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}company/viewjob/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setJobs(jobs.filter((job) => job.id !== jobid));
        setTogglemodal(false);
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
  };

  return (
    <>
        <CompanyNavbar/>
        <div className="w-full h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-1 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
        <div className="max-w-[75rem] h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
              <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                  My Jobs
                </h2>
                <div>
                  <div className="inline-flex gap-x-2">
                    <button
                      type="button"
                      onClick={Handlejobpost}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent  text-white  bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Post Job
                    </button>
                  </div>
                </div>
              </div>

              <table className="min-w-full  divide-y  divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800 ">
                  <tr>
                    <th scope="col" className="px-16 py-3 text-left ">
                      <a
                        className="group inline-flex items-center gap-x-2"
                        href="#"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Title
                        </span>
                      </a>
                    </th>

                    <th scope="col" className="px-16 py-3 text-left">
                      <a
                        className="group inline-flex items-center gap-x-2"
                        href="#"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Job Created
                        </span>
                      </a>
                    </th>

                    <th scope="col" className="px-16 py-3 text-left">
                      <a
                        className="group inline-flex items-center gap-x-2"
                        href="#"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Applicants
                        </span>
                      </a>
                    </th>

                    <th scope="col" className="px-20 py-3 text-left">
                      <a
                        className="group inline-flex items-center gap-x-2"
                        href="#"
                      >
                        <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                          Action
                        </span>
                      </a>
                    </th>

                    <th scope="col" className="px-6 py-3 text-end"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {jobs.map((job, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                    >
                      <td className="size-px whitespace-nowrap">
                        <a onClick={() =>{handleViewJob(job.id)}} className="block relative z-10 cursor-pointer">
                          <div className="px-9 py-2">
                            <div className="block text-sm text-blue-600 decoration-2 hover:underline dark:text-blue-500">
                              {job.jobtitle}
                            </div>
                          </div>
                        </a>
                      </td>
                      <td className="h-px w-72 min-w-72">
                        <a className="block relative z-10">
                          <div className="px-16 py-2">
                            <p className="text-sm text-gray-500 dark:text-neutral-500">
                              {job.jobposteddate}
                            </p>
                          </div>
                        </a>
                      </td>
                      <td className="size-px whitespace-nowrap">
                        <a onClick={() => handleViewapplicants(job.id)} className="block relative z-10 cursor-pointer" >
                          <div className="px-16 py-2">
                            <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-900 dark:text-neutral-200">
                            {applicantCounts[job.id] || 0} Applicants
                            </span>
                          </div>
                        </a>
                      </td>

                      <td className="size-px whitespace-nowrap">
                        <div className="relative inline-block px-20 py-2" onMouseLeave={()=>{setShowDropdown(false)}}>
                          <button
                            id="hs-table-dropdown-1"
                            type="button"
                            className=" hs-dropdown-toggle py-1.5 px-2 inline-flex justify-center items-center gap-2 rounded-lg text-gray-700 align-middle disabled:opacity-50 disabled:pointer-events-none transition-all text-sm dark:text-neutral-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                            onClick={(event) => {
                              setShowDropdown(true);
                              const menu = event.currentTarget.nextElementSibling;
                              if (menu) {
                                menu.classList.toggle("hidden");
                                menu.classList.toggle("opacity-0");
                                menu.classList.toggle("opacity-100");
                              } else {
                                console.error("Menu not found");
                              }
                            }}
                          >
                            <svg
                              className="flex-shrink-0 size-4"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                              <circle cx="5" cy="12" r="1" />
                            </svg>
                          </button>
                          {showDropdown && (
                            <div
                              className="absolute left-0 w-auto bg-white rounded-md shadow-lg hidden divide-y divide-gray-200 dark:divide-neutral-700"
                              style={{
                                zIndex: 1000,
                                marginTop: "-30px",
                                transform: "translateX(15%)",
                              }}
                            >
                              <a
                                onClick={() => handleViewJob(job.id)}
                                className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                View
                              </a>
                              <a
                                onClick={() => handleEditJob(job.id)}
                                className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                Edit
                              </a>
                              <a
                                onClick={() => handledeletemodal(job.id)}
                                className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                Delete
                              </a>
                              <a
                                 onClick={() => handleViewapplicants(job.id)}
                                className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                              >
                                Applicants
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-6 py-6 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                <div>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-semibold text-gray-800 dark:text-neutral-200">
                      {jobs.length}
                    </span>{" "}
                    results
                  </p>
                </div>

                <div>
                  <div className="inline-flex gap-x-2">
                    <button
                      type="button"
                      disabled={startIndex === 0}
                      onClick={handleLoadPrevious}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    >
                      <svg
                        className="flex-shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                      Prev
                    </button>

                    <button
                      type="button"
                      disabled={!buttonstatus} 
                      onClick={handleLoadMore}
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    >
                      Next
                      <svg
                        className="flex-shrink-0 size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {togglemodal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
              aria-hidden="true"
            ></div>
            <div className="inline-block w-full max-w-2xl p-8 my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl dark:bg-neutral-800 dark:border dark:border-neutral-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">
                Delete Job
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Are you sure you want to delete this job? All of the data will
                  be permanently removed. This action cannot be undone.
                </p>
              </div>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={handleDeleteJob}
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTogglemodal(false);
                  }}
                  className="mt-3 sm:mt-0 sm:mr-3 justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
}

export default Myjobs;
