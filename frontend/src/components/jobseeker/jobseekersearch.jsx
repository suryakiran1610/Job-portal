import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";

function Jobseekersearch({ setActiveComponent }) {
  const [buttonstatus, setButtonstatus] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [limit, setLimit] = useState(6);
  const [jobs, setJobs] = useState([]);
  const token = Cookies.get("token");
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [allsavedjobs, setAllsavedjobs] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const viewjobdetails = (jobId) => {
    localStorage.setItem("viewedJobId", jobId);
    setActiveComponent("viewjobdetails");
  };

  useEffect(() => {
    loadJobs();
  }, [limit, startIndex]);

  const loadJobs = () => {
    const params = {
      limit: limit,
      user_id: userdetails.id,
      startIndex: startIndex,
      keywords: keywords,
      location: location,
    };

    MakeApiRequest(
      "get",
      `${config.baseUrl}jobseeker/getalljobs/`,
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

  const handleLoadMore = () => {
    setStartIndex(startIndex + limit);
  };

  const handleLoadPrevious = () => {
    setStartIndex(Math.max(0, startIndex - limit));
  };

  const splitDescriptionIntoListItems = (description) => {
    const words = description.trim().split(/\s+/);
    return words.slice(0, 12).join(" ");
  };

  const calculateDaysSincePosted = (postedDate) => {
    const currentDate = new Date();
    const postedDateObj = new Date(postedDate);
    const diffTime = Math.abs(currentDate - postedDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setStartIndex(0);
    loadJobs();
  };

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

  const isJobSaved = (jobId) => {
    return allsavedjobs.some((savedJob) => Number(savedJob.jobid) === jobId);
  };

  // Updated code within the component
  const isSaved = jobs.map((job) => isJobSaved(job.id));

  return (
    <>
      <div className="flex items-center justify-center p-0">
        <form className="bg-white shadow-xl flex w-full max-w-3xl border mt-5 h-16 rounded-xl overflow-hidden items-center">
          <div className="relative flex-1 ml-1 h-full p-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch />
            </span>
            <input
              onChange={(e) => setKeywords(e.target.value)}
              type="text"
              placeholder="Job title, keywords, or company"
              className="w-full h-full px-4 py-2 pl-12 text-sm text-gray-900 border-none rounded-l-lg focus:outline-none"
            />
          </div>

          <div className="h-12 border-l"></div>

          <div className="relative flex-1 h-full p-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FaLocationDot />
            </span>
            <input
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              placeholder="City or state"
              className="w-full h-full px-4 py-2 pl-10 text-sm text-gray-900 border-none rounded-r-lg focus:outline-none"
            />
          </div>
          <div className="p-3 items-center">
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
            >
              Find jobs
            </button>
          </div>
        </form>
      </div>
      <div className="w-full min-h-screen  sm:px-6 lg:px-8 lg:py-7 mx-auto">
        <div className="flex flex-wrap justify-center mt-6 gap-4">
          {jobs.map((job, index) => (
            <div key={index} className="max-w-xs w-full sm:w-1/2 lg:w-1/3 p-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow p-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-end">
                  {isSaved[index] && <FaBookmark />}
                </div>
                <h1
                  onClick={() => {
                    viewjobdetails(job.id);
                  }}
                  className="text-xl font-bold cursor-pointer hover:underline"
                >
                  {job.jobtitle}
                </h1>
                <p className="text-gray-600">{job.companyname}</p>
                <p className="text-gray-600">{job.joblocation}</p>
                <ul className="list-disc list-inside mt-2 text-gray-800">
                  <li>{splitDescriptionIntoListItems(job.jobdescription)}.</li>
                </ul>
                <p className="text-gray-500 mt-4">
                  Posted {calculateDaysSincePosted(job.jobposteddate)} days ago
                </p>
              </div>
            </div>
          ))}
        </div>

        <nav className="flex items-center justify-center mt-4">
          <div className="inline-flex gap-x-2 md:p-0 p-20">
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
        </nav>
      </div>
    </>
  );
}

export default Jobseekersearch;
