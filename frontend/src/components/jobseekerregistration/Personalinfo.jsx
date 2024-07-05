import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import Cookies from "js-cookie";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { useParams } from "react-router-dom";

function PersonalDetails({ setActiveComponent }) {
  const { id } = useParams();
  const [personalinfo, setPersonalinfo] = useState({
    user_id: id,
    full_name: "",
    dob: "",
    mobile: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pin_code: "",
  });
  const [file, setFile] = useState();
  const [details, setDetails] = useState(true);

  const [errors, setErrors] = useState({
    full_name: "",
    dob: "",
    mobile: "",
    address_line1: "",
    city: "",
    state: "",
    pin_code: "",
    profile_image: "",
  });

  function HandleNextDetails() {
    setActiveComponent("education");
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setErrors((prevErrors) => ({
      ...prevErrors,
      profile_image: file ? "" : "Profile image is required.",
    }));
  };

  function HandlePesronalInfo(e) {
    const { name, value } = e.target;
    setPersonalinfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  }

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "full_name":
        if (!value.trim()) {
          errorMessage = "Full name is required.";
        }
        break;
      case "dob":
        if (!value.trim()) {
          errorMessage = "Date of birth is required.";
        }
        break;
      case "mobile":
        if (!value.trim()) {
          errorMessage = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          errorMessage = "Mobile number must be 10 digits.";
        }
        break;
      case "address_line1":
        if (!value.trim()) {
          errorMessage = "Address line 1 is required.";
        }
        break;
      case "city":
        if (!value.trim()) {
          errorMessage = "City is required.";
        }
        break;
      case "state":
        if (!value.trim()) {
          errorMessage = "State is required.";
        }
        break;
      case "pin_code":
        if (!value.trim()) {
          errorMessage = "Pin code is required.";
        } else if (!/^\d{6}$/.test(value)) {
          errorMessage = "Pin code must be 6 digits.";
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
      full_name: "",
      dob: "",
      mobile: "",
      address_line1: "",
      city: "",
      state: "",
      pin_code: "",
      profile_image: "",
    };

    if (!personalinfo.full_name.trim()) {
      newErrors.full_name = "Full name is required.";
      isValid = false;
    }
    if (!personalinfo.dob.trim()) {
      newErrors.dob = "Date of birth is required.";
      isValid = false;
    }
    if (!personalinfo.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(personalinfo.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
      isValid = false;
    }
    if (!personalinfo.address_line1.trim()) {
      newErrors.address_line1 = "Address line 1 is required.";
      isValid = false;
    }
    if (!personalinfo.city.trim()) {
      newErrors.city = "City is required.";
      isValid = false;
    }
    if (!personalinfo.state.trim()) {
      newErrors.state = "State is required.";
      isValid = false;
    }
    if (!personalinfo.pin_code.trim()) {
      newErrors.pin_code = "Pin code is required.";
      isValid = false;
    } else if (!/^\d{6}$/.test(personalinfo.pin_code)) {
      newErrors.pin_code = "Pin code must be 6 digits.";
      isValid = false;
    }
    if (!file) {
      newErrors.profile_image = "Profile image is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

 

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = {
        user_id: id,
      };

    if (validateForm()) {
      const formData = new FormData();
      for (let key in personalinfo) {
        formData.append(key, personalinfo[key]);
      }
      formData.append("profile_image", file);

      MakeApiRequest(
        "post",
        `${config.baseUrl}jobseeker/jobseekerpersonalinfo/`,
        {},
        params,
        formData
      )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          // Handle any errors
        });
      HandleNextDetails();
    }
  };

  return (
    <>  
          <div className="flex justify-evenly pt-10 max-sm:flex-col-reverse max-sm:justify-normal max-sm:pt-3">
            <div className="flex flex-col gap-2 max-sm:p-8 ">
              <div className="fill-personal font-bold text-xl ">
                Add your Personal Information
              </div>
              <label className="flex flex-col mb-1 gap-1 text-xs">
                Full Name
                <input
                  type="text"
                  name="full_name"
                  className="border border-gray-300 w-64 h-8 ml-2"
                  value={personalinfo.full_name}
                  onChange={HandlePesronalInfo}
                />
                {errors.full_name && (
                  <span className="error-message text-red-700">
                    {errors.full_name}
                  </span>
                )}
              </label>
              <label className="flex flex-col mb-1 gap-1 text-xs">
                Date of Birth
                <input
                  type="date"
                  name="dob"
                  value={personalinfo.dob}
                  onChange={HandlePesronalInfo}
                  className="border border-gray-300 w-64 h-8 ml-2"
                />
                {errors.dob && (
                  <span className="error-message text-red-700">
                    {errors.dob}
                  </span>
                )}
              </label>
              <label className="flex flex-col mb-1 gap-1 text-xs">
                Mobile
                <div className="flex gap-3">
                  <input
                    type="text"
                    defaultValue="+91"
                    className="border border-gray-300 w-14 h-8 ml-2"
                  />
                  <input
                    type="tel"
                    name="mobile"
                    value={personalinfo.mobile}
                    onChange={HandlePesronalInfo}
                    className="border border-gray-300 w-44  h-8 "
                  />
                </div>
                {errors.mobile && (
                  <span className="error-message text-red-700">
                    {errors.mobile}
                  </span>
                )}
              </label>
              <label className="flex flex-col mb-1 gap-1 text-xs">
                Address Line 1
                <input
                  type="text"
                  name="address_line1"
                  value={personalinfo.address_line1}
                  onChange={HandlePesronalInfo}
                  className="border border-gray-300 w-64 h-8 ml-2"
                />
                {errors.address_line1 && (
                  <span className="error-message text-red-700">
                    {errors.address_line1}
                  </span>
                )}
              </label>
              <label className="flex flex-col mb-1 gap-1 text-xs">
                Address Line 2
                <input
                  type="text"
                  name="address_line2"
                  value={personalinfo.address_line2}
                  onChange={HandlePesronalInfo}
                  className="border border-gray-300 w-64 h-8 ml-2"
                />
              </label>
              <div className="flex flex-row gap-5">
                <label className="flex flex-col mb-1 gap-1 text-xs">
                  City
                  <input
                    type="text"
                    name="city"
                    value={personalinfo.city}
                    onChange={HandlePesronalInfo}
                    className="border border-gray-300 w-20 h-8 ml-2"
                  />
                  {errors.city && (
                    <span className="error-message text-red-700">
                      {errors.city}
                    </span>
                  )}
                </label>
                <label className="flex flex-col mb-1 gap-1 text-xs">
                  State
                  <input
                    type="text"
                    name="state"
                    value={personalinfo.state}
                    onChange={HandlePesronalInfo}
                    className="border border-gray-300 w-20 h-8 ml-2"
                  />
                  {errors.state && (
                    <span className="error-message text-red-700">
                      {errors.state}
                    </span>
                  )}
                </label>
                <label className="flex flex-col mb-1 gap-1 text-xs">
                  Pin Code
                  <input
                    type="text"
                    name="pin_code"
                    value={personalinfo.pin_code}
                    onChange={HandlePesronalInfo}
                    className="border border-gray-300 w-20 h-8 ml-2"
                  />
                  {errors.pin_code && (
                    <span className="error-message text-red-700">
                      {errors.pin_code}
                    </span>
                  )}
                </label>
              </div>
              <button
                className=" px-1 py-2 mt-6 text-white"
                style={{ backgroundColor: "#A91D3A" }}
                onClick={handleSubmit}
                type="submit"
              >
                Continue <FontAwesomeIcon icon={faArrowRight} color="white" />
              </button>
            </div>
            <div className="flex flex-col gap-2 ml-9">
              <div className="font-bold  text-base mb-2">
                Add your Profile Image
              </div>
              <div className="profile-add-text flex flex-col relative max-sm:flex-row">
                <input
                  type="file"
                  title=""
                  className="choose-file-box"
                  id=""
                  name="profile_image"
                  accept=" image/jpeg, image/png"
                  onChange={handleFileChange}
                />
              </div>
              {errors.profile_image && (
                <span className="error-message text-red-700">
                  {errors.profile_image}
                </span>
              )}
            </div>
          </div>

    </>
  );
}

export default PersonalDetails;
