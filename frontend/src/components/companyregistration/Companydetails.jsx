import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faUpload } from '@fortawesome/free-solid-svg-icons'
import Select from 'react-select';
import Creatable from 'react-select/creatable';
import config from '../../Functions/config';
import MakeApiRequest from '../../Functions/AxiosApi';
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";



function CompanyDetails({ setActiveComponent }) {
    const [file, setFile] = useState();
    const { id } = useParams();
    const [details, setDetails] = useState(true);
    const [selectedCompanyType, setSelectedCompanyType] = useState(null);
    const [selectedCompanyDepartment, setSelectedCompanyDepartment] = useState(null);
    const [companyTypes, setCompanyTypes] = useState([]);
    const [companyDepartments, setCompanyDepartments] = useState([]);
    const [rows, setRows] = useState([{ companyType: null, companyDepartments: null }]);
    const [errors, setErrors] = useState([{ companyType: "", companyDepartments: "" }]);
    const [isloading, setIsloading] = useState(false);



    useEffect(() => {
        setIsloading(true)
        const fetchSectors = MakeApiRequest(
          "get",
          `${config.baseUrl}company/getcompanysector/`,
          {},
          {},
          {}
        )
          .then((response) => {
            console.log("Sectorall", response);
            setCompanyTypes(response.map(sector => ({ value: sector.sector_name, label: sector.sector_name })));
          })
          .catch((error) => {
            console.error("Error:", error);
            if (error.response && error.response.status === 401) {
              console.log("Unauthorized access. Token might be expired or invalid.");
            } else {
              console.error("Unexpected error occurred:", error);
            }
          });
    
        const fetchDepartments = MakeApiRequest(
          "get",
          `${config.baseUrl}company/getdepartments/`,
          {},
          {},
          {}
        )
          .then((response) => {
            console.log("departmentsall", response);
            setCompanyDepartments(response.map(department => ({ value: department.name, label: department.name })));
          })
          .catch((error) => {
            console.error("Error:", error);
            if (error.response && error.response.status === 401) {
              console.log("Unauthorized access. Token might be expired or invalid.");
            } else {
              console.error("Unexpected error occurred:", error);
            }
          });
    
        Promise.all([fetchSectors, fetchDepartments]).then(() => {
            setIsloading(false);
        });
      }, []);

    function HandleNextDetails() {
        setDetails(false)
    }

    function handleChange(e) {
        setFile(URL.createObjectURL(e.target.files[0]));
    }

    const createOption = (inputValue) => ({
        label: inputValue,
        value: inputValue,
    });

    const addNewRow = () => {
        setRows([...rows, { companyType: null, companyDepartments: null }]);
        setErrors([...errors, { companyType: "", companyDepartments: "" }]);
    };

    const handleCompanyTypeChange = (selectedOption, rowIndex) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex].companyType = selectedOption;
        setRows(updatedRows);

        const updatedErrors = [...errors];
        updatedErrors[rowIndex].companyType = selectedOption ? "" : "Company type is required";
        setErrors(updatedErrors);
    };

    const handleCompanyDepartmentsChange = (selectedOptions, rowIndex) => {
        const updatedRows = [...rows];
        updatedRows[rowIndex].companyDepartments = selectedOptions;
        setRows(updatedRows);

        const updatedErrors = [...errors];
        updatedErrors[rowIndex].companyDepartments = selectedOptions && selectedOptions.length > 0 ? "" : "Company department is required";
        setErrors(updatedErrors);
    };

    const validateRows = () => {
        const newErrors = rows.map((row) => {
            const rowErrors = {};
            if (!row.companyType) {
                rowErrors.companyType = "Company type is required";
            }
            if (!row.companyDepartments || row.companyDepartments.length === 0) {
                rowErrors.companyDepartments = "Company department is required";
            }
            return rowErrors;
        });
        setErrors(newErrors);
        return newErrors.every(rowError => Object.keys(rowError).length === 0);
    };

    

    const SubmitSecDep = () => {
        if (!validateRows()) {
            return;
        }

        const userData = {
            user_id:id,
            sectors: [],
            departments: [],
        };

        rows.forEach(row => {
            if (row.companyType && row.companyDepartments) {
                const sectorName = row.companyType.label;
                const departmentNames = row.companyDepartments.map(dep => dep.label);

                if (!userData.sectors.includes(sectorName)) {
                    userData.sectors.push(sectorName);
                }

                departmentNames.forEach(departmentName => {
                    userData.departments.push({
                        sector_name: sectorName,
                        department_name: departmentName,
                    });
                });
            }
        });

        MakeApiRequest(
            "post",
            `${config.baseUrl}company/updatesectoranddepartments/`,
            {},
            {},
            userData
          )
            .then((response) => {
              console.log(response);
              setActiveComponent("employeedetails");
            })
            .catch((error) => {
              // Handle any errors
            });
    }

    return (
        <>
        {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (  
                <div>
                    <div className='text-center text-2xl font-semibold text-primary_blue'>Company Sectors and Departments</div>
                    <div className='flex justify-evenly pt-4 max-sm:flex-col-reverse max-sm:px-5'>
                        <div>
                            <div className='flex flex-col'>
                                {rows.map((row, index) => (
                                    <div className='flex w-full gap-5' key={index}>
                                        <label className='flex flex-col gap-1 text-xs mt-4'>
                                            Company Sector
                                            <Creatable
                                                value={row.companyType}
                                                onChange={(selectedOption) => handleCompanyTypeChange(selectedOption, index)}
                                                options={companyTypes}
                                            />
                                            {errors[index]?.companyType && <span className="text-red-500 text-xs">{errors[index].companyType}</span>}
                                        </label>
                                        <label className='flex flex-col gap-1 text-xs mt-4'>
                                            Company Departments
                                            <Creatable
                                                value={row.companyDepartments}
                                                onChange={(selectedOptions) => handleCompanyDepartmentsChange(selectedOptions, index)}
                                                options={companyDepartments}
                                                isMulti
                                            />
                                            {errors[index]?.companyDepartments && <span className="text-red-500 text-xs">{errors[index].companyDepartments}</span>}
                                        </label>
                                    </div>
                                ))}
                                <button className='bg-primary_blue text-black w-10 rounded-lg self-end mt-3' onClick={addNewRow}>+</button>
                            </div>
                            <div 
                            style={{ backgroundColor: "#A91D3A" }}
                            className="continue-btn float-right px-5 py-2 mt-6 text-white" 
                            onClick={SubmitSecDep}>
                            Continue 
                            <FontAwesomeIcon icon={faArrowRight} className='text-white ml-2' color='#ffffff' /></div>
                        </div>
                    </div>
                </div>
      )}
        </>
    )
}

export default CompanyDetails;
