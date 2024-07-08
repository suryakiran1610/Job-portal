import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Adminsidebar from "../../components/navbars/Adminsidebar";
import AdminNav from "../../components/navbars/Adminnav";
import BeatLoader from "react-spinners/BeatLoader";



function Viewjobseeker() {
  const [allusers, setAllusers] = useState([]);
  const token = Cookies.get("token");
  const [limit, setLimit] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [buttonstatus, setButtonstatus] = useState(true);
  const [userid, setUserid] = useState(null);
  const [togglemodal, setTogglemodal] = useState(false);
  const navigate=useNavigate()
  const [isloading, setIsloading] = useState(false);

  const handleViewJobseeker = (jobseekerId) => {
    navigate(`/admin/jobseekerprofile/${jobseekerId}`) 

  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    setIsloading(true);
    loadJobs();
  }, [limit, startIndex]);

  const loadJobs = () => {
    const params = {
      limit: limit,
      startIndex: startIndex,
    };

    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/limitjobseekerview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("jobseekerlist",response);
        if (response.length <5) {
          setButtonstatus(false);
        } else {
          setButtonstatus(true);
        }
        setAllusers(response);
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



  const handledeletemodal = (userId) => {
    setUserid(userId);
    setTogglemodal(true);
  };

  const deleteuser = () => {
    const params = {
      userid: userid,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/getalljobseeker/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal(false);
        setAllusers(
          allusers.filter((user) => user.user_id !== userid)
        );
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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  return (
    <>
      <AdminNav/>
      <div className="flex min-h-screen"style={{ backgroundColor: "#EEEEEE" }}>
        <div className="md:64">
          <Adminsidebar/>
        </div>
        {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (  
      <div className="max-w-[70rem] h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-1 mx-auto overflow-auto">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                  <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                        Users
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
                          <div className="flex items-center gap-x-2 ml-7">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Name
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2 ml-14">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              State
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-11 py-3 text-start">
                          <div className="flex items-center gap-x-2">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Mobile
                            </span>
                          </div>
                        </th>

                         <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2 ml-3">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              Created
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start">
                          <div className="flex items-center gap-x-2 ml-3">
                            <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                              View
                            </span>
                          </div>
                        </th>

                        <th scope="col" className="px-6 py-3 text-start ml-3">
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
                      {allusers.map((users, index) => (
                        <tr key={index}>
                          <td className="size-px whitespace-nowrap">
                            <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 ml-7">
                              <div className="flex items-center gap-x-3">
                                <img
                                  className="inline-block size-[38px] rounded-full"
                                  src={`${config.imagebaseurl}${users.profile_image}`}
                                  alt={users.full_name}
                                />
                                <div className="grow">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {users.full_name}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="h-px  whitespace-nowrap">
                            <div className="px-6 py-3 ml-12">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {users.state}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                          <div className="px-6 py-3 ml-3">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {users.mobile}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3 ml-3">
                              <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {formatDate(users.date_joined)}
                              </span>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3 ml-3">
                              <div className="flex items-center gap-x-3">
                                <a
                                  onClick={() => handleViewJobseeker(users.user_id)}
                                  className="text-sm text-blue-600 dark:text-neutral-500 cursor-pointer hover:text-blue-800"
                                >
                                  View
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="size-px whitespace-nowrap">
                            <div className="px-6 py-3 ml-3">
                              <span
                                onClick={() => handledeletemodal(users.user_id)}
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
                          {allusers.length}
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
                  Delete User
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Are you sure you want to Delete this User ?. This action
                    cannot be undone.
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={deleteuser}
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

export default Viewjobseeker;
