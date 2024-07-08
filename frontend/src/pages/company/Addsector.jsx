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
import CompanyNavbar from "../../components/navbars/companynavbar";
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";


function Addsector() {
  const [isLoading, setIsLoading] = useState(false);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [companyTypes, setCompanyTypes] = useState([]);
  const [deptSectors, setDeptSectors] = useState([]);
  const token = Cookies.get("token");
  const [companyDepartments, setCompanyDepartments] = useState([]);
  const navigate = useNavigate();
  const [rows, setRows] = useState([
    { companyType: null, companyDepartments: null },
  ]);
  const [errors, setErrors] = useState([
    { companyType: "", companyDepartments: "" },
  ]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const params = {
        user_id: userDetails.id,
      };
  
    setIsLoading(true);
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

      const fetchCompanyDepartments = MakeApiRequest(
        "get",
        `${config.baseUrl}company/companydepartmentview/`,
        headers,
        params,
        {}
      )
        .then((response) => {
            console.log(response)
          setDeptSectors(response);
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

    Promise.all([fetchSectors, fetchDepartments,fetchCompanyDepartments]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const sectors = deptSectors.reduce((acc, dept) => {
    const sector = dept.sector_name;
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(dept.department_name);
    return acc;
  }, {});

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
    if (selectedOption) {
      // Check if the selected sector already exists
      if (sectors[selectedOption.label]) {
        updatedErrors[rowIndex].companyType = "Sector already exists";
      } else {
        updatedErrors[rowIndex].companyType = "";
      }
    } else {
      updatedErrors[rowIndex].companyType = "Company type is required";
    }
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
      }else if (sectors[row.companyType.label]) {
        rowErrors.companyType = "Sector already exists";
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
      user_id: userDetails.id,
      companyname:userDetails.companyname,
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
        navigate(`/employer/departments_sectors`);

      })
      .catch((error) => {});
  };

  return (
    <>
      <CompanyNavbar />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
          <BeatLoader color="#6b7280" size={50} />
        </div>
      ) : (
        <div className="min-h-screen bg-gray-200">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-2xl font-semibold text-primary_blue mb-6">
              Add Sector and Department
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
    </>
  );
}

export default Addsector;
