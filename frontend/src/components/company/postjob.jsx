import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyNavbar from "../navbars/companynavbar";


function Postjob({ setActiveComponent }) {
  const [errors,setErrors]=useState({})
  const token=Cookies.get('token')
  const [message, setMessage] = useState("");
  const userdetails=JSON.parse(localStorage.getItem("user"))
  const [jobcategory,setJobcategory]=useState([])
  const [salaryError, setSalaryError] = useState("");
  const navigate = useNavigate();
  const [jobdetails, setJobdetails] = useState({
    company_user_id:userdetails.id,
    jobtitle: "",
    jobcategory: "",
    jobnature: "",
    jobvacancy: "",
    jobsalary: "",
    joblocation: "",
    jobdescription: "",
    jobresponsibility: "",
    jobqualification: "",
    jobexperiance: "",
    jobkeywords: "",
    companyname: "",
    companylocation: "",
    companywebsite: "",
    joblocationstate:"",
  });

  const headers = {
    'Authorization': `Bearer ${token}`
  }

  useEffect(()=>{

    MakeApiRequest('get',`${config.baseUrl}company/jobcategory/`,headers,{},{})
    .then(response => {
        console.log(response)
        setJobcategory(response)
    })
    .catch(error => {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
          console.log('Unauthorized access. Token might be expired or invalid.');
      } else {
          console.error('Unexpected error occurred:', error);
      }
    });

  },[])
  


  function Handlejobdetails(e) {
    const { name, value } = e.target;
    setJobdetails((prevState) => ({
        ...prevState,
        [name]: value,
    }));

    const newErrors = { ...errors };
        if (!value.trim()) {
            newErrors[name] = `${name} is required`;
        } else {
            delete newErrors[name];
        }
        setErrors(newErrors);

    if (name === 'jobsalary') {
        if (Number(value) < 20000) {
          setSalaryError("Salary should be greater than 20000");
        } else {
          setSalaryError("");
        }
    }
  }

  const validateFields = () => {
    const newErrors = {};
    Object.keys(jobdetails).forEach(key => {
      const value = jobdetails[key];
      if (typeof value === "string" && !value.trim()) {
        newErrors[key] = `${key} is required`;
      } else if (typeof value !== "string" && !value) {
        newErrors[key] = `${key} is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(token)
    
    
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0 || salaryError) {
        setErrors(validationErrors);
        return;
    }

    const formData = new FormData();
    for(let key in jobdetails) {
        formData.append(key, jobdetails[key]);
    }

    MakeApiRequest('post', `${config.baseUrl}company/postjob/`, headers, {},formData)
        .then(response => {
            console.log(response)
            setMessage("Job Posted successfully");
            setTimeout(() => {
              navigate("/employer/myjobs");
            console.log("Redirecting to myjobs component");
        }, 1500);
        })
        .catch(error => {
          console.error('Error:', error);
          if (error.response && error.response.status === 401) {
              console.log('Unauthorized access. Token might be expired or invalid.');
          } else {
              console.error('Unexpected error occurred:', error);
          }
      });
  };




  return (
    <div>
      <CompanyNavbar/>
      <div style={{ backgroundColor: "#EEEEEE" }}>
      <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" >
        <div className="bg-white rounded-xl shadow p-4 sm:p-7 dark:bg-neutral-900">
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
              <div className="sm:col-span-12">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                  Job Details
                </h2>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Title
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="text"
                  onChange={Handlejobdetails}
                  name='jobtitle'
                  value={jobdetails.jobtitle}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Job Title"
                />
                {errors.jobtitle && <span className="text-red-500 text-xs">{errors.jobtitle}</span>}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Category
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <select
                  onChange={Handlejobdetails}
                  name='jobcategory'
                  value={jobdetails.jobcategory}
                  id="af-submit-app-category"
                  className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                >
                  <option>Select a category</option>
                  {jobcategory.map((category,index)=>(
                    <option key={index} value={category.jobcategory}>{category.jobcategory}</option>
                  ))}
                </select>
                {errors.jobcategory && <span className="text-red-500 text-xs">{errors.jobcategory}</span>}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Job Nature
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <select
                  onChange={Handlejobdetails}
                  name='jobnature'
                  value={jobdetails.jobnature}
                  id="af-submit-app-category"
                  className="py-2 px-3 pe-9 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                >
                  <option>Select Job Nature</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Work from Home</option>
                  <option>Hybrid</option>
                  <option>Internship</option>
                </select>
                {errors.jobnature && <span className="text-red-500 text-xs">{errors.jobnature}</span>}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Vacancy
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="number"
                  onChange={Handlejobdetails}
                  name='jobvacancy'
                  value={jobdetails.jobvacancy}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Vacancy"
                />
                {errors.jobvacancy && <span className="text-red-500 text-xs">{errors.jobvacancy}</span>}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Salary
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="number"
                  onChange={Handlejobdetails}
                  name='jobsalary'
                  value={jobdetails.jobsalary}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Salary"
                />
                {salaryError && <span className="text-red-500 text-xs mr-2">{salaryError}</span>}
                {errors.jobsalary && <span className="text-red-500 text-xs ml-2">{errors.jobsalary}</span>}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Location
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="text"
                  onChange={Handlejobdetails}
                  name='joblocation'
                  value={jobdetails.joblocation}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Location"
                />
                {errors.joblocation && <span className="text-red-500 text-xs">{errors.joblocation}</span>}
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  State
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="text"
                  onChange={Handlejobdetails}
                  name='joblocationstate'
                  value={jobdetails.joblocationstate}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="State"
                />
                {errors.joblocationstate && <span className="text-red-500 text-xs">{errors.joblocationstate}</span>}
              </div>

            </div>

            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label
                    htmlFor="af-submit-application-bio"
                    className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                  >
                    Description
                    <span className="text-red-700"> *</span>
                  </label>
                </div>
              </div>
              <div className="sm:col-span-9">
                <textarea
                  onChange={Handlejobdetails}
                  name='jobdescription'
                  value={jobdetails.jobdescription}
                  id="af-submit-application-bio"
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  rows="6"
                  placeholder="Description"
                ></textarea>
                {errors.jobdescription && <span className="text-red-500 text-xs">{errors.jobdescription}</span>}
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label
                    htmlFor="af-submit-application-bio"
                    className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                  >
                    Responsibility
                    <span className="text-red-700"> *</span>
                  </label>
                </div>
              </div>
              <div className="sm:col-span-9">
                <textarea
                  onChange={Handlejobdetails}
                  name='jobresponsibility'
                  value={jobdetails.jobresponsibility}
                  id="af-submit-application-bio"
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  rows="6"
                  placeholder="Responsibility"
                ></textarea>
                {errors.jobresponsibility && <span className="text-red-500 text-xs">{errors.jobresponsibility}</span>}
              </div>

              <div className="sm:col-span-3">
                <div className="inline-block">
                  <label
                    htmlFor="af-submit-application-bio"
                    className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                  >
                    Qualifications
                    <span className="text-red-700"> *</span>
                  </label>
                </div>
              </div>
              <div className="sm:col-span-9">
                <textarea
                  onChange={Handlejobdetails}
                  name='jobqualification'
                  value={jobdetails.jobqualification}
                  id="af-submit-application-bio"
                  className="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  rows="6"
                  placeholder="Qualifications"
                ></textarea>
                {errors.jobqualification && <span className="text-red-500 text-xs">{errors.jobqualification}</span>}
              </div>
            </div>

            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Experience
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="number"
                  onChange={Handlejobdetails}
                  name='jobexperiance'
                  value={jobdetails.jobexperiance}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Experience"
                />
                {errors.jobexperiance && <span className="text-red-500 text-xs">{errors.jobexperiance}</span>}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Keywords
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="text"
                  onChange={Handlejobdetails}
                  name='jobkeywords'
                  value={jobdetails.jobkeywords}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Keywords"
                />
                {errors.jobkeywords && <span className="text-red-500 text-xs">{errors.jobkeywords}</span>}
              </div>
            </div>

            <div className="grid sm:grid-cols-12 gap-2 sm:gap-4 py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
              <div className="sm:col-span-12">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-200">
                  Company Details
                  <span className="text-red-700"> *</span>
                </h2>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Name
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="text"
                  onChange={Handlejobdetails}
                  name='companyname'
                  value={jobdetails.companyname}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Name"
                />
                {errors.companyname && <span className="text-red-500 text-xs">{errors.companyname}</span>}
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-email"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  Location
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-email"
                  type="text"
                  onChange={Handlejobdetails}
                  name='companylocation'
                  value={jobdetails.companylocation}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Location"
                />
                {errors.companylocation && <span className="text-red-500 text-xs">{errors.companylocation}</span>}
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="af-submit-application-other-website"
                  className="inline-block text-sm font-medium text-gray-500 mt-2.5 dark:text-neutral-500"
                >
                  website
                  <span className="text-red-700"> *</span>
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-submit-application-other-website"
                  type="text"
                  onChange={Handlejobdetails}
                  name='companywebsite'
                  value={jobdetails.companywebsite}
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Website"
                />
                {errors.companywebsite && <span className="text-red-500 text-xs">{errors.companywebsite}</span>}
              </div>
            </div>

            <div className="py-8 first:pt-0 last:pb-0 border-t first:border-transparent border-gray-200 dark:border-neutral-700 dark:first:border-transparent">
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent  bg-slate-800 hover:bg-teal-800 text-white  disabled:opacity-50 disabled:pointer-events-none"
              >
                Submit Job
              </button>
              {message &&
                (message === "Job Posted successfully" ? (
                  <div
                    className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                    role="alert"
                  >
                    <span className="font-bold">Success:</span> Job Posted
                    successfully.
                  </div>
                ) : null
                  
                )}
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Postjob;
