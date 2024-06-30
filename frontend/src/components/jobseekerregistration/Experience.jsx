import { faArrowRight, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { useParams } from "react-router-dom";


function Experience({ setActiveComponent }) {
  const user_id = Cookies.get("user_id");
  const access_token = Cookies.get("access_token");
  const [file, setFile] = useState();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [companyListdata, setCompanyListdata] = useState();
  const [experienceData, setExperienceData] = useState();
  const { id } = useParams();
  const [experienceinfo, setExperienceInfo] = useState({
    user_id:id,
    job_title: "",
    company_name: "",
    from_date: "",
    job_description:"",
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
            console.log(response)
        //   MakeApiRequest(
        //     "get",
        //     `${config.baseUrl}employee/employee/experience/?id=${user_id}`,
        //     headers
        //   )
        //     .then((response) => {
        //       console.log(response);
        //       setExperienceData(response);
        //       setExperienceInfo({
        //         user_id: user_id,
        //         job_title: "",
        //         company_name: "",
        //         job_description: "",
        //         from_date: "",
        //         to_date: "",
        //         experience_document: null,
        //       });
        //       setInputValue("");
        //       setFile(null);
        //       document.getElementById("experience_document").value = "";
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

//   useEffect(() => {
//     MakeApiRequest(
//       "get",
//       `${config.baseUrl}employee/employee/experience/?id=${user_id}`,
//       headers
//     )
//       .then((response) => {
//         console.log(response);
//         setExperienceData(response);
//       })
//       .catch((error) => {
//         // Handle any errors
//         console.log(error);
//       });
//     MakeApiRequest("get", `${config.baseUrl}company/companies/`, headers)
//       .then((response) => {
//         console.log(response);
//         setCompanyListdata(response);
//       })
//       .catch((error) => {
//         // Handle any errors
//         console.log(error);
//       });
//   }, []);

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

  function HandleSkillDetails() {
    setActiveComponent("skills");
  }
  
  return (
    <>
        <div>
          <div className=" text-center text-2xl font-bold">Experience</div>
          <div className="flex justify-evenly max-sm:flex-col-reverse ">
            <div className="flex flex-col border-r-2 flex-1 items-center max-sm:items-start max-sm:pl-16">
              {/* {experienceData &&
                experienceData.map((experience, index) => (
                  <div className=" text-left">
                    <div className=" mt-5">{experience.job_title}</div>
                    <div className=" text-sm">{experience.company_name}</div>
                    <div className="flex gap-3">
                      <div className=" text-xs">{experience.from_date}</div>
                      <div className=" text-xs">{experience.to_date}</div>
                    </div>
                  </div>
                ))} */}
              {
              /* <div className=' text-left'>
                                <div className=' mt-5'>Job Position</div>
                                <div className=' text-sm'>Organization Name</div>
                                <div className='flex gap-3'>
                                    <div className=' text-xs'>From:</div>
                                    <div className=' text-xs'>To:</div>
                                </div>
                            </div>
                            <div className=' text-left'>
                                <div className=' mt-5'>Job Position</div>
                                <div className=' text-sm'>Organization Name</div>
                                <div className='flex gap-3'>
                                    <div className=' text-xs'>From:</div>
                                    <div className=' text-xs'>To:</div>
                                </div>
                            </div> */}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className=" text-start pr-36 font-bold text-blue-800 ml-10">
                Add Experience
              </div>
              <div>
                <label className="flex flex-col gap-1 text-xs pl-10">
                  Job Position
                  <input
                    type="text"
                    name="job_title"
                    value={experienceinfo.job_title}
                    onChange={HandlePesronalInfo}
                    required
                    className="signup-input border border-black-950 w-64 h-8 ml-2"
                  />
                  {errors.job_title && (
                    <span className="error-message text-red-700">
                      {errors.job_title}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1 text-xs pl-10 relative">
                  Organization Name
                  <input
                    type="text"
                    name="company_name"
                    value={experienceinfo.company_name}
                    onChange={HandlePesronalInfo}
                    required
                    className="signup-input border border-black-950 w-64 h-8 ml-2"
                  />
                  {errors.company_name && (
                    <span className="error-message text-red-700">
                      {errors.company_name}
                    </span>
                  )}
                </label>
                <label className="flex flex-col flex-1 pl-10  gap-1 text-xs ">
                  Job Description
                  <textarea
                    type="text"
                    name="job_description"
                    value={experienceinfo.job_description}
                    onChange={HandlePesronalInfo}
                    required
                    className="signup-input border border-black-950 w-64 h-24 ml-2"
                  />
                  {errors.job_description && (
                    <span className="error-message text-red-700">
                      {errors.job_description}
                    </span>
                  )}
                </label>
                <div className="flex">
                  <label className="flex flex-col gap-1 text-xs pl-10">
                    From
                    <input
                      type="date"
                      name="from_date"
                      value={experienceinfo.from_date}
                      onChange={HandlePesronalInfo}
                      required
                      className="signup-input border border-black-950  w-32 h-8 ml-2"
                    />
                    {errors.from_date && (
                      <span className="error-message text-red-700">
                        {errors.from_date}
                      </span>
                    )}
                  </label>
                  <label className="flex flex-col gap-1 text-xs pl-10">
                    To
                    <input
                      type="date"
                      name="to_date"
                      value={experienceinfo.to_date}
                      onChange={HandlePesronalInfo}
                      required
                      className="signup-input border border-black-950  w-32 h-8 ml-2"
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
                  className="add-education-btn float-right mt-10 sm:mr-64 px-6 py-1 mr-36"
                >
                  <FontAwesomeIcon
                    icon={faCirclePlus}
                    style={{ color: "#ffffff" }}
                  />{" "}
                  Add Experience
                </button>
              </div>
            </div>
          </div>
          <div
            className="continue-btn w-36 float-right px-5 py-2 mt-16 mr-36"
            onClick={HandleSkillDetails}
          >
            Continue <FontAwesomeIcon icon={faArrowRight} color="white" />
          </div>
        </div>

    </>
  );
}

export default Experience;
