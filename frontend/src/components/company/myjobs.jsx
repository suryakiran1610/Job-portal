import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";


function Myjobs({ setActiveComponent }) {
    const token=Cookies.get('token')
    const userdetails=JSON.parse(localStorage.getItem("user"))
    const [jobs,setJobs]=useState([])
    const [limit, setLimit] = useState(5);
    const [startIndex, setStartIndex] = useState(0);

    const handleViewJob = (jobId) => {
        localStorage.setItem('viewedJobId', jobId);
        setActiveComponent('viewjob');
    };
      


    const headers = {
        'Authorization': `Bearer ${token}`
    }

    useEffect(() => {
        loadJobs();
    }, [limit, startIndex]); 

    const loadJobs = () => {
        const params = {
            limit: limit,
            user_id: userdetails.id,
            startIndex: startIndex
        };

        MakeApiRequest('get',`${config.baseUrl}company/postjob/`,headers,params,{})
        .then(response => {
            console.log(response)
            setJobs(response)
        })
        .catch(error => {
          console.error('Error:', error);
          if (error.response && error.response.status === 401) {
              console.log('Unauthorized access. Token might be expired or invalid.');
          } else {
              console.error('Unexpected error occurred:', error);
          }
      });
    };  

    const handleLoadMore = () => {
        setStartIndex(startIndex + limit);
    };

    const handleLoadPrevious = () => {
        setStartIndex(Math.max(0, startIndex - limit));
    };

    

    

  return (
    <div className="max-w-[65rem] h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
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
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
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
                    {jobs.map((job,index)=>(
                  <tr key={index} className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                    <td className="size-px whitespace-nowrap">
                      <a className="block relative z-10" href="#">
                        <div className="px-16 py-2">
                          <div className="block text-sm text-blue-600 decoration-2 hover:underline dark:text-blue-500">
                            {job.jobtitle}
                          </div>
                        </div>
                      </a>
                    </td>
                    <td className="h-px w-72 min-w-72">
                      <a className="block relative z-10" href="#">
                        <div className="px-16 py-2">
                          <p className="text-sm text-gray-500 dark:text-neutral-500">
                            {job.jobposteddate}
                          </p>
                        </div>
                      </a>
                    </td>
                    <td className="size-px whitespace-nowrap">
                      <a className="block relative z-10" href="#">
                        <div className="px-16 py-2">
                          <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 dark:bg-neutral-900 dark:text-neutral-200">
                            Applicants
                          </span>
                        </div>
                      </a>
                    </td>

                    <td className="size-px whitespace-nowrap">
                      <div className="relative inline-block px-20 py-2">
                        <button
                          id="hs-table-dropdown-1"
                          type="button"
                          className="hs-dropdown-toggle py-1.5 px-2 inline-flex justify-center items-center gap-2 rounded-lg text-gray-700 align-middle disabled:opacity-50 disabled:pointer-events-none transition-all text-sm dark:text-neutral-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
                          onClick={(event) => {
                            const menu = event.currentTarget.nextElementSibling;
                            menu.classList.toggle("hidden");
                            menu.classList.toggle("opacity-0");
                            menu.classList.toggle("opacity-100");
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
                            href="#"
                          >
                            View
                          </a>
                          <a
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            href="#"
                          >
                            Edit
                          </a>
                          <a
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            href="#"
                          >
                            Delete
                          </a>
                          <a
                            className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                            href="#"
                          >
                            Applicants
                          </a>
                        </div>
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
    </div>
  );
}

export default Myjobs;
