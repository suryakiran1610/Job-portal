import img2 from "./image1.png";
import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";

function Login() {
  const [activeComponent, setActiveComponent] = useState("email");
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname,setFullname]=useState("")
  const [companyname, setCompanyname] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [registererror, setRegistererror] = useState(false);
  const [registersuccess, setRegistersuccess] = useState(false);
  const headers = {
    "Content-Type": "application/json",
  };
  const navigate = useNavigate();

  //Fetch all Registered Users//

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

  //Jobseeker Registration Submit//

  const JobseekerSubmit = (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
      username,
      fullname,
      usertype: "jobseeker",
    };

    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!username) newErrors.username = "Username is required";
    if (!fullname) newErrors.fullname = "Fullname is required";


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    MakeApiRequest("post",`${config.baseUrl}authentication/register/`,headers,{},data)
      .then((response) => {
        console.log(response);
        setRegistersuccess(true);
            console.log("Registration successful! Redirecting in 3 seconds...");
            setTimeout(() => {
                setRegistersuccess(false);
                setActiveComponent("login");
                console.log("Redirecting to login component");
            }, 4000);
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        if (error.response && error.response.status === 400) {
            setRegistererror(true);
            console.log("Registration failed! Hiding error message in 3 seconds...");
            setTimeout(() => {
              setRegistererror(false);
              console.log("Hiding error message");
            }, 5000);
          }
      });
  };

  //Employer Registration Submit//

  const EmployerSubmit = (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
      companyname,
      username,
      usertype: "employer",
    };

    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!companyname) newErrors.companyname = "Company Name is required";
    if (!username) newErrors.username = "Username is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    MakeApiRequest("post",`${config.baseUrl}authentication/register/`,headers,{},data)
      .then((response) => {
        console.log(response);
            setRegistersuccess(true);
            console.log("Registration successful! Redirecting in 3 seconds...");
            setTimeout(() => {
                setRegistersuccess(false);
                setActiveComponent("login");
                console.log("Redirecting to login component");
            }, 4000);
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        if (error.response && error.response.status === 400) {
            setRegistererror(true);
            console.log("Registration failed! Hiding error message in 3 seconds...");
            setTimeout(() => {
              setRegistererror(false);
              console.log("Hiding error message");
            }, 5000);
          }
      });
  };

  //Login Submit//

  const LoginSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };

    const newErrors = {};
    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    MakeApiRequest("post",`${config.baseUrl}authentication/login/`,headers,{},data)
      .then((response) => {
        console.log(response);
        const token = response.token;
        const user = response.user;
        if (user && user.usertype) {
          const userType = user.usertype;
          switch (userType) {
            case "superuser":
              console.log("admin login Successful");
              Cookies.set("token", token);
              localStorage.setItem("user",JSON.stringify(user))
              navigate("/admin/dashboard");
              break;
            case "jobseeker":
              console.log("jobseeker login Successful");
              Cookies.set("token", token);
              localStorage.setItem("user",JSON.stringify(user))
              navigate("/jobseeker/jobseekersearch");
              break;
            case "employer":
              console.log("employer login Successful");
              Cookies.set("token", token);
              localStorage.setItem("user",JSON.stringify(user))
              navigate("/employer/employersearch");
              break;
            default:
              console.log("Unknown user type:", userType);
              break;
          }
        } else {
          console.error("Invalid user data in token response:", user);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        if (error.response && error.response.status === 401) {
            const errorMessage = error.response.data.error || "Unauthorized";
            setErrors({ form: errorMessage });
        } else {
            console.error("Unexpected error during login:", error);
            setErrors({ form: "An unexpected error occurred. Please try again later." });
        }
    });
    
  };

  //Email Validation//

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (!emailValue) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
    } else if (users.some((user) => user.email === emailValue)) {
      setErrors((prev) => ({ ...prev, email: "Email already exists" }));
    } else {
      setErrors((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  //Fullname Validation//

  const handleFullnameChange = (e) => {
    const fullnameValue = e.target.value;
    setFullname(fullnameValue);

    const newErrors = { ...errors };
    if (!fullnameValue) {
      newErrors.fullname = "FullName is required";
    } else {
      delete newErrors.fullname;
    }
    setErrors(newErrors);
  };

  //Username Validation//

  const handleUsernameChange = (e) => {
    const usernameValue = e.target.value;
    setUsername(usernameValue);

    const newErrors = { ...errors };
    if (!usernameValue) {
      newErrors.username = "Username is required";
    } else {
      delete newErrors.username;
    }
    setErrors(newErrors);
  };

  //Password Validation//

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    const newErrors = { ...errors };
    if (!passwordValue) {
      newErrors.password = "Password is required";
    } else {
      delete newErrors.password;
    }
    setErrors(newErrors);
  };

  //Company Name Validation//

  const handleCompanynameChange = (e) => {
    const companynameValue = e.target.value;
    setCompanyname(companynameValue);

    const newErrors = { ...errors };
    if (!companynameValue) {
      newErrors.companyname = "Company Name is required";
    } else {
      delete newErrors.companyname;
    }
    setErrors(newErrors);
  };

  const handleNextClick = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
    } else if (users.some((user) => user.email === email)) {
      setErrors((prev) => ({ ...prev, email: "Email already exists" }));
    } else {
      setErrors({});
      setActiveComponent("usertype");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: "#EEEEEE" }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg">
        <div
          className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center"
          style={{ backgroundColor: "#A91D3A" }}
        >
          <img
            src={img2}
            alt="JobFind"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-4 md:p-8">

          {activeComponent === "jobseeker" && (
            <div className="w-full max-w-sm">
              <h2
                className="font-bold text-3xl sm:text-4xl mb-4"
                style={{ color: "#102C57" }}
              >
                Welcome Jobseeker
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Signing up as{" "}
                <span className="text-base text-black">{email}</span>
                <span
                  className="text-base text-blue-400 cursor-pointer"
                  onClick={() => {
                    setActiveComponent("email");
                  }}
                >
                  (not you?)
                </span>
              </p>
              <form onSubmit={JobseekerSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    onChange={handleFullnameChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Full Name"
                  />
                  {errors.fullname && (
                    <span className="text-red-500 text-xs">
                      {errors.fullname}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    onChange={handleUsernameChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Username"
                  />
                  {errors.username && (
                    <span className="text-red-500 text-xs">
                      {errors.username}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    onChange={handlePasswordChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Password"
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white  bg-slate-800 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Register
                </button>

                {registersuccess && (
                    <div className="bg-teal-50 border-teal-500 rounded-lg p-4 " role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                            <path d="m9 12 2 2 4-4"></path>
                          </svg>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold dark:text-white">
                          Successfully Registered.
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                          You have successfully Registered.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {registererror &&(
                    <div className="bg-red-50 border-red-500 p-4" role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold dark:text-white">
                        Registration failed
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                        Your Registration is Failed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </form>
              <p
                className="text-blue-500 flex justify-center items-center text-base text-center mt-4 cursor-pointer"
                onClick={() => {
                  setActiveComponent("employer");
                }}
              >
                Wait, I am an employer
                <FaArrowRight className="ml-1 mt-1 text-blue-500" />
              </p>
            </div>
          )}



          {activeComponent === "employer" && (
            <div className="w-full max-w-sm">
              <h2
                className="font-bold text-3xl sm:text-4xl mb-2"
                style={{ color: "#102C57" }}
              >
                Welcome Employer
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Signing up as{" "}
                <span className="text-base text-black">{email}</span>
                <span
                  className="text-base text-blue-400 cursor-pointer"
                  onClick={() => {
                    setActiveComponent("email");
                  }}
                >
                  (not you?)
                </span>
              </p>
              <form onSubmit={EmployerSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    onChange={handleCompanynameChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Company Name"
                  />
                  {errors.companyname && (
                    <span className="text-red-500 text-xs">
                      {errors.companyname}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    onChange={handleUsernameChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Username"
                  />
                  {errors.username && (
                    <span className="text-red-500 text-xs">
                      {errors.username}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <input
                    type="password"
                    onChange={handlePasswordChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Password"
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password}
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white  bg-slate-800 hover:bg-slate-900  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Register
                </button>
                {registersuccess && (
                    <div className="bg-teal-50 border-teal-500 rounded-lg p-4 " role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
                          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                            <path d="m9 12 2 2 4-4"></path>
                          </svg>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold dark:text-white">
                          Successfully Registered.
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                          You have successfully Registered.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {registererror &&(
                    <div className="bg-red-50 border-red-500 p-4" role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                          <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h3 className="text-gray-800 font-semibold dark:text-white">
                        Registration failed
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-neutral-400">
                        Your Registration is Failed.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
   
              </form>
              <p
                className="text-blue-500 flex justify-center items-center text-base text-center mt-4 cursor-pointer"
                onClick={() => {
                  setActiveComponent("jobseeker");
                }}
              >
                Wait, I am a Jobseeker
                <FaArrowRight className="ml-1 mt-1 text-blue-500" />
              </p>
            </div>
          )}

          {activeComponent === "email" && (
            <div className="w-full max-w-sm">
              <h2
                className="font-bold text-3xl sm:text-4xl mb-4"
                style={{ color: "#102C57" }}
              >
                Welcome 👋
              </h2>
              <div className="mb-4">
                <input
                  onChange={handleEmailChange}
                  type="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Email"
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
              </div>
              <button
                className="w-full flex justify-center items-center text-white bg-slate-800 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onClick={handleNextClick}
              >
                Next
                <FaArrowRight className="ml-3" />
              </button>
              <p
                className="text-gray-600 text-sm text-center mt-4"
                onClick={() => {
                  setActiveComponent("login");
                }}
              >
                Already have an account?{" "}
                <span className="text-blue-400 text-base cursor-pointer">
                  Sign in
                </span>
              </p>
            </div>
          )}

          {activeComponent === "usertype" && (
            <div className="w-full max-w-sm">
              <h2
                className="font-bold text-3xl sm:text-4xl mb-4"
                style={{ color: "#102C57" }}
              >
                Welcome 👋
              </h2>
              <button
                onClick={() => {
                  setActiveComponent("jobseeker");
                }}
                className="w-full mb-6 border border-blue-400 hover:bg-blue-100 flex justify-center items-center text-lg text-blue-600 bg-white font-medium rounded-lg px-5 py-2.5 text-center"
              >
                Jobseeker
              </button>
              <button
                onClick={() => {
                  setActiveComponent("employer");
                }}
                className="w-full border border-blue-400 hover:bg-blue-100 flex justify-center items-center text-lg text-blue-600 bg-white font-medium rounded-lg px-5 py-2.5 text-center"
              >
                Employer
              </button>
              <p
                className="text-gray-600 text-sm text-center mt-4"
                onClick={() => {
                  setActiveComponent("login");
                }}
              >
                Already have an account?{" "}
                <span className="text-blue-400 text-base cursor-pointer">
                  Sign in
                </span>
              </p>
            </div>
          )}

          {activeComponent === "login" && (
            <div className="w-full max-w-sm">
              <h2
                className="font-bold text-3xl sm:text-4xl  mb-4"
                style={{ color: "#102C57" }}
              >
                Welcome Back👋
              </h2>
              <form onSubmit={LoginSubmit}>
                <div className="mb-4">
                  <input
                    type="text"
                    onChange={handleUsernameChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Username or Email"
                  />
                  {errors.username && (
                    <span className="text-red-500 text-xs">
                      {errors.username}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    onChange={handlePasswordChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Password"
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs">
                      {errors.password}
                    </span>
                  )}
                </div>
                {errors.form && (
                  <span className="text-red-500 text-xs mb-5">
                    {errors.form}
                  </span>
                )}
                <button
                  type="submit"
                  className="w-full mt-2 text-white  bg-slate-800 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Login
                </button>
              </form>
              <p
                className="text-gray-600 text-sm text-center mt-4"
                onClick={() => {
                  setActiveComponent("email");
                }}
              >
                Don't have an account?{" "}
                <span className="text-blue-400 text-base cursor-pointer">
                  Register
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
