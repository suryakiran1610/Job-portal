import React, { useContext, useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import CompanyNavbar from "../../components/navbars/companynavbar";
import ProfileContext from "../../context/ProfileContext";
import BeatLoader from "react-spinners/BeatLoader";
import Select from "react-select";
import { saveAs } from "file-saver";
import Skills from "../../components/jobseekerregistration/Skills";
import { useParams } from "react-router-dom";


function UserProfile() {
  const [profile, setProfile] =useState("")
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [skill, setSkill] = useState([]);
  const [initialskills, setInitialskills] = useState([]);
  const { id } = useParams();
  const token = Cookies.get("token");
  const [isloading, setIsloading] = useState(false);
  const [users, setUsers] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };


  useEffect(() => {
    const params = {
      user_id:id,
    };
    setIsloading(true);
    MakeApiRequest(
      "get",
      `${config.baseUrl}jobseeker/jobseekerprofileview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("profile", response);
        setProfile(response);
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

    MakeApiRequest(
      "get",
      `${config.baseUrl}jobseeker/jobseekerskillsview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("skills", response);
        setSkill(response);
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
  }, []);

  const skillsString = skill.map((s) => s.name).join(", ");


  const DownloadResume = (resumeUrl) => {
    const doc = `${config.imagebaseurl}${resumeUrl}`;
    saveAs(doc, resumeUrl);
  };

  
  
  return (
    <>
      <CompanyNavbar/>
      {isloading ? (
        <div
          className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
          style={{ backgroundColor: "#EEEEEE" }}
        >
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : !profile ? (
        <div
          className="h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
          style={{ backgroundColor: "#EEEEEE" }}
        >
          <h1 className="text-red-700">Profile Deleted...</h1>
        </div>
      ) : (
        <div style={{ backgroundColor: "#EEEEEE" }}>
          <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto">
            <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
              <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800">
                <div className="mb-8">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                      Jobseeker Profile
                    </h2>
                  </div>
                </div>

                <form>
                  <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                    <div className="sm:col-span-3">
                      <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        Profile photo
                      </label>
                    </div>

                    <div className="sm:col-span-9">
                      <div className="flex items-center gap-5 text-xs">
                        <img
                          className="inline-block size-16 rounded-full ring-2 ring-white dark:ring-neutral-900"
                          src={`${config.imagebaseurl}${profile.profile_image}`}
                          alt={profile.companyname}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="af-account-full-name"
                        className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                      >
                        Full name
                      </label>
                      <div className="hs-tooltip inline-block"></div>
                    </div>

                    <div className="sm:col-span-9">
                      <div className="sm:flex">
                        <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                            {profile.full_name}
                        </p>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        DOB
                      </label>
                    </div>

                    <div className="sm:col-span-9">
                      <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                          {profile.dob}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        Address 1
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                          {profile.address_line1}
                      </p>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        Address 2
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                          {profile.address_line2}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Phone
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-9">
                      <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                          {profile.mobile}
                      </p>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          City
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-9">
                    <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                          {profile.city}
                      </p>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          State
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-9">
                      <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                          {profile.state}
                      </p>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Pincode
                        </label>
                      </div>
                    </div>
                    <div className="sm:col-span-9">
                      <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                          {profile.pin_code}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Job Category
                        </label>
                      </div>
                    </div>
                    <div className="sm:col-span-9">
                      <p className="py-2 px-3 pe-11 block w-full -mt-px -ms-px  sm:mt-0 sm:first:ms-0   text-sm relative">
                          {profile.job_category_name}
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Resume
                        </label>
                      </div>
                    </div>
                    <div className="sm:col-span-9">
                      <div className="flex text-xs">
                        <a
                          onClick={() => {
                            DownloadResume(profile.resume);
                          }}
                          className="hs-tooltip-toggle py-1.5 px-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-s-md bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 cursor-pointer"
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
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Skills
                        </label>
                      </div>
                    </div>
                    <div className="sm:col-span-9">
                      <p>{skillsString}</p>
                    </div>
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

export default UserProfile;
