import Postjob from "../../components/company/postjob";
import Myjobs from "../../components/company/myjobs";
import Viewjob from "../../components/company/viewjob";
import Editjobs from "../../components/company/editjobs";
import Profile from "../../components/company/profile";
import { Routes, Route } from "react-router-dom";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";




function Employer() {
    const [activeComponent, setActiveComponent] = useState("myjobs");
    const userdetails=JSON.parse(localStorage.getItem("user"))
    const [profile,setProfile]=useState("")
    const navigatee=useNavigate()
    const token = Cookies.get("token");
    const [profileImageURL, setProfileImageURL] = useState("");


    const headers = {
      Authorization: `Bearer ${token}`,
    };
  

    const handleLogout = () => {
      Cookies.remove('token')
      localStorage.removeItem('user');
      navigatee('/login')
    };

    useEffect(() => {
      const params = {
          userid: userdetails.id,
      };

      MakeApiRequest(
      "get",
      `${config.baseUrl}company/users/`,
      headers,
      params,
      {}
      )
      .then((response) => {
          console.log("profile", response);
          setProfile(response);
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



  return (
    <>
      <div>
        <header
          className="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full  border-b border-gray-700 text-sm py-2.5 sm:py-4 dark:bg-neutral-950 dark:border-neutral-700"
          style={{ backgroundColor: "#A91D3A" }}
        >
          <nav
            className="max-w-7xl flex basis-full items-center w-full mx-auto px-4 sm:px-6 lg:px-8"
            aria-label="Global"
          >
            <div className="me-5 md:me-8 flex">
              <a
                className="flex-none text-xl font-semibold text-white"
                href="#"
                aria-label="Brand"
              >
                Job Portal
              </a>
            </div>

            <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
              <div className="sm:hidden">
                <button
                  type="button"
                  className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
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
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </div>

              <div className="hidden mx-auto sm:block">
                <label htmlFor="icon" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                    <svg
                      className="flex-shrink-0 size-4 text-white dark:text-neutral-500"
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
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    className="py-2 px-4 ps-11 pe-20 block w-92 md:w-96 bg-transparent border-white shadow-sm rounded-lg text-sm text-white focus:z-10 focus:border-gray-900 focus:ring-white placeholder:text-white dark:border-neutral-700 dark:text-neutral-500 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="Search"
                  />
                  <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4">
                    <span className="text-gray-500 dark:text-neutral-500"></span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-end gap-2">
                <button
                  type="button"
                  className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
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
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                </button>

                <div
                  className="hs-dropdown relative inline-flex"
                  data-hs-dropdown-placement="bottom-right"
                >
                  <button
                    id="hs-dropdown-with-header"
                    type="button"
                    className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-white hover:bg-white/20 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-gray-600"
                  >
                    <img
                      className="inline-block size-[38px] rounded-full"
                      src={`http://127.0.0.1:8000${profile.profile_image}`}
                      alt="Image Description"
                    />
                  </button>

                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 z-10 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                    aria-labelledby="hs-dropdown-with-header"
                  >
                    <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-neutral-700">
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                        {userdetails.email}
                      </p>
                    </div>
                    <div className="mt-2 py-2 first:pt-0 last:pb-0">
                      <a
                        onClick={handleLogout}
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                        href="#"
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
                          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                          <path d="M12 12v9" />
                          <path d="m8 17 4 4 4-4" />
                        </svg>
                        Logout
                      </a>
                      <a
                        onClick={()=>{setActiveComponent('profile')}}
                        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                        href="#"
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
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main id="content">
          <nav
            className="sticky -top-px bg-white text-sm font-medium text-black ring-1 ring-gray-900 ring-opacity-5 border-t shadow-sm shadow-gray-100 pt-6 md:pb-6 -mt-px dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-neutral-700/70"
            aria-label="Jump links"
          >
            <div className="max-w-7xl snap-x w-full flex items-center overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 md:pb-0 mx-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900">
              <div className="snap-center shrink-0 pe-5 sm:pe-8 sm:last-pe-0">
                <a
                  className="inline-flex items-center gap-x-2 hover:text-gray-500 dark:text-neutral-400 dark:hover:text-neutral-500"
                  href="#"
                >
                  Home
                </a>
              </div>
              <div className="snap-center shrink-0 pe-5 sm:pe-8 sm:last:pe-0">
                <a
                    onClick={()=>{setActiveComponent('postjob')}}
                  className="inline-flex items-center gap-x-2 hover:text-gray-500 dark:text-neutral-400 dark:hover:text-neutral-500"
                  href="#"
                >
                  Post Jobs
                </a>
              </div>
              <div className="snap-center shrink-0 pe-5 sm:pe-8 sm:last:pe-0">
                <a
                  onClick={()=>{setActiveComponent('myjobs')}}
                  className="inline-flex items-center gap-x-2 hover:text-gray-500 dark:text-neutral-400 dark:hover:text-neutral-500"
                  href="#"
                >
                  My Job
                </a>
              </div>
            </div>
          </nav>
        </main>
      </div>
      <div className="h-full" style={{ backgroundColor: "#EEEEEE" }}>
      {activeComponent === "postjob" &&(
        <Postjob/>
      )}
      {activeComponent === "myjobs" &&(
        <Myjobs setActiveComponent={setActiveComponent}/>
      )}
      {activeComponent === "viewjob"&&(
        <Viewjob setActiveComponent={setActiveComponent}/>
      )}
      {activeComponent === "editjob"&&(
        <Editjobs setActiveComponent={setActiveComponent}/>
      )}
      {activeComponent === "profile" &&(
        <Profile profileImageURL={profileImageURL}
        setProfileImageURL={setProfileImageURL}/>
      )}
      </div>
    </>
  );
}

export default Employer;
