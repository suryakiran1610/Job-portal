import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Adminsidebar from "../../components/navbars/Adminsidebar";
import AdminNav from "../../components/navbars/Adminnav";
import BeatLoader from "react-spinners/BeatLoader";
import { useParams } from "react-router-dom";

function Activejobs() {
  const [alljobs, setAlljobs] = useState([]);
  const token = Cookies.get("token");
  const { id } = useParams();

  const [limit, setLimit] = useState(5);
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [buttonstatus, setButtonstatus] = useState(true);
  const [jobid, setJobid] = useState("");
  const [togglemodal, setTogglemodal] = useState(false);
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);



  const handleViewJob = (jobId) => {
    navigate(`/admin/jobdetails/${jobId}`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/admin/editjobs/${jobId}`);
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
      user_id:id,
      startIndex: startIndex,
      companyname: company,
      start: startDate,
      end: endDate,
    };

    setIsloading(true);
    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/limitfilteredjobsview/`,
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
        setAlljobs(response);
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
  };

  const handleLoadMore = () => {
    setStartIndex(startIndex + limit);
  };

  const handleLoadPrevious = () => {
    setStartIndex(Math.max(0, startIndex - limit));
  };

  const handledeletemodal = (jobId) => {
    setJobid(jobId);
    setTogglemodal(true);
  };

  const deletejob = () => {
    const params = {
      jobid: jobid,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/limitjobsview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal(false);
        setAlljobs(alljobs.filter((job) => job.id !== jobid));
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

  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0);
    loadJobs();
  };

  return (
    <>
      <AdminNav />
      <div className="flex min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
        <div className="md:64">
          <Adminsidebar />
        </div>
        {isloading ? (
          <div
            className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
            style={{ backgroundColor: "#EEEEEE" }}
          >
            <BeatLoader color="#6b7280" margin={1} size={50} />
          </div>
        ) : (
          <div className="max-w-[75rem] h-screen px-4 py-1 sm:px-6 lg:px-8 lg:py-1 mx-auto overflow-auto">
            <div className="flex items-center justify-center p-4">
              <form className="bg-white shadow-xl flex flex-col lg:flex-row md:flex-col w-full max-w-3xl border mt-5 rounded-xl overflow-hidden items-center space-y-2 md:space-y-0">
                <div className="h-12 border-l hidden md:block"></div>

                <div className="flex flex-col md:flex-row w-full md:flex-1 p-2 space-y-2 md:space-y-0 md:space-x-2">
                  <div className="flex items-center w-full md:flex-1">
                    <label className="text-sm text-gray-600 mb-1 mr-1">Start</label>
                    <input
                      onChange={(e) => setStartDate(e.target.value)}
                      type="date"
                      className="w-full px-4 py-2 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center w-full md:flex-1">
                    <label className="text-sm text-gray-600 mb-1 mr-2">End</label>
                    <input
                      onChange={(e) => setEndDate(e.target.value)}
                      type="date"
                      className="w-full px-4 py-2 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="md:flex p-2">
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 text-white bg-slate-800 hover:bg-slate-900 rounded-lg md:rounded-lg"
                  >
                    Find jobs
                  </button>
                </div>
              </form>
            </div>

            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                          Active Jobs
                        </h2>
                      </div>

                      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-800">
                          <tr>
                            <th
                              scope="col"
                              className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                            >
                              <div className="flex items-center gap-x-2 ml-14">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Title
                                </span>
                              </div>
                            </th>

                            <th scope="col" className="px-6 py-3 text-start">
                              <div className="flex items-center gap-x-2 ml-12">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Company
                                </span>
                              </div>
                            </th>

                            <th scope="col" className="px-6 py-3 text-start">
                              <div className="flex items-center gap-x-2 ml-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Posted
                                </span>
                              </div>
                            </th>

                            <th scope="col" className="px-6 py-3 text-start">
                              <div className="flex items-center gap-x-2 ml-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  View
                                </span>
                              </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-start">
                              <div className="flex items-center gap-x-2 ml-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Edit
                                </span>
                              </div>
                            </th>

                            <th
                              scope="col"
                              className="px-6 py-3 text-start ml-3"
                            >
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
                          {alljobs.map((jobs, index) => (
                            <tr key={index}>
                              <td className="h-px w-72 whitespace-nowrap">
                                <div className="px-6 py-3 ml-7">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {jobs.jobtitle}
                                  </span>
                                </div>
                              </td>
                              <td className="h-px w-72 whitespace-nowrap">
                                <div className="px-6 py-3 ml-12">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {jobs.companyname}
                                  </span>
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-3">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {jobs.jobposteddate}
                                  </span>
                                </div>
                              </td>

                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-1">
                                  <div className="flex items-center gap-x-3">
                                    <a
                                      onClick={() => handleViewJob(jobs.id)}
                                      className="text-sm text-blue-600 dark:text-neutral-500 cursor-pointer hover:text-blue-800"
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-1">
                                  <div className="flex items-center gap-x-3">
                                    <a
                                      onClick={() => handleEditJob(jobs.id)}
                                      className="text-sm text-violet-600 dark:text-neutral-500 cursor-pointer hover:text-violet-800"
                                    >
                                      Edit
                                    </a>
                                  </div>
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-1">
                                  <span
                                    onClick={() => handledeletemodal(jobs.id)}
                                    className="text-sm text-red-600 dark:text-neutral-500 cursor-pointer  hover:text-red-800"
                                  >
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
                              {alljobs.length}
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
                      Delete Job
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Are you sure you want to Delete this Job ?. This action
                        cannot be undone.
                      </p>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={deletejob}
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
      </div>
    </>
  );
}

export default Activejobs;
