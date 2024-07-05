import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { SiTicktick } from "react-icons/si";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import { useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";


function EmployeeDetails() {
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [employeeData, setEmployeeData] = useState();
  const [isloading, setIsloading] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState({
    company_user_id: id,
    employee_name: "",
    employee_position: "",
    employee_phone_number: "",
    employee_email: "",
    employee_department: "",
  });
  const [departments, setDepartments] = useState([]);

  const [errors, setErrors] = useState({
    employee_name: "",
    employee_position: "",
    employee_phone_number: "",
    employee_email: "",
    employee_department: "",
  });

  useEffect(() => {
    setIsloading(true);
    const params = {
      user_id: id,
    };

    MakeApiRequest(
      "get",
      `${config.baseUrl}company/getcompanydepartment/`,
      {},
      params,
      {}
    )
      .then((response) => {
        console.log("depts", response);
        setDepartments(
          response.map((department) => ({
            value: department.department_name,
            label: department.department_name,
          }))
        );
        setIsloading(false);
      })
      .catch((error) => {});
  }, []);

  

  //adding
  const handleEmployeeSubmit = (e) => {
    e.preventDefault();
    const params = {
      user_id: id,
    };
    if (validateForm()) {
    MakeApiRequest(
      "post",
      `${config.baseUrl}company/companyemployee/`,
      {},
      params,
      employeeInfo
    )
      .then((response) => {
        console.log(response);
        setIsSubmitted(true);
        GetEmployeeDetailList();
        setEmployeeInfo({
            company_user_id: id,
            employee_name: "",
            employee_position: "",
            employee_phone_number: "",
            employee_email: "",
            employee_department: "",
        })
      })
      .catch((error) => {
        console.log(error)
      });
    }
  };

  const GetEmployeeDetailList = () => {
    const params = {
      user_id: id,
    };

    MakeApiRequest(
      "get",
      `${config.baseUrl}company/companyemployee/`,
      {},
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setEmployeeData(response);
      })
      .catch((error) => {});
  };

  

  useEffect(() => {
    GetEmployeeDetailList();
  }, []);


  function HandleEmployeeInfo(e) {
    const { name, value } = e.target;
    setEmployeeInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  }

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
        case "employee_name":
          if (!value.trim()) {
            errorMessage = "Employee name is required.";
          }
          break;
        case "employee_position":
          if (!value.trim()) {
            errorMessage = "Employee position is required.";
          }
          break;
        case "employee_phone_number":
          if (!value.trim()) {
            errorMessage = "Employee phone number is required.";
          }
          break;
        case "employee_email":
          if (!value.trim()) {
            errorMessage = "Employee email is required.";
          }
          break;
        case "employee_department":
          if (!value.trim()) {
            errorMessage = "Employee department is required.";
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
            employee_name: "",
            employee_position: "",
            employee_phone_number: "",
            employee_email: "",
            employee_department: "",
        };
    
        if (!employeeInfo. employee_name || !employeeInfo.employee_name.trim()) {
          newErrors.employee_name = "Employee name is required.";
          isValid = false;
        }
        if (!employeeInfo.employee_position || !employeeInfo.employee_position.trim()) {
          newErrors.employee_position = "Employee position is required.";
          isValid = false;
        }
        if (
          !employeeInfo.employee_phone_number ||
          !employeeInfo.employee_phone_number.trim()
        ) {
          newErrors.employee_phone_number = "Employee phone number is required.";
          isValid = false;
        }
        if (!employeeInfo.employee_email || !employeeInfo.employee_email.trim()) {
          newErrors.employee_email = "Employee email is required.";
          isValid = false;
        }
        if (!employeeInfo.employee_department || !employeeInfo.employee_department.trim()) {
          newErrors.employee_department = "Employee department is required.";
          isValid = false;
        }    
        setErrors(newErrors);
        return isValid;
      };

     const navigatetonext=()=> {
        if (isSubmitted) {
            setMessage(true)
        const redirectTimer = setTimeout(() => {
            window.location.href = "/";
        }, 5000);

        return () => clearTimeout(redirectTimer);
        }
        else {
            setMessage("Provide Employee Details to Continue");
            setTimeout(() => {
              setMessage("");
            }, 2000);
        }
    }

 

  return (
    <>
    {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (  
      <div className="px-4 py-1 sm:px-6 lg:px-8">
        <div className=" text-center text-2xl font-bold mb-6">
          Employee Details
        </div>
        <div className="flex flex-col lg:flex-row justify-evenly">
          <div className="flex flex-1 flex-col p-1 lg:pr-8">
            <div className="text-start font-bold text-blue-800 mb-3">
              Add Employee
            </div>
            <div>
              <label className="flex flex-col gap-1 text-xs mt-4 mb-2">
                Employee Name
                <input
                  type="text"
                  name="employee_name"
                  onChange={HandleEmployeeInfo}
                  value={employeeInfo.employee_name}
                  className="border border-gray-300 w-64 h-8 ml-2"
                />
                {errors.employee_name && (
                  <span className="error-message text-red-700 mt-1">
                    {errors.employee_name}
                  </span>
                )}
              </label>
              <label className="flex flex-col  gap-1 text-xs  relative mb-2">
                Employee Position
                <input
                  type="text"
                  name="employee_position"
                  onChange={HandleEmployeeInfo}
                  value={employeeInfo.employee_position}
                  className="border border-gray-300 w-64 h-8 ml-2"
                />
                {errors.employee_position && (
                  <span className="error-message text-red-700 mt-1">
                    {errors.employee_position}
                  </span>
                )}
              </label>
            </div>
            <div>
              <label className="flex flex-col  gap-1 text-xs mb-2">
                Employee Email
                <input
                  type="text"
                  name="employee_email"
                  onChange={HandleEmployeeInfo}
                  value={employeeInfo.employee_email}
                  className="border border-gray-300 w-64 h-8 ml-2"
                />
                {errors.employee_email && (
                  <span className="error-message text-red-700 mt-1">
                    {errors.employee_email}
                  </span>
                )}
              </label>
              <label className="flex flex-col  gap-1 text-xs mb-2">
                Phone
                <div className="flex gap-3">
                <div className='flex justify-center items-center text-base border bg-white border-gray-300 w-14 h-8 ml-2'>+91</div>
                  <input
                    type="number"
                    name="employee_phone_number"
                    onChange={HandleEmployeeInfo}
                    value={employeeInfo.employee_phone_number}
                    className="border border-gray-300 w-60  h-8 "
                  />
                </div>
                {errors.employee_phone_number && (
                  <span className="error-message text-red-700 mt-1">
                    {errors.employee_phone_number}
                  </span>
                )}
              </label>
            </div>
            <label className="flex flex-col  gap-1 text-xs mb-2 mt-3">
                Department of Working
            <div className=" flex max-sm:flex-col">
              <div>
                <CreatableSelect
                  isClearable
                  className="w-60 h-8"
                  options={departments}
                  onChange={(selectedOption) => {
                    const departmentValue = selectedOption
                      ? selectedOption.value
                      : "";
                    setEmployeeInfo((prevState) => ({
                      ...prevState,
                      employee_department: departmentValue,
                    }));
                  }}
                />
              </div>
            </div>
            </label>
            {errors.employee_department && (
                  <span className="error-message text-red-700 mt-1 text-xs">
                    {errors.employee_department}
                  </span>
                )}
            <div>    
            <button
                onClick={handleEmployeeSubmit}
                className="ml-4 mt-7 bg-slate-800 hover:bg-slate-900 text-white self-end px-3 py-1 rounded-lg"
              >
                {" "}
                Add Employee
            </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-1 lg:pl-8">
            {employeeData &&
              employeeData.map((employee, index) => (
                <div className=" text-left mb-4" key={index}>
                  <div>Name: {employee.employee_name}</div>
                  <div className=" text-sm">
                    Position: {employee.employee_position}
                  </div>
                  <div className="flex gap-3">
                    <div className=" text-xs">
                      {employee.employee_phone_number}
                    </div>
                    <div className=" text-xs">{employee.employee_email}</div>
                    <div className=" text-xs">
                      {employee.employee_department}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className=" flex justify-center">
          <button
            className="continue-btn  px-5 py-2 mt-1 text-white "
            style={{ backgroundColor: "#A91D3A" }}
            onClick={navigatetonext}
          >
            Continue &nbsp;&nbsp;
            <FontAwesomeIcon icon={faArrowRight} color="white" />
          </button>
        </div>
        {message && <div className="text-red-500 mt-4">{message}</div>}
      </div>
      )}
      {success && (
        <div className="success-bg-main absolute w-full h-full top-0 flex justify-center items-center">
          <div className="success-box flex flex-col items-center w-10/12 md:w-6/12 bg-white rounded-lg max-sm:w-10/12">
            <div className=" mt-10">
            <SiTicktick  className="text-8xl text-green-600"/>
            </div>
            <div className=" text-3xl font-semibold text-sky-900 mt-5">
              Profile created!
            </div>
            <div className=" text-1xl font-semibold text-sky-900 mt-5">
              Get ready for exciting job opportunities ahead
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeDetails;
