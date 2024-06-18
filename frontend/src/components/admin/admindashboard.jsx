import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function Admindashboard() {
    const token = Cookies.get("token");
    const [jobs,setJobs]=useState([])
    const [jobseeker,setJobseeker]=useState([])
    const [company,setCompany]=useState([])


    const headers = {
        Authorization: `Bearer ${token}`,
      };

    useEffect(()=>{
        MakeApiRequest(
            "get",
            `${config.baseUrl}adminn/getalljobs/`,
            headers,
            {},
            {}
          )
            .then((response) => {
                console.log("jobs",response)
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
  
    },[])

    useEffect(()=>{
        MakeApiRequest(
            "get",
            `${config.baseUrl}adminn/getallcompany/`,
            headers,
            {},
            {}
          )
            .then((response) => {
                console.log("company",response)
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
  
    },[])

    useEffect(()=>{
        MakeApiRequest(
            "get",
            `${config.baseUrl}adminn/getalljobseeker/`,
            headers,
            {},
            {}
          )
            .then((response) => {
                console.log("jobseeker",response)
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
  
    },[])


  return (
    <div>
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
            <div className="inline-flex justify-center items-center">
              <span className="size-2 inline-block bg-gray-500 rounded-full me-2"></span>
              <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                Company
              </span>
            </div>

            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                150
              </h3>
            </div>

            <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
              <dd className="text-start ps-3">
                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                  {" "}
                  5 last week
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
                25
              </h3>
            </div>

            <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
              <dd className="text-start ps-3">
                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                  {" "}
                  7 last week
                </span>
              </dd>
            </dl>
          </div>

          <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
            <div className="inline-flex justify-center items-center">
              <span className="size-2 inline-block bg-red-500 rounded-full me-2"></span>
              <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">
                Jobs
              </span>
            </div>

            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
                4
              </h3>
            </div>

            <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
              <dd className="text-start ps-3">
                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                  {" "}
                  7 last week
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
                4
              </h3>
            </div>

            <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
              <dd className="text-start ps-3">
                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                  {" "}
                  7 last week
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
                4
              </h3>
            </div>

            <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
              <dd className="text-start ps-3">
                <span className="block text-sm text-gray-500 dark:text-neutral-500">
                  {" "}
                  7 last week
                </span>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admindashboard;
