import React, {useContext, useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import ProfileContext from "../../context/ProfileContext";
import Adminsidebar from "../navbars/Adminsidebar";
import AdminNav from "../navbars/Adminnav";

function Adminprofile() {
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [toggleeditmodal, setToggleeditmodal] = useState(false);
  const [togglepasswordmodal, setTogglepasswordmodal] = useState(false);
  const token = Cookies.get("token");
  const { profile, setProfile } = useContext(ProfileContext);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [initialprofiledetails, setInitialprofiledetails] = useState({});
  const [passwordError, setPasswordError] = useState("");
  const [editedprofile, setEditedprofile] = useState({
    email: "",
    username: "",
    fullname: "",
    address: "",
    mobile: "",
    profile_image: "",
  });

  const [changepassword, setChangepassword] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    MakeApiRequest("get", `${config.baseUrl}authentication/users/`, headers,{} ,{})
      .then((response) => {
        console.log(response);
        setUsers(response);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const validateEmail = (email) => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
      return false;
    } else if (users.some((user) => user.email === email && user.email !== profile.email)) {
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
    setEditedprofile(profile);
  };

  const handleCloseModal = () => {
    setToggleeditmodal(false);
    setMessage("");
  };
  const handlepasswordeditmodal = () => {
    setTogglepasswordmodal(true);
  };

  const handleclosemodal = () => {
    setTogglepasswordmodal(false);
    setMessage("");
  };

  

  useEffect(() => {
    const params = {
      userid: userdetails.id,
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
        setProfile(response);
        setInitialprofiledetails(response);
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
  
    // Validate email if the input name is 'email'
    if (name === "email") {
      // Clear previous email errors
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
  
      // Validate email format
      if (!/\S+@\S+\.\S+/.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email address" }));
      } else {
        // Check if email already exists in users array
        if (users.some((user) => user.email === value && user.email !== profile.email)) {
          setErrors((prevErrors) => ({ ...prevErrors, email: "Email already exists" }));
        }
      }
    }
  }
  

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(editedprofile.email);

  if (!isEmailValid) {
    return;
  }

    const isChanged = Object.keys(editedprofile).some(
      (key) => editedprofile[key] !== initialprofiledetails[key]
    );

    if (!isChanged) {
      setMessage("No changes detected");
      return;
    }

    const params = {
      userid: userdetails.id,
    };

    const formData = new FormData();
    for (let key in editedprofile) {
      if (key === "profile_image") {
        if (editedprofile[key] instanceof File) {
          formData.append(key, editedprofile[key]);
        }
      } else {
        formData.append(key, editedprofile[key]);
      }
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
        setProfile(response);
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

  function Handlepassword(e) {
    const { name, value } = e.target;
    setChangepassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

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
      userid: userdetails.id,
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
        <div className="flex-1 h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="flex flex-col md:flex-row md:space-x-4 p-4">
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-4 md:w-2/3 mb-6 md:mb-0">
            <img
              className="w-24 h-24 rounded-full"
              src={`http://127.0.0.1:8000${profile.profile_image}`}
              alt="User Avatar"
            />
            <h2 className="text-xl font-semibold">ADMIN</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleeditmodal}
                className="px-3 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md"
              >
                Edit Profile
              </button>
              <button
                onClick={handlepasswordeditmodal}
                className="px-3 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-2 md:w-2/3">
            <div className="flex justify-between p-2">
              <h3 className="text-gray-700 font-semibold">User</h3>
              <p className="text-gray-600">ADMIN</p>
            </div>
            <hr />
            <div className="flex justify-between p-2">
              <h3 className="text-gray-700 font-semibold">Email</h3>
              <p className="text-gray-600">{profile.email}</p>
            </div>
            <hr />
            <div className="flex justify-between p-2">
              <h3 className="text-gray-700 font-semibold">Username</h3>
              <p className="text-gray-600">{profile.username}</p>
            </div>
            <hr />
            <div className="flex justify-between p-2">
              <h3 className="text-gray-700 font-semibold">Mobile</h3>
              <p className="text-gray-600">{profile.mobile}</p>
            </div>
          </div>
        </div>

      {toggleeditmodal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center py-3 px-4 border-b">
              <h3 className="font-bold text-gray-800">Edit Profile</h3>
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              
              <div className="p-2">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  onChange={Handleprofiledetails}
                  value={editedprofile.email}
                  name="email"
                  type="email"
                  className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
              </div>
              <div className="p-2">
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <input
                  onChange={Handleprofiledetails}
                  value={editedprofile.username}
                  name="username"
                  type="text"
                  className="py-2 px-22 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="p-2">
                <label className="block text-sm font-medium mb-2">Mobile</label>
                <input
                  onChange={Handleprofiledetails}
                  value={editedprofile.mobile}
                  name="mobile"
                  type="text"
                  className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="p-2">
                <label className="block text-sm font-medium mb-2">
                  Profile Image
                </label>
                <input
                  onChange={Handleprofiledetails}
                  name="profile_image"
                  type="file"
                  className="py-1 px-1 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
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
                    <span className="font-bold">Success:</span> Profile updated
                    successfully.
                  </div>
                ))}
            </form>
          </div>
        </div>
      )}

      {togglepasswordmodal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center py-3 px-4 border-b">
              <h3 className="font-bold text-gray-800">Edit Profile</h3>
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
                <div className="p-2 text-red-500 text-sm">{passwordError}</div>
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
                    <span className="font-bold">Success:</span> Password updated
                    successfully.
                  </div>
                ) : message === "Old password is incorrect" ? (
                  <div
                    className="mt-2 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                    role="alert"
                  >
                    <span className="font-bold">Warning:</span> Old Password is
                    Incorrect.
                  </div>
                ) : (
                  <div
                    className="mt-2 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                    role="alert"
                  >
                    <span className="font-bold">Warning:</span> No changes
                    detected. You should check in on some of those fields.
                  </div>
                ))}
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
    </>
  );
}

export default Adminprofile;
