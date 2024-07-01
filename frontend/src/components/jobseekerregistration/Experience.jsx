import { faArrowRight, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

function Experience({ setActiveComponent }) {
  const [file, setFile] = useState();
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [experienceData, setExperienceData] = useState();
  const { id } = useParams();
  const [experienceinfo, setExperienceInfo] = useState({
    user_id: id,
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

  useEffect(() => {
    getexperience();
  }, []);

  const getexperience = () => {
    const params = { user_id: id };

    MakeApiRequest(
      "get",
      `${config.baseUrl}jobseeker/jobseekerexperience/`,
      {},
      params,
      {}
    )
      .then((response) => {
        setExperienceData(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      for (let key in experienceinfo) {
        formData.append(key, experienceinfo[key]);
      }
      formData.append("experience_document", file);
      const params = {
        user_id: id,
      };
      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobseekerexperience/`,
        {},
        params,
        formData
      )
        .then((response) => {
          console.log(response);
          setIsSubmitted(true);
          getexperience();
          setExperienceInfo({
            user_id: id,
            job_title: "",
            company_name: "",
            from_date: "",
            job_description: "",
            to_date: "",
          });
          setFile(null);
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

  const HandleSkillDetails = () => {
    if (isSubmitted) {
      setActiveComponent("skills");
    } else {
      setMessage("Provide Experience Details to Continue");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className=" text-center text-2xl font-bold mb-6">Experience</div>
        <div className="flex flex-col lg:flex-row justify-evenly">
          <div className="flex flex-1 flex-col p-1 lg:pr-8">
            <div className="text-start font-bold text-blue-800 mb-3">
              Add Experience
            </div>
            <div>
              <label className="flex flex-col gap-1 text-xs pl-10 mb-2">
                Job Position
                <input
                  type="text"
                  name="job_title"
                  value={experienceinfo.job_title}
                  onChange={HandlePesronalInfo}
                  required
                  className=" border border-gray-300 w-64 h-8 ml-2"
                />
                {errors.job_title && (
                  <span className="error-message text-red-700">
                    {errors.job_title}
                  </span>
                )}
              </label>
              <label className="flex flex-col gap-1 text-xs pl-10 relative mb-2">
                Organization Name
                <input
                  type="text"
                  name="company_name"
                  value={experienceinfo.company_name}
                  onChange={HandlePesronalInfo}
                  required
                  className="border border-gray-300 w-64 h-8 ml-2"
                />
                {errors.company_name && (
                  <span className="error-message text-red-700">
                    {errors.company_name}
                  </span>
                )}
              </label>
              <label className="flex flex-col flex-1 pl-10  gap-1 text-xs mb-2">
                Job Description
                <textarea
                  type="text"
                  name="job_description"
                  value={experienceinfo.job_description}
                  onChange={HandlePesronalInfo}
                  required
                  className="border border-gray-300 w-64 h-24 ml-2"
                />
                {errors.job_description && (
                  <span className="error-message text-red-700">
                    {errors.job_description}
                  </span>
                )}
              </label>
              <div className="flex">
                <label className="flex flex-col gap-1 text-xs  mb-2">
                  From
                  <input
                    type="date"
                    name="from_date"
                    value={experienceinfo.from_date}
                    onChange={HandlePesronalInfo}
                    required
                    className="border border-gray-300  w-34 h-8 ml-2"
                  />
                  {errors.from_date && (
                    <span className="error-message text-red-700">
                      {errors.from_date}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1 text-xs pl-10 mb-2">
                  To
                  <input
                    type="date"
                    name="to_date"
                    value={experienceinfo.to_date}
                    onChange={HandlePesronalInfo}
                    required
                    className="border border-gray-300 w-34 h-8 ml-2"
                  />
                  {errors.to_date && (
                    <span className="error-message text-red-700">
                      {errors.to_date}
                    </span>
                  )}
                </label>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                required
                className="education-choose-file mt-10 ml-5 sm:w-auto w-[300px]"
                accept=" image/jpeg, image/png"
                name=""
                id=""
              />
              {errors.experience_document && (
                <span className="error-message text-red-700 block px-6 w-fit mt-1">
                  {errors.experience_document}
                </span>
              )}
              <button
                onClick={handleSubmit}
                type="button"
                className="mt-6 flex px-6 py-2 text-white bg-slate-800 hover:bg-slate-900 items-center"
              >
                Add Experience <FaPlus className="text-white ml-1" />
              </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-1 lg:pl-8">
            <div className="text-start font-bold text-blue-800 mb-3">
              Experience History
            </div>
            {experienceData &&
              experienceData.map((experience, index) => (
                <div className=" text-left mb-4" key={index}>
                  <div className="text-lg font-semibold">
                    Job Position:{experience.job_title}
                  </div>
                  <div className=" text-sm">
                    Organization Name: {experience.company_name}
                  </div>
                  <div className="flex gap-3">
                    <div className=" text-xs">From: {experience.from_date}</div>
                    <div className=" text-xs">To: {experience.to_date}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          className="w-28  px-5 py-2 mt-5 text-white cursor-pointer mx-auto sm:mx-0"
          style={{ backgroundColor: "#A91D3A" }}
          onClick={HandleSkillDetails}
        >
          Next <FontAwesomeIcon icon={faArrowRight} color="white" />
        </div>
        {message && <div className="text-red-500 mt-4">{message}</div>}
      </div>
    </>
  );
}

export default Experience;
