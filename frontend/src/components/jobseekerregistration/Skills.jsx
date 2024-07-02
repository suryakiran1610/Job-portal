import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { useParams } from "react-router-dom";
import { SiTicktick } from "react-icons/si";
import BeatLoader from "react-spinners/BeatLoader";


function Skills() {
  const [tags, setTags] = useState([]);
  const [success, setSuccess] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const { id } = useParams();
  const [errors, setErrors] = useState({
    tags: "",
    selectedCategory: "",
    resumeFile: "",
  });

  useEffect(() => {
    setIsloading(true);
    MakeApiRequest(
      "get",
      `${config.baseUrl}company/jobcategory/`,
      {},
      {},
      {}
    )
      .then((response) => {
        console.log(response);
        setJobCategories(response);
        setIsloading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized access. Token might be expired or invalid.");
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  }, []);

  const options = jobCategories.map((category) => ({
    value: category.id,
    label: category.jobcategory,
  }));

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value.charAt(0).toUpperCase() + value.slice(1));
  };

  const handleInputKeyPress = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();

      const newTag = inputValue.trim();
      if (newTag !== "") {
        const existingTag = tags.find(
          (tag) => tag.toLowerCase() === newTag.toLowerCase()
        );

        if (!existingTag) {
          setTags([...tags, newTag]);
          setErrors((prevErrors) => ({
            ...prevErrors,
            tags: "",
          }));
        }
        setInputValue("");
      }
    }
  };

  const handleTagRemove = (tagIndex) => {
    const updatedTags = tags.filter((_, index) => index !== tagIndex);
    setTags(updatedTags);
    if (updatedTags.length === 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        tags: "Please add at least one skill.",
      }));
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    setErrors((prevErrors) => ({
      ...prevErrors,
      selectedCategory: "",
    }));
  };

  const handleResumeChange = (event) => {
    setResumeFile(event.target.files[0]);
    setErrors((prevErrors) => ({
      ...prevErrors,
      resumeFile: event.target.files[0] ? "" : "Please upload your resume.",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      tags: "",
      selectedCategory: "",
      resumeFile: "",
    };

    if (tags.length === 0) {
      newErrors.tags = "Please add at least one skill.";
      isValid = false;
    }

    if (!selectedCategory) {
      newErrors.selectedCategory = "Please select a job category.";
      isValid = false;
    }

    if (!resumeFile) {
      newErrors.resumeFile = "Please upload your resume.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Upload resume
      if (resumeFile) {
        const resumeFormData = new FormData();
        resumeFormData.append("resume", resumeFile);

        const params = { user_id: id };

        await MakeApiRequest(
          "post",
          `${config.baseUrl}jobseeker/uploadresume/`,
          {},
          params,
          resumeFormData
        );
      }

      // Add job category
      if (selectedCategory) {
        const categoryData = { category_id: selectedCategory.value };
        const params = { user_id: id };

        await MakeApiRequest(
          "post",
          `${config.baseUrl}jobseeker/jobcategorycreate/`,
          {},
          params,
          categoryData
        );
      }

      // Add skills
      const data = { skills: tags };
      const params = { user_id: id };

      await MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobseekerskills/`,
        {},
        params,
        data
      );

      setSuccess(true);
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };


  useEffect(() => {
    if (success) {
      const redirectTimer = setTimeout(() => {
        window.location.href = "/";
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [success]);

  return (
    <>
    {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (  
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col items-center p-4 max-w-lg mx-auto"
      >
        {/* Header */}
        <div className="text-center text-2xl font-bold mt-5 mb-5">Add Job Details</div>

        {/* Skills */}
        <div className="w-full">
          <div className="tag-input-container text-base font-semibold mb-5">
            <label className="block mb-2">Add Skills you have</label>
            <div className="tag-list flex flex-wrap items-center border px-3 py-2 rounded-md">
              <input
                type="text"
                className="tag-input flex-grow bg-transparent outline-none"
                value={inputValue}
                placeholder="Enter a Skill"
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
              />
            </div>
            <ul className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <li
                  key={index}
                  className="tag flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm font-bold"
                >
                  {tag}
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleTagRemove(index)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
            {errors.tags && (
              <span className="error-message text-red-700 mt-2">{errors.tags}</span>
            )}
          </div>
        </div>

        {/* Job Category */}
        <div className="w-full mb-5">
          <label className="block text-base font-semibold mb-2">Select your job Category</label>
          <Select
            className="mt-1"
            isClearable
            options={options}
            placeholder="Select a category"
            onChange={handleCategoryChange}
          />
          {errors.selectedCategory && (
            <span className="error-message text-red-700 mt-2">{errors.selectedCategory}</span>
          )}
        </div>

        {/* Upload Resume */}
        <div className="w-full mb-5">
          <label className="block text-base font-semibold mb-2">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="w-full p-2 border rounded-md"
          />
          {errors.resumeFile && (
            <span className="error-message text-red-700 mt-2">{errors.resumeFile}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{ backgroundColor: "#A91D3A" }}
          className="continue-btn text-white px-5 py-2 rounded-md flex items-center"
        >
          Continue <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </button>
      </form>
      )}

      {success && (
        <div className="success-bg-main fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="success-box flex flex-col items-center w-10/12 md:w-6/12 lg:w-4/12 bg-white rounded-lg p-5">
            <div className="mt-5">
                <SiTicktick  className="text-8xl text-green-600"/>
            </div>
            <div className="text-2xl font-semibold text-sky-900 mt-5">
              Profile created!
            </div>
            <div className="text-lg font-semibold text-sky-900 mt-5 text-center">
              Get ready for exciting job opportunities ahead
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Skills;
