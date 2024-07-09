import React, { useContext, useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import Adminsidebar from "../../components/navbars/Adminsidebar";
import AdminNav from "../../components/navbars/Adminnav";

function Companyprofile() {
  const [ profile, setProfile ] = useState("")
  const [toggleeditmodal, setToggleeditmodal] = useState(false);
  const [togglepasswordmodal, setTogglepasswordmodal] = useState(false);
  const token = Cookies.get("token");
  const { id } = useParams();
  const navigate = useNavigate();
  const [isloading, setIsloading] = useState(false);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [initialcredential, setInitialcredential] = useState({});
  const [errors, setErrors] = useState({});
  const [credentials, setCredentials] = useState("");
  const [initialprofiledetails, setInitialprofiledetails] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [editedprofile, setEditedprofile] = useState({
    mobile: "",
    company_name: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pin_code: "",
    profile_image: "",
  });

  const [editedcredential, setEditedcredential] = useState({
    email: "",
    username: "",
  });

  const [changepassword, setChangepassword] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const handleViewActiveJob = (companyId) => {
    navigate(`/admin/activejobs/${companyId}`);
  };

  const handleJobHistory = (companyId) => {
    navigate(`/admin/jobhistory/${companyId}`);
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    MakeApiRequest(
      "get",
      `${config.baseUrl}authentication/users/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log(response);
        setUsers(response);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    const params = {
      userid:id,
    };
    MakeApiRequest(
      "get",
      `${config.baseUrl}company/users/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("profile", response);
        setCredentials(response);
        setInitialcredential(response);
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

  useEffect(() => {
    const params = {
      user_id:id,
    };
    setIsloading(true);
    MakeApiRequest(
      "get",
      `${config.baseUrl}company/companyprofileview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("company profile", response);
        setProfile(response);
        setInitialprofiledetails(response);
        setEditedprofile(profile);
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

  function Handleprofiledetails(e) {
    const { name, value, type, files } = e.target;

    // Update editedprofile state based on input type
    if (type === "file") {
      setEditedprofile((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setEditedprofile((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const isProfileChanged = Object.keys(editedprofile).some((key) => {
      if (key === "profile_image") {
        return editedprofile[key] instanceof File;
      }
      return editedprofile[key] !== initialprofiledetails[key];
    });

    if (!isProfileChanged) {
      setMessage("No changes detected");
      return;
    }

    const params = {
      user_id:id,
    };

    const formData = new FormData();
    for (let key in editedprofile) {
      if (editedprofile[key]) {
        if (key === "profile_image") {
          if (editedprofile[key] instanceof File) {
            formData.append(key, editedprofile[key]);
          }
        } else {
          formData.append(key, editedprofile[key]);
        }
      }
    }
    if (isProfileChanged) {
      MakeApiRequest(
        "put",
        `${config.baseUrl}company/companyprofileview/`,
        headers,
        params,
        formData
      )
        .then((response) => {
          console.log(response);
          setMessage("Profile Updated successfully");
          setProfile(response);
          setInitialprofiledetails(response);
          setEditedprofile(response);
          setTimeout(() => {
            setMessage("");
          }, 2000);
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
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      return false;
    } else if (
      users.some(
        (user) => user.email === email && user.email !== credentials.email
      )
    ) {
      setErrors((prev) => ({ ...prev, email: "Email already exists" }));
      return false;
    } else {
      setErrors((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
      return true;
    }
  };

  const handleeditmodal = () => {
    setToggleeditmodal(true);
    setEditedcredential(credentials);
    setMessage("");
    setErrors("");
  };

  const handleCloseModal = () => {
    setToggleeditmodal(false);
    setMessage("");
    setErrors("");
  };
  const handlepasswordeditmodal = () => {
    setTogglepasswordmodal(true);
    setMessage("");
    setErrors("");
  };

  const handleclosemodal = () => {
    setTogglepasswordmodal(false);
    setMessage("");
    setErrors("");
  };

  function Handlepassword(e) {
    const { name, value } = e.target;
    setChangepassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function Handlecredentials(e) {
    const { name, value } = e.target;
    setEditedcredential((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "email") {
      // Clear previous email errors
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));

      // Validate email format
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Invalid email address",
        }));
      } else {
        // Check if email already exists in users array
        if (
          users.some(
            (user) => user.email === value && user.email !== credentials.email
          )
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email already exists",
          }));
        }
      }
    }
  }

  const handleSubmitcredential = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(editedcredential.email);

    if (!isEmailValid) {
      return;
    }

    const isChanged = Object.keys(editedcredential).some(
      (key) => editedcredential[key] !== initialcredential[key]
    );

    if (!isChanged) {
      setMessage("No changes detected");
      return;
    }

    const params = {
      userid:id,
    };

    const formData = new FormData();
    for (let key in editedcredential) {
      formData.append(key, editedcredential[key]);
    }

    MakeApiRequest(
      "put",
      `${config.baseUrl}company/users/`,
      headers,
      params,
      formData
    )
      .then((response) => {
        console.log(response);
        setMessage("Profile Updated successfully");
        setTimeout(() => {
          setToggleeditmodal(false);
          setMessage("");
        }, 2000);
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

  useEffect(() => {
    if (changepassword.newpassword !== changepassword.confirmpassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [changepassword]);

  const isPasswordFormValid =
    changepassword.oldpassword &&
    changepassword.newpassword &&
    changepassword.confirmpassword &&
    passwordError === "";

  const handleSubmitpassword = (e) => {
    e.preventDefault();

    console.log(token);
    const params = {
      userid:id,
    };

    const formData = new FormData();
    for (let key in changepassword) {
      formData.append(key, changepassword[key]);
    }

    MakeApiRequest(
      "put",
      `${config.baseUrl}company/passwordchange/`,
      headers,
      params,
      formData
    )
      .then((response) => {
        console.log(response);
        setMessage("Password Updated successfully");
        setTimeout(() => {
          setTogglepasswordmodal(false);
          setMessage("");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response && error.response.status === 400) {
          if (error.response.data.error === "Old password is incorrect") {
            setMessage("Old password is incorrect");
          }
        } else if (error.response && error.response.status === 401) {
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
      <AdminNav/>
      <div className="flex min-h-screen"style={{ backgroundColor: "#EEEEEE" }}>
        <div className="md:64">
          <Adminsidebar/>
        </div>
        {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (
          <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto">
            <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
              <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-800">
                <div className="mb-8">
                  <div className="flex justify-between">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                      Company Profile
                    </h2>
                    <button
                      onClick={handleeditmodal}
                      className="px-2 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md"
                    >
                      Update Credentials
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 dark:text-neutral-400">
                    Manage your name, password and account settings.
                  </p>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                    <div className="sm:col-span-3">
                      <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        Profile photo
                      </label>
                    </div>

                    <div className="sm:col-span-9">
                      <div className="flex items-center gap-5 text-xs">
                        <img
                          className="inline-block size-16 rounded-full ring-2 ring-white dark:ring-neutral-900"
                          src={`${config.imagebaseurl}${profile.profile_image}`}
                          alt={profile.companyname}
                        />
                        <input
                          onChange={Handleprofiledetails}
                          name="profile_image"
                          type="file"
                          className="rounded-lg ml-4"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="af-account-full-name"
                        className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                      >
                        Company name
                      </label>
                      <div className="hs-tooltip inline-block"></div>
                    </div>

                    <div className="sm:col-span-9">
                      <div className="sm:flex">
                        <input
                          onChange={Handleprofiledetails}
                          name="company_name"
                          defaultValue={profile.company_name}
                          type="text"
                          className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        Address 1
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        onChange={Handleprofiledetails}
                        name="address_line1"
                        defaultValue={profile.address_line1}
                        type="text"
                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200">
                        Address 2
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        onChange={Handleprofiledetails}
                        name="address_line2"
                        defaultValue={profile.address_line2}
                        type="text"
                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Phone
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-9">
                      <input
                        onChange={Handleprofiledetails}
                        name="mobile"
                        defaultValue={profile.mobile}
                        type="text"
                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          City
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-9">
                      <input
                        onChange={Handleprofiledetails}
                        name="city"
                        defaultValue={profile.city}
                        type="text"
                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          State
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-9">
                      <input
                        onChange={Handleprofiledetails}
                        name="state"
                        defaultValue={profile.state}
                        type="text"
                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <div className="inline-block">
                        <label
                          htmlFor="af-account-phone"
                          className="inline-block text-sm text-gray-800 mt-2.5 dark:text-neutral-200"
                        >
                          Pincode
                        </label>
                      </div>
                    </div>
                    <div className="sm:col-span-9">
                      <input
                        onChange={Handleprofiledetails}
                        name="pin_code"
                        defaultValue={profile.pin_code}
                        type="text"
                        className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      />
                    </div>
                  </div>
                  <div className="mt-5 mb-2 flex justify-end gap-x-2">
                    <button
                      onClick={() => handleViewActiveJob(profile.company_user_id)}
                      type="button"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-800 text-white  disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Active Jobs
                    </button>
                    <button
                      onClick={() => handleJobHistory(profile.company_user_id)}
                      type="button"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-800 text-white  disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Job History
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
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
                      <span className="font-bold">Success:</span> Profile
                      updated successfully.
                    </div>
                  ))}
              </div>
            </div>

            {toggleeditmodal && (
              <div className="fixed inset-0 z-50 px-4 pt-4 pb-20 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                  <div className="flex justify-between items-center py-3 px-4 border-b">
                    <h3 className="font-bold text-gray-800">
                      Edit Credentials
                    </h3>
                    <button
                      onClick={handleCloseModal}
                      type="button"
                      className="text-gray-800 hover:bg-gray-100 rounded-full p-1"
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <form
                    onSubmit={handleSubmitcredential}
                    encType="multipart/form-data"
                  >
                    <div className="p-2">
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        onChange={Handlecredentials}
                        defaultValue={editedcredential.email}
                        name="email"
                        type="email"
                        className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {errors.email && (
                        <span className="text-red-500 text-xs">
                          {errors.email}
                        </span>
                      )}
                    </div>
                    <div className="p-2">
                      <label className="block text-sm font-medium mb-2">
                        Username
                      </label>
                      <input
                        onChange={Handlecredentials}
                        defaultValue={editedcredential.username}
                        name="username"
                        type="text"
                        className="py-2 px-22 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                      <button
                        onClick={handlepasswordeditmodal}
                        className="px-2 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md text-sm"
                      >
                        Change Password
                      </button>
                      <button
                        onClick={handleCloseModal}
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Save changes
                      </button>
                    </div>
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
                          <span className="font-bold">Success:</span>{" "}
                          Credentials updated successfully.
                        </div>
                      ))}
                  </form>
                </div>
              </div>
            )}
            {togglepasswordmodal && (
              <div className="fixed inset-0 z-50 px-4 pt-4 pb-20 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                  <div className="flex justify-between items-center py-3 px-4 border-b">
                    <h3 className="font-bold text-gray-800">Edit Password</h3>
                    <button
                      onClick={handleclosemodal}
                      type="button"
                      className="text-gray-800 hover:bg-gray-100 rounded-full p-1"
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <form onSubmit={handleSubmitpassword}>
                    <div className="p-2">
                      <label className="block text-sm font-medium mb-2">
                        Old Password
                      </label>
                      <input
                        onChange={Handlepassword}
                        name="oldpassword"
                        type="password"
                        className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2">
                      <label className="block text-sm font-medium mb-2">
                        New Password
                      </label>
                      <input
                        onChange={Handlepassword}
                        name="newpassword"
                        type="password"
                        className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2">
                      <label className="block text-sm font-medium mb-2">
                        Confirm Password
                      </label>
                      <input
                        onChange={Handlepassword}
                        name="confirmpassword"
                        type="password"
                        className="py-2 px-22 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {passwordError && (
                      <div className="p-2 text-red-500 text-sm">
                        {passwordError}
                      </div>
                    )}
                    <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                      <button
                        onClick={handleclosemodal}
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                      >
                        Close
                      </button>
                      {isPasswordFormValid ? (
                        <button
                          type="submit"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Save changes
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-600 text-white"
                          disabled
                        >
                          Save changes
                        </button>
                      )}
                    </div>
                    {message &&
                      (message === "Password Updated successfully" ? (
                        <div
                          className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                          role="alert"
                        >
                          <span className="font-bold">Success:</span> Password
                          updated successfully.
                        </div>
                      ) : message === "Old password is incorrect" ? (
                        <div
                          className="mt-2 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                          role="alert"
                        >
                          <span className="font-bold">Warning:</span> Old
                          Password is Incorrect.
                        </div>
                      ) : null)}
                  </form>
                </div>
              </div>
            )}
          </div>
      )}
      </div>
    </>
  );
}

export default Companyprofile;
