import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import JobseekerNavbar from "../../components/navbars/jobseekernavbar";
import { useNavigate, Link, useLocation } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";



function Savedjobs() {
    const [allsavedjobs,setAllsavedjobs]=useState([]);
    const token = Cookies.get("token");
    const userdetails = JSON.parse(localStorage.getItem("user"));
    const [limit, setLimit] = useState(5);
    const [startIndex, setStartIndex] = useState(0);
    const [buttonstatus, setButtonstatus] = useState(true);
    const [jobid, setJobid] = useState("");
    const [togglemodal, setTogglemodal] = useState(false);
    const navigate=useNavigate()
    const [isloading, setIsloading] = useState(false);






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
        setIsloading(true);
        MakeApiRequest(
          "get",
          `${config.baseUrl}jobseeker/limitsavejobview/`,
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
            setAllsavedjobs(response);
            setIsloading(false);
          })
          .catch((error) => {
            setIsloading(false);
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

    const viewsavedjob = (jobId) => {
        navigate(`/jobseeker/jobdetails/${jobId}`) 
    };

    const handledeletemodal = (jobId) => {
        setJobid(jobId);
        setTogglemodal(true);
    };

    const deletesavedjob = () => {
        const params = {
          jobid: jobid,
        };

    
        MakeApiRequest(
          "delete",
          `${config.baseUrl}jobseeker/savejob/`,
          headers,
          params,
          {}
        )
          .then((response) => {
            console.log(response);
            setTogglemodal(false)
            setAllsavedjobs(allsavedjobs.filter((job) => job.id !== jobid));
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
      <JobseekerNavbar/>
      {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (  
      <div className=" h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-1 mx-auto">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                        Saved Jobs
                      </h2>
                    </div>

              
                  </div>

                  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                    <thead className="bg-gray-50 dark:bg-neutral-800">
                      <tr>
                        <th
                          scope="col"
                          className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                        >
                          <div className="flex items-center gap-x-2 ml-10">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Tile
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2 ml-3">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Company
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2 ml-10">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Saved On
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2 ml-10">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              View
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start ml-10">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Delete
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-end"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {allsavedjobs.map((savedjobs,index)=>(
                      <tr key={index}>
                        <td className="size-px whitespace-nowrap">
                          <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 ml-10">
                            <div className="flex items-center gap-x-3">
                              <span className="block text-sm text-black">
                                {savedjobs.job_title}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="h-px w-72 whitespace-nowrap">
                          <div className="px-6 py-3 ml-3">
                            <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                              {savedjobs.company_name}
                            </span>
                            
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3 ml-10">
                            <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                              {savedjobs.saveddate}
                            </span>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3 ml-10">
                            <div className="flex items-center gap-x-3">
                              <span onClick={()=>{viewsavedjob(savedjobs.jobid)}} className="text-sm text-blue-600 dark:text-neutral-500 cursor-pointer hover:text-blue-800">
                                View
                              </span>                              
                            </div>
                          </div>
                        </td>
                        <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3 ml-2">
                            <span onClick={() => handledeletemodal(savedjobs.id)} className="text-sm text-red-600 dark:text-neutral-500 cursor-pointer  hover:text-red-800">
                              Delete
                            </span>
                          </div>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-neutral-400">
                        <span className="font-semibold text-gray-800 dark:text-neutral-200">
                        {allsavedjobs.length}
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
                          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
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
                          className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
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
                Delete Saved Job
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Are you sure you want to delete this Saved job?. This action cannot be undone.
                </p>
              </div>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={deletesavedjob}
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
      )}
    </>
  );
}

export default Savedjobs;
