import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
// import successicon from "../../../../Assets/Images/success.png";
import Cookies from "js-cookie";
import Select from "react-select";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { useParams } from "react-router-dom";


function Skills() {
  const user_id = Cookies.get("user_id");
  const [tags, setTags] = useState([]);
  const [success, setSuccess] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [jobCategories, setJobCategories] = useState([]);
  const { id } = useParams();



  const [errors, setErrors] = useState({
    tags: "",
    selectedCategory: "",
    resumeFile: "",
  });


  useEffect(() => {
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

    // Upload resume
    if (resumeFile) {
      const resumeFormData = new FormData();
      resumeFormData.append("resume", resumeFile);

      const params = {
        user_id: id,
      };

      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/uploadresume/`,
        {},
        params,
        resumeFormData
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          // Handle any errors
        });
    }

    // Add job category
    if (selectedCategory) {
      const categoryData = { category_id: selectedCategory.value };
      const params = {
        user_id: id,
      };

      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobcategorycreate/`,
        {},
        params,
        categoryData
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          // Handle any errors
        });
    }

    // Add skills
    const data = { skills: tags };
    const params = {
        user_id: id,
      };
      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobseekerskills/`,
        {},
        params,
        data
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          // Handle any errors
        });
  };


  return (
    <>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex flex-col items-center">
        {/* Skills */}
        <div className="text-center text-2xl font-bold">Skills</div>
        <div className="">
          <div className="tag-input-container w-[300px] text-base font-semibold">
            Add Skills you have
            <div className="tag-list px-2 py-2 ml-4">
              {tags.map((tag, index) => (
                <div key={index} className="tag text-sm font-thin">
                  {tag}
                  <button
                    className="tag-remove-button"
                    onClick={() => handleTagRemove(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <input
                type="text"
                className="tag-input font-thin"
                value={inputValue}
                placeholder="Enter a Skill"
                onChange={handleInputChange}
                onKeyPress={handleInputKeyPress}
              />
            </div>
            {errors.tags && (
              <span className="error-message text-red-700">{errors.tags}</span>
            )}
          </div>
        </div>
        {/* Job Category */}
        <div className="text-center mt-5 text-2xl font-bold">Job Category</div>
        <div className="w-[300px] text-base font-semibold flex flex-col gap-1 mt-3">
          Select your job Category
          <Select
            className="mt-4"
            isClearable
            options={options}
            placeholder="Select a category"
            onChange={handleCategoryChange}
          />
          {errors.selectedCategory && (
            <span className="error-message text-red-700">
              {errors.selectedCategory}
            </span>
          )}
        </div>
        {/* Upload Resume */}
        <div className="text-center mt-5 text-2xl font-bold">Upload Resume</div>
        <div className="w-[300px] text-base font-semibold flex flex-col gap-1 mt-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
          />
          {errors.resumeFile && (
            <span className="error-message text-red-700">
              {errors.resumeFile}
            </span>
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="continue-btn px-5 py-2 float-right mt-2"
        >
          Continue <FontAwesomeIcon icon={faArrowRight} color="white" />
        </button>
      </form>
      {/* Success Message */}
      {success && (
        <div className="success-bg-main absolute w-full h-full top-0 flex justify-center items-center">
          <div className="success-box flex flex-col items-center w-6/12 h-3/6 bg-white rounded-lg max-sm:w-10/12">
            <div className="mt-10">
              <img src={successicon} alt="" />
            </div>
            <div className="text-3xl font-semibold text-sky-900 mt-5">
              Profile created!
            </div>
            <div className="text-1xl font-semibold text-sky-900 mt-5 max-sm:px-5 text-center">
              Get ready for exciting job opportunities ahead
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Skills;
