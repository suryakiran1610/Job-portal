import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { useParams } from "react-router-dom";
import JobseekerNavbar from "../../components/navbars/jobseekernavbar";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate, Link, useLocation } from "react-router-dom";


function Addeducation() {
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [isloading, setIsloading] = useState(false);
  const [file, setFile] = useState(null);
  const navigate=useNavigate()
  const [educationinfo, setEducationInfo] = useState({
    user_id: userdetails.id,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setErrors((prevErrors) => ({
      ...prevErrors,
      education_document: file ? "" : "Education document is required.",
    }));
  };

  const handleInputChange = (e) => {
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
      formData.append("user_id", educationinfo.user_id);
      for (let key in educationinfo) {
        formData.append(key, educationinfo[key]);
      }
      formData.append("education_document", file);

      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobseekereducation/`,
        {},
        {},
        formData
      )
        .then((response) => {
          console.log(response);
          setEducationInfo({
            user_id: educationinfo.user_id,
            course_name: "",
            from_date: "",
            to_date: "",
            organization_name: "",
          });
          setFile(null);
          navigate(`/jobseeker/jobseekereducation`) 

        })
        .catch((error) => {
          console.log(error);
        });
    }
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
            <h2 className="text-2xl font-bold mb-6 text-center">Add Education</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Course Name
                </label>
                <input
                  type="text"
                  name="course_name"
                  value={educationinfo.course_name}
                  onChange={handleInputChange}
                  className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 "
                />
                {errors.course_name && (
                  <p className="text-red-500 text-xs italic">
                    {errors.course_name}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Institution Name
                </label>
                <input
                  type="text"
                  name="organization_name"
                  value={educationinfo.organization_name}
                  onChange={handleInputChange}
                  className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.organization_name && (
                  <p className="text-red-500 text-xs italic">
                    {errors.organization_name}
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
                    value={educationinfo.from_date}
                    onChange={handleInputChange}
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
                    value={educationinfo.to_date}
                    onChange={handleInputChange}
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
                  Education Document
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileChange}
                  className="shadow border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.education_document && (
                  <p className="text-red-500 text-xs italic">
                    {errors.education_document}
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

export default Addeducation;
