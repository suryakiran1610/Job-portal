import { faArrowRight, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import JobseekerNavbar from "../../components/navbars/jobseekernavbar";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate, Link, useLocation } from "react-router-dom";


function Addexperience() {
  const [file, setFile] = useState();
  const [isloading, setIsloading] = useState(false);
  const navigate=useNavigate()
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [experienceinfo, setExperienceInfo] = useState({
    user_id:userdetails.id,
    job_title: "",
    company_name: "",
    from_date: "",
    job_description: "",
    to_date: "",
  });

  const [errors, setErrors] = useState({
    job_title: "",
    company_name: "",
    job_description: "",
    from_date: "",
    to_date: "",
    experience_document: "",
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      for (let key in experienceinfo) {
        formData.append(key, experienceinfo[key]);
      }
      formData.append("experience_document", file);
    
      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobseekerexperience/`,
        {},
        {},
        formData
      )
        .then((response) => {
          console.log(response);
          setExperienceInfo({
            user_id:experienceinfo.user_id,
            job_title: "",
            company_name: "",
            from_date: "",
            job_description: "",
            to_date: "",
          });
          setFile(null);
          navigate(`/jobseeker/jobseekerexperience`) 
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function HandlePesronalInfo(e) {
    const { name, value } = e.target;
    setExperienceInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  }


  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "job_title":
        if (!value.trim()) {
          errorMessage = "Job title is required.";
        }
        break;
      case "company_name":
        if (!value.trim()) {
          errorMessage = "Company name is required.";
        }
        break;
      case "job_description":
        if (!value.trim()) {
          errorMessage = "Job description is required.";
        }
        break;
      case "from_date":
        if (!value.trim()) {
          errorMessage = "From date is required.";
        }
        break;
      case "to_date":
        if (!value.trim()) {
          errorMessage = "To date is required.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      job_title: "",
      company_name: "",
      job_description: "",
      from_date: "",
      to_date: "",
      experience_document: "",
    };

    if (!experienceinfo.job_title || !experienceinfo.job_title.trim()) {
      newErrors.job_title = "Job title is required.";
      isValid = false;
    }
    if (!experienceinfo.company_name || !experienceinfo.company_name.trim()) {
      newErrors.company_name = "Company name is required.";
      isValid = false;
    }
    if (
      !experienceinfo.job_description ||
      !experienceinfo.job_description.trim()
    ) {
      newErrors.job_description = "Job description is required.";
      isValid = false;
    }
    if (!experienceinfo.from_date || !experienceinfo.from_date.trim()) {
      newErrors.from_date = "From date is required.";
      isValid = false;
    }
    if (!experienceinfo.to_date || !experienceinfo.to_date.trim()) {
      newErrors.to_date = "To date is required.";
      isValid = false;
    }
    if (!file) {
      newErrors.experience_document = "Experience document is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setErrors((prevErrors) => ({
      ...prevErrors,
      experience_document: file ? "" : "Experience document is required.",
    }));
  };


  return (
    <>
      <JobseekerNavbar />
      {isloading ? (
        <div className="h-screen flex justify-center items-center bg-gray-200">
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (
        <div className="bg-gray-200 min-h-screen flex flex-col items-center py-8 p-3">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center"> Add Experience</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Job Position
                </label>
                <input
                  type="text"
                  name="job_title"
                  value={experienceinfo.job_title}
                  onChange={HandlePesronalInfo}
                  className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 "
                />
                {errors.job_title && (
                  <p className="text-red-500 text-xs italic">
                    {errors.job_title}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Organization Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={experienceinfo.company_name}
                  onChange={HandlePesronalInfo}
                  className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.company_name && (
                  <p className="text-red-500 text-xs italic">
                    {errors.company_name}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                Job Description
                </label>
                <input
                  type="text"
                  name="job_description"
                  value={experienceinfo.job_description}
                  onChange={HandlePesronalInfo}
                  className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.job_description && (
                  <p className="text-red-500 text-xs italic">
                    {errors.job_description}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="from_date"
                    value={experienceinfo.from_date}
                    onChange={HandlePesronalInfo}
                    className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  {errors.from_date && (
                  <p className="text-red-500 text-xs italic">
                      {errors.from_date}
                    </p>
                  )}
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="to_date"
                    value={experienceinfo.to_date}
                    onChange={HandlePesronalInfo}
                    className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  {errors.to_date && (
                  <p className="text-red-500 text-xs italic">
                      {errors.to_date}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Experiene Document
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                 {errors.experience_document && (
                  <p className="text-red-500 text-xs italic">
                  {errors.experience_document}
                </p>
              )}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default Addexperience;
