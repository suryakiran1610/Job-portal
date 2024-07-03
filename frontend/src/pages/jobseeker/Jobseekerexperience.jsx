import React, { useContext, useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import JobseekerNavbar from "../../components/navbars/jobseekernavbar";
import BeatLoader from "react-spinners/BeatLoader";

function Jobseekerexperience() {
  const [isloading, setIsloading] = useState(false);
  const userdetails = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <JobseekerNavbar />
      {isloading ? (
        <div
          className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
          style={{ backgroundColor: "#EEEEEE" }}
        >
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (
        <div style={{ backgroundColor: "#EEEEEE" }}>
          <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto">
            <div class="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
              <div class="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800">

                  <div class="mb-8 mt-2">
                  <div className="flex justify-between">
                    <h2 class="text-xl font-bold text-gray-800 dark:text-neutral-200">
                      Experience
                    </h2>
                  </div>
                  <p class="text-sm text-gray-600 mt-2 dark:text-neutral-400">
                    Manage your Experience details here.
                  </p>
                </div>

                <form>
                  <div class="grid sm:grid-cols-12 gap-2 sm:gap-6">
                  <div class="sm:col-span-3">
                      <div class="inline-block">
                        <label
                          for="af-account-phone"
                          class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Job title
                        </label>
                      </div>
                    </div>
                    <div class="sm:col-span-9">
                      <input
                        type="text"
                        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div class="sm:col-span-3">
                      <div class="inline-block">
                        <label
                          for="af-account-phone"
                          class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Job Description
                        </label>
                      </div>
                    </div>
                    <div class="sm:col-span-9">
                      <input
                        type="text"
                        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div class="sm:col-span-3">
                      <div class="inline-block">
                        <label
                          for="af-account-phone"
                          class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Compay Name
                        </label>
                      </div>
                    </div>
                    <div class="sm:col-span-9">
                      <input
                        type="text"
                        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div class="sm:col-span-3">
                      <label class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        From
                      </label>
                    </div>

                    <div class="sm:col-span-9">
                      <input
                        type="date"
                        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div class="sm:col-span-3">
                      <label class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        To
                      </label>
                    </div>

                    <div class="sm:col-span-9">
                      <input
                        type="date"
                        class="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div class="sm:col-span-3">
                      <div class="inline-block">
                        <label
                          for="af-account-phone"
                          class="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Experience Doc
                        </label>
                      </div>
                    </div>
                    <div class="sm:col-span-9">
                      <div className="flex text-xs">
                      <a
                        // onClick={()=>{DownloadResume(applicants.resume)}}
                        className="hs-tooltip-toggle py-1.5 px-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-s-md bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                        href="#"
                      >
                        <svg
                          className="size-5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                      </a>
                      <input
                        type="file"
                        className="rounded-lg ml-4"
                      />
                      </div>
                      </div>
                  </div> 
                  <div class="mt-5 mb-2 flex justify-end gap-x-2">
                    <button
                      type="button"
                      class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Save changes
                    </button>
                  </div> 
                  </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Jobseekerexperience;
