import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Admindashboard from "../../components/admin/admindashboard";
import Adminprofile from "../../components/admin/adminprofile";
import Viewcompanies from "../../components/admin/viewcompanies";
import Companyprofile from "../../components/admin/companyprofile";
import Viewjobseeker from "../../components/admin/viewjobseekers";
import Jobseekerprofile from "../../components/admin/jobseekerprofile";
import ViewJobs from "../../components/admin/viewjobs";
import Jobdetails from "../../components/admin/jobdetails";
import Editjobdetails from "../../components/admin/editjobdetails";
import { FaRegBell } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { FaUsersLine } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { IoNotifications } from "react-icons/io5";
import { RiTimelineView } from "react-icons/ri";


function Admin() {
  const [activeComponent, setActiveComponent] = useState("dashboard");
  const userdetails=JSON.parse(localStorage.getItem("user"))
  const [profile,setProfile]=useState("")
  const navigatee=useNavigate()
  const token = Cookies.get("token");



  const headers = {
      Authorization: `Bearer ${token}`,
  };
  

  const handleLogout = () => {
      Cookies.remove('token')
      localStorage.removeItem('user');
      navigatee('/login')
  };

  const updateUserProfile = (updatedProfile) => {
      setProfile(updatedProfile);
    };

    const fetchUserProfile = () => {
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
  } 


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

  const updateUserProfileImage = (newImage) => {
    setProfile(prevState => ({
        ...prevState,
        profile_image: newImage
    }));
  }  



  return (
    <>
      <div>
        <header
          className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 dark:bg-neutral-800 dark:border-neutral-700"
          style={{ backgroundColor: "#A91D3A" }}
        >
          <nav
            className="flex basis-full items-center w-full mx-auto px-4 sm:px-6"
            aria-label="Global"
          >
            <div className="me-5 lg:me-0">
              <a
                className="text-xl font-semibold text-white"
                href="#"
                aria-label="Brand"
              >
                JobPortal
              </a>
            </div>

            <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
              
              <div className="hidden sm:block"></div>

              <div className="flex flex-row items-center justify-end gap-2">
                <button
                  type="button"
                  className="group w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent hover:text-black hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <FaRegBell className="text-lg text-white group-hover:text-black" />
                </button>
                

                <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
                  <button
                    id="hs-dropdown-with-header"
                    type="button"
                    className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800  disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700"
                  >
                    <img
                      className="inline-block size-[38px] rounded-full"
                      src={`http://127.0.0.1:8000${profile.profile_image}`}
                    alt="Image Description"
                    />
                  </button>

                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-900 dark:border dark:border-neutral-700"
                    aria-labelledby="hs-dropdown-with-header"
                  >
                    <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-neutral-800">
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                        {userdetails.email}
                      </p>
                    </div>
                    <div className="mt-2 py-2 first:pt-0 last:pb-0">
                      <a
                        onClick={()=>{setActiveComponent('adminprofile')}}
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
                          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                        Profile
                      </a>

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
                        Log Out
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div style={{ backgroundColor: "#EEEEEE" }} className="sticky top-0 inset-x-0 z-20  border-y px-4 sm:px-6 md:px-8 lg:hidden dark:bg-neutral-800 dark:border-neutral-700">
          <div className="flex justify-between items-center py-2">
            <ol className="ms-3 flex items-center whitespace-nowrap"></ol>

            <button
              type="button"
              className="py-2 px-3 flex justify-center items-center gap-x-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:text-gray-600 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              data-hs-overlay="#application-sidebar"
              aria-controls="application-sidebar"
              aria-label="Sidebar"
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
                <path d="M17 8L21 12L17 16M3 12H13M3 6H13M3 18H13" />
              </svg>
              <span className="sr-only">Sidebar</span>
            </button>
          </div>
        </div>

        <div
          id="application-sidebar"
          className="hs-overlay [--auto-close:lg]
                hs-overlay-open:translate-x-0
                -translate-x-full transition-all duration-300 transhtmlForm
                w-[190px]
                hidden
                fixed inset-y-0 start-0 z-[60]
                top-[72px]
                bg-white
                lg:block lg:translate-x-0 lg:end-auto lg:bottom-0
                dark:bg-neutral-800 dark:border-neutral-700
              "

        >

          <nav
            className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
            data-hs-accordion-always-open
          >
            <ul className="space-y-1.5">
              <li>
                <a
                  onClick={()=>{setActiveComponent('dashboard')}}
                  className="w-full flex items-center gap-x-3.5 py-4 px-2.5 text-base font-semibold text-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  href="#"
                >
                  <IoHome />
                  Dashboard
                </a>
              </li>

              <li>
                <a
                  onClick={()=>{setActiveComponent('viewcompanies')}}
                  className="w-full flex items-center gap-x-3.5 py-4 px-2.5 text-base font-semibold text-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  href="#"
                >
                  <FaUsersLine />
                  Company
                </a>
              </li>

              <li>
                <a
                  onClick={()=>{setActiveComponent('viewjobseekers')}}
                  className="w-full flex items-center gap-x-3.5 py-4 px-2.5 text-base font-semibold text-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  href="#"
                >
                  <HiUsers />
                  Users
                </a>
              </li>
              <li>
                <a
                  onClick={()=>{setActiveComponent('viewjobs')}}
                  className="w-full flex items-center gap-x-3.5 py-4 px-2.5 text-base font-semibold text-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300"
                  href="#"
                >
                  <RiTimelineView />
                  Jobs
                </a>
              </li>
              <li>
                <a
                  className="w-full flex items-center gap-x-3.5 py-4 px-2.5 text-base font-semibold text-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-300"
                  href="#"
                >
                  <IoNotifications />
                  Notifications
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="w-full h-full lg:ps-44 " style={{ backgroundColor: "#EEEEEE" }}>
          {activeComponent === "dashboard" &&(
            <Admindashboard/>
          )}
          {activeComponent === "adminprofile" &&(
            <Adminprofile fetchUserProfile={fetchUserProfile} updateUserProfileImage={updateUserProfileImage} updateUserProfile={updateUserProfile}/>
          )}
          {activeComponent === "viewcompanies" &&(
            <Viewcompanies setActiveComponent={setActiveComponent}/>
          )}
          {activeComponent === "viewcompanyprofile" &&(
            <Companyprofile setActiveComponent={setActiveComponent}/>
          )}
          {activeComponent === "viewjobseekers" &&(
            <Viewjobseeker setActiveComponent={setActiveComponent}/>
          )}
          {activeComponent === "viewjobseekerprofile" &&(
            <Jobseekerprofile setActiveComponent={setActiveComponent}/>
          )}
          {activeComponent === "viewjobs" &&(
            <ViewJobs setActiveComponent={setActiveComponent}/>
          )}
          {activeComponent === "viewjobdetails" &&(
            <Jobdetails setActiveComponent={setActiveComponent}/>
          )}
          {activeComponent === "editjobdetails" &&(
            <Editjobdetails setActiveComponent={setActiveComponent}/>
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;
