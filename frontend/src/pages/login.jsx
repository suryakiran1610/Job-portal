import img1 from "./image1.jpeg";
import img2 from "./image1.png";
import React, { useState } from 'react'
import { FaArrowRight } from "react-icons/fa";



function Login() {
    const [activeComponent, setActiveComponent] = useState("email");

    
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
                            <form>
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Full Name" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <input 
                                        type="email" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Email" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <input 
                                        type="password" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Password" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Register
                                </button>
                            </form>
                            <p className="text-blue-500 flex justify-center items-center text-base text-center mt-4 cursor-pointer"
                                onClick={()=>{setActiveComponent('employer')}}
                            >
                                Wait,I am an employer
                                <FaArrowRight  className="ml-1 mt-1 text-blue-500"/>
                            </p>
                        </div>
                    )}


                    {activeComponent === 'employer' && (
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-4">Welcome Employer</h2>
                            <form>
                                <div className="mb-4">
                                    <input 
                                        type="text" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Company Name" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <input 
                                        type="email" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Email" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <input 
                                        type="password" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Password" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Register
                                </button>
                            </form>
                            <p className="text-blue-500 flex justify-center items-center text-base text-center mt-4 cursor-pointer"
                                onClick={()=>{setActiveComponent('jobseeker')}}
                            >
                                Wait,I am an Jobseeker
                                <FaArrowRight  className="ml-1 mt-1 text-blue-500"/>
                            </p>
                        </div>
                    )}


                    {activeComponent === 'email' && (
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-4">Welcome 👋</h2>
                            <div className="mb-4">
                                    <input 
                                        type="email" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Email" 
                                    />
                            </div>
                            <button 
                                className="w-full flex justify-center items-center text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                onClick={()=>{setActiveComponent('usertype')}}
                                >
                                    Next
                                    <FaArrowRight  className="ml-3"/>
                            </button>
                            <p className="text-gray-600 text-sm text-center mt-4" onClick={()=>{setActiveComponent('login')}}>
                                Already have an account? <span className="text-blue-400 text-base cursor-pointer">Sign in</span>
                            </p>
                        </div>
                    )} 


                    {activeComponent === 'usertype' &&(
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-4">Welcome 👋</h2>
                            <button 
                                onClick={()=>{setActiveComponent('jobseeker')}}
                                className="w-full  mb-6 border border-blue-400 hover:bg-blue-100 flex justify-center items-center text-lg text-blue-600 bg-white   font-medium rounded-lg  px-5 py-2.5 text-center"
                                >
                                    Jobseeker
                            </button>
                            <button 
                                onClick={()=>{setActiveComponent('employer')}}
                                className="w-full border border-blue-400 hover:bg-blue-100 flex justify-center items-center text-lg text-blue-600 bg-white font-medium rounded-lg  px-5 py-2.5 text-center"
                                >
                                    Employer
                            </button>
                            <p className="text-gray-600 text-sm text-center mt-4" onClick={()=>{setActiveComponent('login')}}>
                                Already have an account? <span className="text-blue-400 text-base cursor-pointer">Sign in</span>
                            </p>
                        </div>

                    )}


                    {activeComponent === 'login' && (
                        <div className="w-full max-w-sm">
                            <h2 className="font-bold text-3xl sm:text-4xl text-blue-600 mb-4">Welcome Back👋</h2>
                            <form>
                                <div className="mb-4">
                                    <input 
                                        type="email" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Email" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <input 
                                        type="password" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                                        placeholder="Password" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Login
                                </button>
                            </form>
                            <p className="text-gray-600 text-sm text-center mt-4" onClick={()=>{setActiveComponent('email')}}>
                                Don't have an account? <span className="text-blue-400 text-base cursor-pointer">Register</span>
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default Login;
