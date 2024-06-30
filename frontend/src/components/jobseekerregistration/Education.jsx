import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";


function Education({ setActiveComponent }) {
  const { id } = useParams();
  const [experienceview, setExperienceview] = useState(true);
  const [file, setFile] = useState();
  const [educationdata, setEducationdata] = useState();
  const [educationinfo, setEducationInfo] = useState({
    user_id: id,
    course_name: "",
    from_date: "",
    to_date: "",
    organization_name: "",
  });

  const [errors, setErrors] = useState({
    course_name: "",
    from_date: "",
    to_date: "",
    organization_name: "",
    education_document: "",
  });


  function HandleExperienceDetails() {
    setActiveComponent("experience");
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setErrors((prevErrors) => ({
      ...prevErrors,
      education_document: file ? "" : "Education document is required.",
    }));
  };

  function HandlePesronalInfo(e) {
    const { name, value } = e.target;
    setEducationInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  }

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "course_name":
        if (!value.trim()) {
          errorMessage = "Course name is required.";
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
      case "organization_name":
        if (!value.trim()) {
          errorMessage = "Institution name is required.";
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
      course_name: "",
      from_date: "",
      to_date: "",
      organization_name: "",
      education_document: "",
    };

    if (!educationinfo.course_name.trim()) {
      newErrors.course_name = "Course name is required.";
      isValid = false;
    }
    if (!educationinfo.from_date.trim()) {
      newErrors.from_date = "From date is required.";
      isValid = false;
    }
    if (!educationinfo.to_date.trim()) {
      newErrors.to_date = "To date is required.";
      isValid = false;
    }
    if (!educationinfo.organization_name.trim()) {
      newErrors.organization_name = "Institution name is required.";
      isValid = false;
    }
    if (!file) {
      newErrors.education_document = "Education document is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      for (let key in educationinfo) {
        formData.append(key, educationinfo[key]);
      }
      formData.append("education_document", file);

      const params = {
        user_id: id,
      };

      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobseekereducation/`,
        {},
        params,
        formData
      )
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };


  return (
    <div>
        <>
          <div className=" text-center text-2xl font-bold">Education</div>
          <div className="flex justify-evenly max-sm:flex-col-reverse">
            
            <div className="flex flex-1 flex-col">
              <div className=" text-start pr-36 font-bold text-blue-800 ml-10">
                Add Education
              </div>
              <div>
                <label className="flex flex-col gap-1 text-xs pl-10">
                  Course
                  <input
                    type="text"
                    className="border border-gray-300 w-64 h-8 ml-2"
                    name="course_name"
                    value={educationinfo.course_name}
                    onChange={HandlePesronalInfo}
                    required
                  />
                  {errors.course_name && (
                    <span className="error-message text-red-700">
                      {errors.course_name}
                    </span>
                  )}
                </label>
                <label className="flex flex-col gap-1 text-xs pl-10 relative">
                  Institution Name
                  <input
                    type="text"
                    className="border border-gray-300 w-64 h-8 ml-2"
                    name="organization_name"
                    value={educationinfo.organization_name}
                    onChange={HandlePesronalInfo}
                    required
                  />
                  {errors.organization_name && (
                    <span className="error-message text-red-700">
                      {errors.organization_name}
                    </span>
                  )}
                </label>
                <div className="flex">
                  <label className="flex flex-col gap-1 text-xs pl-10">
                    From
                    <input
                      type="date"
                      className="border border-gray-300  w-32 h-8 ml-2"
                      name="from_date"
                      value={educationinfo.from_date}
                      onChange={HandlePesronalInfo}
                      required
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
                      className="border border-gray-300  w-32 h-8 ml-2"
                      name="to_date"
                      value={educationinfo.to_date}
                      onChange={HandlePesronalInfo}
                      required
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
                  className="education-choose-file mt-10 ml-5 sm:w-auto w-[300px]"
                  accept="image/jpeg, image/png"
                  name="education_document"
                  id="experience_education_document"
                  onChange={handleFileChange}
                  required
                />
                {errors.education_document && (
                  <span className="error-message text-red-700 block px-6 w-fit mt-1">
                    {errors.education_document}
                  </span>
                )}
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="mt-10  px-6 py-1 "
                >
                  Add Education
                </button>
              </div>
            </div>
          </div>

          <div
            className="continue-btn w-36 float-right px-5 py-2 mt-16 mr-36"
            onClick={HandleExperienceDetails}
          >
            Next <FontAwesomeIcon icon={faArrowRight} color="white" />
          </div>
        </>
    </div>
  );
}

export default Education;
