import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Adminsidebar from "../../components/navbars/Adminsidebar";
import AdminNav from "../../components/navbars/Adminnav";
import BeatLoader from "react-spinners/BeatLoader";

function Admindashboard() {
  const token = Cookies.get("token");
  const [jobs, setJobs] = useState({ jobs: 0, recent_jobs_count: 0 });
  const [jobseeker, setJobseeker] = useState({
    jobseeker: 0,
    recent_jobseeker_count: 0,
  });
  const [company, setCompany] = useState({
    companycount: 0,
    recent_company_count: 0,
  });
  const [notifications, setNotifications] = useState({
    notification: [],
    unreadnotificationcount: 0,
  });
  const [isloading, setIsloading] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    setIsloading(true);
    const fetchJobs = MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getalljobs/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("jobs", response);
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

    const fetchCompanies = MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getallcompany/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("company", response);
        setCompany(response);
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

    const fetchJobseekers = MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getalljobseeker/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("jobseeker", response);
        setJobseeker(response);
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

    const fetchNotifications = MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getallnotification/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("notification", response);
        setNotifications(response);
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
    Promise.all([
      fetchJobs,
      fetchCompanies,
      fetchJobseekers,
      fetchNotifications,
    ])
      .then(() => setIsloading(false))
      .catch(() => setIsloading(false));
  }, []);

  return (
    <div>
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
          <div className="w-11/12 min-h-screen mt-7 sm:px-6 lg:px-8 lg:py-7 mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                <div className="inline-flex justify-center items-center">
                  <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                  <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                    Company
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                    {company.companycount}
                  </h3>
                </div>

                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                  <dd className="text-start ps-3">
                    <span className="block text-sm text-gray-500 dark:text-neutral-500">
                      {company.recent_company_count} last week
                    </span>
                  </dd>
                </dl>
              </div>

              <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                <div className="inline-flex justify-center items-center">
                  <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                  <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                    Users
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                    {jobseeker.jobseeker}
                  </h3>
                </div>

                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                  <dd className="text-start ps-3">
                    <span className="block text-sm text-gray-500 dark:text-neutral-500">
                      {jobseeker.recent_jobseeker_count} last week
                    </span>
                  </dd>
                </dl>
              </div>

              <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                <div className="inline-flex justify-center items-center">
                  <span className="size-2 inline-block bg-green-500 rounded-full me-2"></span>
                  <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                    Jobs
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                    {jobs.jobs}
                  </h3>
                </div>

                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                  <dd className="text-start ps-3">
                    <span className="block text-sm text-gray-500 dark:text-neutral-500">
                      {jobs.recent_jobs_count} last week
                    </span>
                  </dd>
                </dl>
              </div>
              <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                <div className="inline-flex justify-center items-center">
                  <span className="size-2 inline-block bg-red-500 rounded-full me-2"></span>
                  <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                    Notifications
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                    {notifications.notification.length}
                  </h3>
                </div>

                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                  <dd className="text-start ps-3">
                    <span className="block text-sm text-gray-500 dark:text-neutral-500">
                      {" "}
                      {notifications.unreadnotificationcount} Unread
                      Notification
                    </span>
                  </dd>
                </dl>
              </div>
              <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
                <div className="inline-flex justify-center items-center">
                  <span className="size-2 inline-block bg-red-500 rounded-full me-2"></span>
                  <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                    Company Approval
                  </span>
                </div>

                <div className="text-center">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                    {company.notactivatedcompanies}
                  </h3>
                </div>

                <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
                  <dd className="text-start ps-3">
                    <span className="block text-sm text-gray-500 dark:text-neutral-500">
                      {" "}
                      {company.notactivatedcompanies} for Approval
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admindashboard;
