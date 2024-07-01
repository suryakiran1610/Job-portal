import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { FaPlus } from "react-icons/fa";
import { useParams } from "react-router-dom";

function Education({ setActiveComponent }) {
  const { id } = useParams();
  const [file, setFile] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [educationdata, setEducationdata] = useState([]);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    geteducation();
  }, []);

  const geteducation = () => {
    const params = { user_id: id };

    MakeApiRequest(
      "get",
      `${config.baseUrl}jobseeker/jobseekereducation/`,
      {},
      params,
      {}
    )
      .then((response) => {
        setEducationdata(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setErrors((prevErrors) => ({
      ...prevErrors,
      education_document: file ? "" : "Education document is required.",
    }));
  };

  const HandlePesronalInfo = (e) => {
    const { name, value } = e.target;
    setEducationInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  };

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
      formData.append("user_id", id);
      for (let key in educationinfo) {
        formData.append(key, educationinfo[key]);
      }
      formData.append("education_document", file);

      const params = { user_id: id };

      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobseekereducation/`,
        {},
        params,
        formData
      )
        .then((response) => {
          console.log(response);
          setIsSubmitted(true);
          geteducation(); 
          setEducationInfo({
            user_id: id,
            course_name: "",
            from_date: "",
            to_date: "",
            organization_name: "",
          });
          setFile(null);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const HandleExperienceDetails = () => {
    if (isSubmitted) {
      setActiveComponent("experience");
    } else {
      setMessage("Provide Education Details to Continue");
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="text-center text-2xl font-bold mb-6">Education</div>
      <div className="flex flex-col lg:flex-row justify-evenly">
        <div className="flex flex-1 flex-col p-1 lg:pr-8">
          <div className="text-start font-bold text-blue-800 mb-3">
            Add Education
          </div>
          <div>
            <label className="flex flex-col gap-1 text-xs mb-3">
              Course
              <input
                type="text"
                className="border border-gray-300 w-full sm:w-64 h-8"
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
            <label className="flex flex-col gap-1 text-xs mb-3">
              Institution Name
              <input
                type="text"
                className="border border-gray-300 w-full sm:w-64 h-8"
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
            <div className="flex flex-col sm:flex-row">
              <label className="flex flex-col gap-1 text-xs mb-3 sm:mr-4">
                From
                <input
                  type="date"
                  className="border border-gray-300 w-full sm:w-34 h-8"
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
              <label className="flex flex-col gap-1 text-xs mb-3">
                To
                <input
                  type="date"
                  className="border border-gray-300 w-full sm:w-34 h-8"
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
              className="mt-4"
              accept="image/jpeg, image/png"
              name="education_document"
              id="experience_education_document"
              onChange={handleFileChange}
              required
            />
            {errors.education_document && (
              <span className="error-message text-red-700 block text-xs mt-1">
                {errors.education_document}
              </span>
            )}
            <button
              onClick={handleSubmit}
              type="button"
              className="mt-6 flex px-6 py-2 text-white bg-slate-800 hover:bg-slate-900 items-center"
            >
              Add Education <FaPlus className="text-white ml-1" />
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-1 lg:pl-8">
          <div className="text-start font-bold text-blue-800 mb-3">
            Education History
          </div>
          {educationdata &&
            educationdata.map((education, index) => (
              <div className="text-left mb-4" key={index}>
                <div className="text-lg font-semibold">Course: {education.course_name}</div>
                <div className="text-sm">Institution: {education.organization_name}</div>
                <div className="flex gap-3 text-xs">
                  <div> From: {education.from_date}</div>
                  <div>To: {education.to_date}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div
        className="w-28  px-5 py-2 mt-5 text-white cursor-pointer mx-auto sm:mx-0"
        style={{ backgroundColor: "#A91D3A" }}
        onClick={HandleExperienceDetails}
      >
        Next <FontAwesomeIcon icon={faArrowRight} color="white" />
      </div>
      {message && <div className="text-red-500 mt-4">{message}</div>}
    </div>
  );
}

export default Education;
