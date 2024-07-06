import React, { useEffect, useState } from "react";
import CompanyNavbar from "../../components/navbars/companynavbar";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import Cookies from "js-cookie";
import { BeatLoader } from "react-spinners";
import Creatable from "react-select/creatable";
import { useNavigate, Link, useLocation } from "react-router-dom";

function Depts_Sectors() {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("token");
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [deptSectors, setDeptSectors] = useState([]);
  const [companyDepartments, setCompanyDepartments] = useState([]);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [togglemodal, setTogglemodal] = useState(false);
  const [sectorId, setSectorId] = useState("");
  const [addDepartmentModal, setAddDepartmentModal] = useState(false);
  const [deletedepartmentmodal, setDeletedepartmentmodal] = useState(false);
  const navigate = useNavigate();
  const [selectedSectorDepartments, setSelectedSectorDepartments] = useState(
    []
  );
  const [selectedDepartmentsToDelete, setSelectedDepartmentsToDelete] =
    useState([]);
  const [rows, setRows] = useState([
    { companyType: null, companyDepartments: null },
  ]);
  const [message, setMessage] = useState("");

  const AddSector = () => {
    navigate(`/employer/addsector`);
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    setIsLoading(true);

    const params = {
      user_id: userDetails.id,
    };

    const fetchSectors = MakeApiRequest(
      "get",
      `${config.baseUrl}company/getcompanysector/`,
      {},
      {},
      {}
    )
      .then((response) => {
        setCompanyTypes(
          response.map((sector) => ({
            value: sector.id,
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

    Promise.all([fetchSectors, fetchDepartments, fetchCompanyDepartments]).then(
      () => {
        setIsLoading(false);
      }
    );
  }, []);

  const sectors = deptSectors.reduce((acc, dept) => {
    const sector = dept.sector_name;
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(dept.department_name);
    return acc;
  }, {});

  const handleCompanyDepartmentsChange = (selectedOptions, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].companyDepartments = selectedOptions;
    setRows(updatedRows);
  };

  const DeleteDepartment = (sectorname) => {
    setSectorId(sectorname);
    setSelectedSectorDepartments(sectors[sectorname]);
    setDeletedepartmentmodal(true);
  };

  const handleCheckboxChange = (dept) => {
    setSelectedDepartmentsToDelete((prevSelected) => {
      if (prevSelected.includes(dept)) {
        return prevSelected.filter((d) => d !== dept);
      } else {
        return [...prevSelected, dept];
      }
    });
  };

  const handleDeleteDepartment = (e) => {
    e.preventDefault();

    selectedDepartmentsToDelete.forEach((dept) => {
      const data = {
        sector_name: sectorId,
        department_name: dept,
        user_id: userDetails.id,
      };

      MakeApiRequest(
        "delete",
        `${config.baseUrl}company/deletedepartment/`,
        headers,
        {},
        data
      )
        .then((response) => {
          const updatedDeptSectors = deptSectors.filter(
            (d) =>
              !(
                d.sector_name === sectorId &&
                selectedDepartmentsToDelete.includes(d.department_name)
              )
          );
          setDeptSectors(updatedDeptSectors);
          setSelectedDepartmentsToDelete([]);
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
    });

    setDeletedepartmentmodal(false);
  };

  const handledeletemodal = (sectorname) => {
    setSectorId(sectorname);
    setTogglemodal(true);
  };

  const handleDeleteSector = () => {
    const params = {
      sector_name: sectorId,
      user_id: userDetails.id,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}company/getcompanydepartment/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        setDeptSectors((prev) =>
          prev.filter((dept) => dept.sector_name !== sectorId)
        );
        setTogglemodal(false);
        setSectorId("");
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

  const addNewDepartment = (sectorname) => {
    setSectorId(sectorname);
    setAddDepartmentModal(true);
    setRows([{ companyType: null, companyDepartments: null }]);
    setMessage("");
  };

  const handleAddDepartment = (e) => {
    e.preventDefault();

    const selectedDepartments = rows.flatMap(
      (row) => row.companyDepartments || []
    );
    const existingDepartments = sectors[sectorId] || [];

    if (selectedDepartments.length === 0) {
      setMessage("Please add at least one department.");
      return;
    }

    const alreadyExists = selectedDepartments.some((dep) =>
      existingDepartments.includes(dep.label)
    );
    if (alreadyExists) {
      setMessage("Department already exists in this sector.");
      return;
    }

    const data = {
      departments: [],
      user_id: userDetails.id,
      sectors: [sectorId],
    };

    selectedDepartments.forEach((department) => {
      data.departments.push({
        sector_name: sectorId,
        department_name: department.label,
      });
    });

    MakeApiRequest(
      "post",
      `${config.baseUrl}company/addnewdepartment/`,
      headers,
      {},
      data
    )
      .then((response) => {
        setDeptSectors([...deptSectors, ...response]);
        setRows([{ companyType: null, companyDepartments: null }]);
        setSectorId("");
        setMessage("Department Added successfully");
        setTimeout(() => {
          setAddDepartmentModal(false);
          setMessage("");
        }, 2500);
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

  return (
    <>
      <CompanyNavbar />
      {isLoading ? (
        <div
          className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
          style={{ backgroundColor: "#EEEEEE" }}
        >
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (
        <div style={{ backgroundColor: "#EEEEEE" }}>
          <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto">
            <div className="flex justify-end p-1">
              <button
                onClick={AddSector}
                className="px-2 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md"
              >
                Add Sector
              </button>
            </div>
            <div className="max-w-[85rem] px-4 py-5 sm:px-6 lg:px-8 lg:py-5 mx-auto">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(sectors).map(
                  ([sectorName, departments], index) => (
                    <div
                      key={index}
                      className="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
                    >
                      <div className="p-2 md:p-6">
                        <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                          Sector: {sectorName}
                        </h3>
                        <div>
                            <p className="text-sm mt-1 mb-1">Departments: </p>
                          <ul className="list-disc pl-5 mb-4 flex flex-col sm:flex-row sm:flex-wrap sm:justify-evenly">
                            {departments.map((dept, idx) => (
                              <li key={idx} className="mb-1 sm:mb-0 sm:mr-4">
                                {dept}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                        <a
                          className="w-full cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-xs font-medium rounded-es-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                          onClick={() => addNewDepartment(sectorName)}
                        >
                          Add Dept
                        </a>
                        <a
                          className="w-full cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-xs font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                          onClick={() => DeleteDepartment(sectorName)}
                        >
                          Delete Dept
                        </a>
                        <a
                          className="w-full cursor-pointer py-3 px-4 inline-flex justify-center items-center gap-x-2 text-xs font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                          onClick={() => handledeletemodal(sectorName)}
                        >
                          Delete Sector
                        </a>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {addDepartmentModal && (
              <div className="fixed inset-0 px-4 pt-4 pb-20 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                  <h3 className="text-xl font-semibold mb-4">
                    Add Department for: {sectorId}
                  </h3>
                  <form onSubmit={handleAddDepartment}>
                    <div className="mb-4">
                      {rows.map((row, index) => (
                        <label
                          key={index}
                          className="flex flex-col gap-1 text-xs mt-4"
                        >
                          Departments
                          <Creatable
                            value={row.companyDepartments}
                            onChange={(selectedOptions) =>
                              handleCompanyDepartmentsChange(
                                selectedOptions,
                                index
                              )
                            }
                            options={companyDepartments}
                            isMulti
                          />
                        </label>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mr-2"
                        onClick={() => setAddDepartmentModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                  {message &&
                    (message === "Please add at least one department." ? (
                      <div
                        className="mt-2 bg-yellow-100 border border-yellow-200 text-sm text-yellow-800 rounded-lg p-4 dark:bg-yellow-800/10 dark:border-yellow-900 dark:text-yellow-500"
                        role="alert"
                      >
                        <span className="font-bold">Warning:</span> No changes
                        detected.Please add at least one department.
                      </div>
                    ) : message ===
                      "Department already exists in this sector." ? (
                      <div
                        className="mt-2 bg-red-100 border border-red-200 text-sm text-red-800 rounded-lg p-4 dark:bg-red-800/10 dark:border-red-900 dark:text-red-500"
                        role="alert"
                      >
                        <span className="font-bold">Error:</span> Department
                        already exists in this sector.
                      </div>
                    ) : (
                      <div
                        className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                        role="alert"
                      >
                        <span className="font-bold">Success:</span> Department
                        Added successfully.
                      </div>
                    ))}
                </div>
              </div>
            )}

            {deletedepartmentmodal && (
              <div className="fixed inset-0 px-4 pt-4 pb-20 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md ">
                  <h3 className="text-xl font-semibold mb-4">
                    Delete Departments for: {sectorId}
                  </h3>
                  <form onSubmit={handleDeleteDepartment}>
                    <div className="mb-4">
                      <label className="flex flex-col gap-1 text-xs mt-4">
                        Departments
                        <ul className="flex flex-wrap gap-2 mt-2">
                          {selectedSectorDepartments.map((dept, index) => (
                            <li key={index} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`dept-${index}`}
                                className="mr-2"
                                checked={selectedDepartmentsToDelete.includes(
                                  dept
                                )}
                                onChange={() => handleCheckboxChange(dept)}
                              />
                              <label
                                htmlFor={`dept-${index}`}
                                className="text-sm font-bold"
                              >
                                {dept}
                              </label>
                            </li>
                          ))}
                        </ul>
                      </label>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 mr-2"
                        onClick={() => setDeletedepartmentmodal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {togglemodal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
                    aria-hidden="true"
                  ></div>
                  <div className="inline-block w-full max-w-2xl p-8 my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl dark:bg-neutral-800 dark:border dark:border-neutral-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">
                      Delete Sector
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Are you sure you want to delete this Sector? All of the
                        data will be permanently removed. This action cannot be
                        undone.
                      </p>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={handleDeleteSector}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTogglemodal(false);
                        }}
                        className="mt-3 sm:mt-0 sm:mr-3 justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Depts_Sectors;
