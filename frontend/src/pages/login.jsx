import img1 from "./image1.jpeg";
import img2 from "./image1.png";
import React, { useEffect, useState } from 'react'
import { FaArrowRight } from "react-icons/fa";
import MakeApiRequest from "../Functions/AxiosApi";
import config from "../Functions/config";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {
    const [activeComponent, setActiveComponent] = useState("email");
    const [errors, setErrors] = useState({});
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [companyname, setCompanyname] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState([]);
    const headers = {
        'Content-Type': 'application/json'
    }

    useEffect(() => {
        MakeApiRequest('get', `${config.baseUrl}authentication/users/`, headers, {})
            .then(response => {
                console.log(response);
                setUsers(response); 
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const JobseekerSubmit = (e) => {
        e.preventDefault();
        const data = {
            email,
            password,
            username,
            usertype: 'jobseeker',
        };

        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (!username) newErrors.username = 'Username is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        MakeApiRequest('post', `${config.baseUrl}authentication/register/`, headers, data)
            .then(response => {
                console.log(response);
                setActiveComponent('login');

            })
            .catch(error => {
                console.error('Error during registration:', error);
            });
    };

    const EmployerSubmit = (e) => {
        e.preventDefault();
        const data = {
            email,
            password,
            companyname,
            username,
            usertype: 'employer',
        };

        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        if (!password) newErrors.password = 'Password is required';
        if (!companyname) newErrors.companyname = 'Company Name is required';
        if (!username) newErrors.username = 'Username is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        MakeApiRequest('post', `${config.baseUrl}authentication/register/`, headers, data)
            .then(response => {
                console.log(response);
                setActiveComponent('login');

            })
            .catch(error => {
                console.error('Error during registration:', error);
            });
    };

    const LoginSubmit = (e) => {
        e.preventDefault();
        const data={
            "username":username,
            "password":password
        }

        const newErrors = {};
        if (!username) newErrors.username = 'Username is required';
        if (!password) newErrors.password = 'Password is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        MakeApiRequest('post', `${config.baseUrl}authentication/login/`, headers, data)
            .then(response => {
                console.log(response);
                    const token = response.token;
                    const decoded = jwtDecode(token);
                    if(decoded.user_type === "superuser") {
                        console.log("admin login Successful");
                        Cookies.set("token", response.token);
                    } else if(decoded.user_type === "jobseeker") {
                        console.log("jobseeker login Successful");
                        Cookies.set("token", response.token);
                    } else if(decoded.user_type === "employer") {
                        console.log("employer login Successful");
                        Cookies.set("token", response.token);
                    } 
            })
            .catch(error => {
                console.error('Error during login:', error);
            });
    };

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        if (!emailValue) {
            setErrors(prev => ({ ...prev, email: 'Email is required' }));
        } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
            setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
        } else if (users.some(user => user.email === emailValue)) {
            setErrors(prev => ({ ...prev, email: 'Email already exists' }));
        } else {
            setErrors(prev => {
                const { email, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleUsernameChange = (e) => {
        const usernameValue = e.target.value;
        setUsername(usernameValue);
    
        const newErrors = { ...errors };
        if (!usernameValue) {
            newErrors.username = 'Username is required';
        } else {
            delete newErrors.username;
        }
        setErrors(newErrors);
    };
    
    const handlePasswordChange = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);
    
        const newErrors = { ...errors };
        if (!passwordValue) {
            newErrors.password = 'Password is required';
        } else {
            delete newErrors.password;
        }
        setErrors(newErrors);
    };
    
    const handleCompanynameChange = (e) => {
        const companynameValue = e.target.value;
        setCompanyname(companynameValue);
    
        const newErrors = { ...errors };
        if (!companynameValue) {
            newErrors.companyname = 'Company Name is required';
        } else {
            delete newErrors.companyname;
        }
        setErrors(newErrors);
    };

    const handleNextClick = () => {
        if (!email) {
            setErrors(prev => ({ ...prev, email: 'Email is required' }));
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
        } else if (users.some(user => user.email === email)) {
            setErrors(prev => ({ ...prev, email: 'Email already exists' }));
        } else {
            setErrors({});
            setActiveComponent('usertype');
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-200 flex items-center justify-center p-4">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center bg-green-600 p-4">
                    <img src={img2} alt="JobFind" className="w-full h-auto object-contain" />
                </div>

                <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-4 md:p-8">

                    {activeComponent === 'jobseeker' && (
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-4">Welcome Jobseeker</h2>
                            <p className="text-sm text-gray-400 mb-4">Signing up as <span className="text-base text-black">{email}</span><span className="text-base text-blue-400 cursor-pointer" onClick={() => { setActiveComponent('email') }}>(not you?)</span></p>
                            <form onSubmit={JobseekerSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        onChange={handleUsernameChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Username"
                                    />
                                    {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="password"
                                        onChange={handlePasswordChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Password"
                                    />
                                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Register
                                </button>
                            </form>
                            <p className="text-blue-500 flex justify-center items-center text-base text-center mt-4 cursor-pointer"
                                onClick={() => { setActiveComponent('employer') }}
                            >
                                Wait, I am an employer
                                <FaArrowRight className="ml-1 mt-1 text-blue-500" />
                            </p>
                        </div>
                    )}

                    {activeComponent === 'employer' && (
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-2">Welcome Employer</h2>
                            <p className="text-sm text-gray-400 mb-4">Signing up as <span className="text-base text-black">{email}</span><span className="text-base text-blue-400 cursor-pointer" onClick={() => { setActiveComponent('email') }}>(not you?)</span></p>
                            <form onSubmit={EmployerSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        onChange={handleCompanynameChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Company Name"
                                    />
                                    {errors.companyname && <span className="text-red-500 text-xs">{errors.companyname}</span>}
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        onChange={handleUsernameChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Username"
                                    />
                                    {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                                </div>

                                <div className="mb-4">
                                    <input
                                        type="password"
                                        onChange={handlePasswordChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Password"
                                    />
                                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Register
                                </button>
                            </form>
                            <p className="text-blue-500 flex justify-center items-center text-base text-center mt-4 cursor-pointer"
                                onClick={() => { setActiveComponent('jobseeker') }}
                            >
                                Wait, I am a Jobseeker
                                <FaArrowRight className="ml-1 mt-1 text-blue-500" />
                            </p>

                        </div>
                    )}

                    {activeComponent === 'email' && (
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-4">Welcome 👋</h2>
                            <div className="mb-4">
                                <input
                                    onChange={handleEmailChange}
                                    type="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Email"
                                />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                            </div>
                            <button
                                className="w-full flex justify-center items-center text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                onClick={handleNextClick}
                            >
                                Next
                                <FaArrowRight className="ml-3" />
                            </button>
                            <p className="text-gray-600 text-sm text-center mt-4" onClick={() => { setActiveComponent('login') }}>
                                Already have an account? <span className="text-blue-400 text-base cursor-pointer">Sign in</span>
                            </p>
                        </div>
                    )}

                    {activeComponent === 'usertype' && (
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-4">Welcome 👋</h2>
                            <button
                                onClick={() => { setActiveComponent('jobseeker') }}
                                className="w-full mb-6 border border-blue-400 hover:bg-blue-100 flex justify-center items-center text-lg text-blue-600 bg-white font-medium rounded-lg px-5 py-2.5 text-center"
                            >
                                Jobseeker
                            </button>
                            <button
                                onClick={() => { setActiveComponent('employer') }}
                                className="w-full border border-blue-400 hover:bg-blue-100 flex justify-center items-center text-lg text-blue-600 bg-white font-medium rounded-lg px-5 py-2.5 text-center"
                            >
                                Employer
                            </button>
                            <p className="text-gray-600 text-sm text-center mt-4" onClick={() => { setActiveComponent('login') }}>
                                Already have an account? <span className="text-blue-400 text-base cursor-pointer">Sign in</span>
                            </p>
                        </div>
                    )}

                    {activeComponent === 'login' && (
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-4">Welcome Back👋</h2>
                            <form onSubmit={LoginSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        onChange={(e) => { setUsername(e.target.value) }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Username"
                                    />
                                    {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="password"
                                        onChange={(e) => { setPassword(e.target.value) }}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Password"
                                    />
                                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Login
                                </button>
                            </form>
                            <p className="text-gray-600 text-sm text-center mt-4" onClick={() => { setActiveComponent('email') }}>
                                Don't have an account? <span className="text-blue-400 text-base cursor-pointer">Register</span>
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Login;
