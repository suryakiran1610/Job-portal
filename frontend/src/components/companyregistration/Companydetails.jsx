import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faUpload } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import Creatable from "react-select/creatable";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { SiTicktick } from "react-icons/si";
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";

function CompanyDetails({ companyName }) {
  const { id } = useParams();
  const [success, setSuccess] = useState(false);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companyDepartments, setCompanyDepartments] = useState([]);
  const [rows, setRows] = useState([
    { companyType: null, companyDepartments: null },
  ]);
  const [errors, setErrors] = useState([
    { companyType: "", companyDepartments: "" },
  ]);
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    setIsloading(true);
    const fetchSectors = MakeApiRequest(
      "get",
      `${config.baseUrl}company/getcompanysector/`,
      {},
      {},
      {}
    )
      .then((response) => {
        console.log("Sectorall", response);
        setCompanyTypes(
          response.map((sector) => ({
            value: sector.sector_name,
            label: sector.sector_name,
          }))
        );
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

    const fetchDepartments = MakeApiRequest(
      "get",
      `${config.baseUrl}company/getdepartments/`,
      {},
      {},
      {}
    )
      .then((response) => {
        console.log("departmentsall", response);
        setCompanyDepartments(
          response.map((department) => ({
            value: department.name,
            label: department.name,
          }))
        );
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

    Promise.all([fetchSectors, fetchDepartments]).then(() => {
      setIsloading(false);
    });
  }, []);


  const addNewRow = () => {
    setRows([...rows, { companyType: null, companyDepartments: null }]);
    setErrors([...errors, { companyType: "", companyDepartments: "" }]);
  };

  const removeRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);

    const updatedErrors = [...errors];
    updatedErrors.splice(index, 1);
    setErrors(updatedErrors);
  };

  const handleCompanyTypeChange = (selectedOption, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].companyType = selectedOption;
    setRows(updatedRows);

    const updatedErrors = [...errors];
    updatedErrors[rowIndex].companyType = selectedOption
      ? ""
      : "Company type is required";
    setErrors(updatedErrors);
  };

  const handleCompanyDepartmentsChange = (selectedOptions, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].companyDepartments = selectedOptions;
    setRows(updatedRows);

    const updatedErrors = [...errors];
    updatedErrors[rowIndex].companyDepartments =
      selectedOptions && selectedOptions.length > 0
        ? ""
        : "Company department is required";
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
    return newErrors.every((rowError) => Object.keys(rowError).length === 0);
  };

  const SubmitSecDep = () => {
    if (!validateRows()) {
      return;
    }

    const userData = {
      user_id: id,
      companyname:companyName,
      sectors: [],
      departments: [],
    };

    rows.forEach((row) => {
      if (row.companyType && row.companyDepartments) {
        const sectorName = row.companyType.label;
        const departmentNames = row.companyDepartments.map((dep) => dep.label);

        if (!userData.sectors.includes(sectorName)) {
          userData.sectors.push(sectorName);
        }

        departmentNames.forEach((departmentName) => {
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
        setSuccess(true);
      })
      .catch((error) => {
        // Handle any errors
      });
  };

  useEffect(() => {
    if (success) {
      const redirectTimer = setTimeout(() => {
        window.location.href = "/";
      }, 5000);

      return () => clearTimeout(redirectTimer);
    }
  }, [success]);

  return (
    <>
      {isloading ? (
        <div
          className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
          style={{ backgroundColor: "#EEEEEE" }}
        >
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
           ) : (
            <div className="min-h-screen bg-gray-200">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center text-2xl font-semibold text-primary_blue mb-6">
                Company Sectors and Departments
                </div>
                <div className="space-y-6">
                  {rows.map((row, index) => (
                    <div
                      className="flex flex-col sm:flex-row gap-4 md:px-11 lg:px-11"
                      key={index}
                    >
                      <label className="flex flex-col w-full sm:w-1/2 ">
                        <span className="text-xs font-semibold mb-2">
                          Company Sector
                        </span>
                        <Creatable
                          value={row.companyType}
                          onChange={(selectedOption) =>
                            handleCompanyTypeChange(selectedOption, index)
                          }
                          options={companyTypes}
                        />
                        {errors[index]?.companyType && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors[index].companyType}
                          </span>
                        )}
                      </label>
                      <label className="flex flex-col w-full sm:w-1/2 ">
                        <span className="text-xs font-semibold mb-2">
                          Company Departments
                        </span>
                        <Creatable
                          value={row.companyDepartments}
                          onChange={(selectedOptions) =>
                            handleCompanyDepartmentsChange(selectedOptions, index)
                          }
                          options={companyDepartments}
                          isMulti
                        />
                        {errors[index]?.companyDepartments && (
                          <span className="text-red-500 text-xs mt-1">
                            {errors[index].companyDepartments}
                          </span>
                        )}
                      </label>
                      <button
                        className="bg-primary_blue text-black px-4 py-2 rounded-lg self-end mt-4"
                        onClick={() => removeRow(index)}
                      >
                        <FaMinusCircle className="text-lg" />
                      </button>
                    </div>
                  ))}
                  <button
                    className="bg-primary_blue text-black px-4 py-2 rounded-lg self-end mt-4"
                    onClick={addNewRow}
                  >
                    <FaPlusCircle className="text-lg" />
                  </button>
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    style={{ backgroundColor: "#A91D3A" }}
                    className="continue-btn px-5 py-2 text-white rounded-lg"
                    onClick={SubmitSecDep}
                  >
                    Add Sector
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

      {success && (
        <div className="success-bg-main fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75">
          <div className="success-box flex flex-col items-center w-10/12 md:w-6/12 lg:w-4/12 bg-white rounded-lg p-5">
            <div className="mt-5">
              <SiTicktick className="text-8xl text-green-600" />
            </div>
            <div className="text-2xl font-semibold text-sky-900 mt-5">
              Profile created!
            </div>
            <div className="text-lg font-semibold text-sky-900 mt-5 text-center">
              Get ready for exciting job opportunities ahead
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompanyDetails;
