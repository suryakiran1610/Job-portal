import React, { useContext, useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import JobseekerNavbar from "../../components/navbars/jobseekernavbar";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate, Link, useLocation } from "react-router-dom";


function Jobseekerexperience() {

  const [isloading, setIsloading] = useState(false);
  const token = Cookies.get("token");
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const navigate=useNavigate()
  const [experience, setExperience] = useState([]);
  const [initialexperiencedetails, setInitialexperiencedetails] = useState({});
  const [togglemodal, setTogglemodal] = useState(false);
  const [experienceid, setExperienceid] = useState("");
  const [message, setMessage] = useState("");
  const [editedExperience, setEditedExperience] = useState({});


  const AddExperience=()=>{
    navigate(`/jobseeker/addexperience`) 
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const params = {
      user_id: userdetails.id,
    };
    setIsloading(true);
    MakeApiRequest(
      "get",
      `${config.baseUrl}jobseeker/jobseekerexperienceview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("Experience", response);
        setExperience(response);
        setInitialexperiencedetails(response);
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
  }, []);

  const DownloadResume = (resumeUrl) => {
    const doc = `${config.imagebaseurl}${resumeUrl}`;
    saveAs(doc, resumeUrl);
  };

  function Handleexperiencedetails(e, index) {
    const { name, value, type, files } = e.target;

    setEditedExperience((prevState) => {
      const newState = { ...prevState };
      if (!newState[index]) {
        newState[index] = {};
      }

      if (type === "file") {
        newState[index][name] = files[0];
      } else {
        newState[index][name] = value;
      }

      return newState;
    });
  }

  const handleSubmit = (e, id, index) => {
    e.preventDefault();

    const currentExperience = editedExperience[index] || {};
    const initialExperience = initialexperiencedetails.find(
      (edu) => edu.id === id
    );

    const isExperienceChanged = Object.keys(currentExperience).some(
      (key) => currentExperience[key] !== initialExperience[key]
    );

    if (!isExperienceChanged) {
      setMessage("No changes detected");
      return;
    }

    const params = {
      experience_id: id,
    };

    const formData = new FormData();
    for (let key in currentExperience) {
      if (currentExperience[key]) {
        if (key === "experience_document") {
          if (currentExperience[key] instanceof File) {
            formData.append(key, currentExperience[key]);
          }
        } else {
          formData.append(key, currentExperience[key]);
        }
      }
    }
    MakeApiRequest(
      "put",
      `${config.baseUrl}jobseeker/jobseekerexperienceview/`,
      headers,
      params,
      formData
    )
      .then((response) => {
        console.log(response);
        setMessage("Experience Updated successfully");
        setEditedExperience((prevState) => ({
          ...prevState,
          [index]: {},
        }));
        setTimeout(() => {
          setMessage("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access. Token might be expired or invalid.");
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  };


  const handledeletemodal = (ExperienceId) => {
    setExperienceid(ExperienceId);
    setTogglemodal(true);
  };

  const handleDeleteExperience = () => {
    const params = {
        experience_id: experienceid,
      };
  
      MakeApiRequest(
        "delete",
        `${config.baseUrl}jobseeker/jobseekerexperienceview/`,
        headers,
        params,
        {}
      )
        .then((response) => {
          console.log(response);
          setExperience(experience.filter((exp) => exp.id !== experienceid));
          setTogglemodal(false);
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
            <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
              <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800">
                <div className="mb-1 mt-1">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                      Experience
                    </h2>
                    <button className="px-2 py-1 bg-gray-800 text-white hover:bg-gray-900 rounded-md"
                        onClick={AddExperience}
                        type="button"
                    >
                      Add Experience
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 dark:text-neutral-400">
                    Manage your Experience details here.
                  </p>
                </div>

                {experience.map((exp, index) => (
                  <form key={exp.id}  onSubmit={(e) => handleSubmit(e, exp.id,index)} encType="multipart/form-data">
                    <div className="flex justify-between">
                        <p className="mt-5 mb-5">Experience {index+1}</p>
                        <button className="bg-red-600 text-white hover:bg-red-900 rounded-md w-14 h-7"
                            onClick={() => handledeletemodal(exp.id)}
                            type="button"
                        >
                            Delete
                        </button>
                    </div>
                    <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                      <div className="sm:col-span-3">
                        <div className="inline-block">
                          <label
                            htmlFor="af-account-phone"
                            className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                          >
                            Job title
                          </label>
                        </div>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          defaultValue={exp.job_title}
                          name="job_title"
                          onChange={(e) => Handleexperiencedetails(e, index)}
                          className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <div className="inline-block">
                          <label
                            htmlFor="af-account-phone"
                            className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                          >
                            Job Description
                          </label>
                        </div>
                      </div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          defaultValue={exp.job_description}
                          name="job_description"
                          onChange={(e) => Handleexperiencedetails(e, index)}
                          className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                      </div>
                      <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Compay Name
                        </label>
                      </div>
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        type="text"
                        defaultValue={exp.company_name}
                        name="company_name"
                        onChange={(e) => Handleexperiencedetails(e, index)}
                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                      <div className="sm:col-span-3">
                        <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                          From
                        </label>
                      </div>

                      <div className="sm:col-span-9">
                        <input
                            defaultValue={exp.from_date}
                            name="from_date"
                            onChange={(e) => Handleexperiencedetails(e, index)}
                            type="date"
                            className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                          To
                        </label>
                      </div>

                      <div className="sm:col-span-9">
                        <input
                            defaultValue={exp.to_date}
                            name="to_date"
                            onChange={(e) => Handleexperiencedetails(e, index)}
                            type="date"
                            className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <div className="inline-block">
                          <label
                            htmlFor="af-account-phone"
                            className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                          >
                            Experience Doc
                          </label>
                        </div>
                      </div>
                      <div className="sm:col-span-9">
                        <div className="flex text-xs">
                          <a
                            onClick={()=>{DownloadResume(exp.experience_document)}}
                            className="hs-tooltip-toggle cursor-pointer py-1.5 px-2 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-s-md bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
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
                          <input type="file" 
                          className="rounded-lg ml-4"
                          name="experience_document"
                          onChange={(e) => Handleexperiencedetails(e, index)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 mb-2 flex justify-end gap-x-2">
                      <button
                        type="submit"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Save changes
                      </button>
                    </div>
                    <hr className="mt-5 mb-5"></hr>
                  </form>
                ))}
                {message &&
                  (message === "No changes detected" ? (
                    <div
                      className="mt-2 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                      role="alert"
                    >
                      <span className="font-bold">Warning:</span> No changes
                      detected. You should check in on some of those fields.
                    </div>
                  ) : (
                    <div
                      className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                      role="alert"
                    >
                      <span className="font-bold">Success:</span> Experience
                      updated successfully.
                    </div>
                  ))}
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
                Delete Experience
              </h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Are you sure you want to delete this Experience? All of the data will
                  be permanently removed. This action cannot be undone.
                </p>
              </div>

              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={handleDeleteExperience}
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
        </div>
      )}
    </>
  );
}
export default Jobseekerexperience;
