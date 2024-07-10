import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Adminsidebar from "../../components/navbars/Adminsidebar";
import NotificationContext from "../../context/NotificationContext";
import AdminNav from "../../components/navbars/Adminnav";
import BeatLoader from "react-spinners/BeatLoader";
import Creatable from "react-select/creatable";

function Viewcompanies() {
  const [allcompanies, setAllcompanies] = useState([]);
  const { notifications, updateNotification } = useContext(NotificationContext);
  const token = Cookies.get("token");
  const [togglemodal2, setTogglemodal2] = useState(false);
  const [sectorData, setSectorData] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sectorId, setSectorid] = useState("");
  const [rows, setRows] = useState([
    { companyType: null, companyDepartments: null },
  ]);
  const [errors, setErrors] = useState([
    { companyType: "", companyDepartments: "" },
  ]);
  const [limit, setLimit] = useState(5);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [companyDepartments, setCompanyDepartments] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [buttonstatus, setButtonstatus] = useState(true);
  const [companyid, setCompanyid] = useState(null);
  const [togglemodal, setTogglemodal] = useState(false);
  const [togglestatusmodal, setTogglestatusmodal] = useState(false);
  const [companyid_activate, setCompanyid_activate] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [togglesectormodal, setTogglesectormodal] = useState(false);
  const [companyname,setCompanyname]=useState("")
  const [company_Id,setCompany_Id]=useState("")

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleViewCompany = (companyId) => {
    navigate(`/admin/companyprofile/${companyId}`);
  };

  const handlesectormodal = () => {
    setTogglesectormodal(true);
    GetDeptSector();
  };

  const GetDeptSector = () => {
    MakeApiRequest(
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

    MakeApiRequest(
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
  };

  const handleCompanyTypeChange = (selectedOption, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].companyType = selectedOption;
    setRows(updatedRows);
  };

  const handleCompanyDepartmentsChange = (selectedOptions, rowIndex) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex].companyDepartments = selectedOptions;
    setRows(updatedRows);
  };

  const SubmitSecDep = () => {
    const userData = {
      sectors: [],
      departments: [],
    };

    rows.forEach((row) => {
      // add sectors
      if (row.companyType) {
        const sectorNames = row.companyType.map((type) => type.label);
        sectorNames.forEach((sectorName) => {
          userData.sectors.push({
            sector_name: sectorName,
          });
        });
      }

      //add departments
      if (row.companyDepartments) {
        const departmentNames = row.companyDepartments.map((dep) => dep.label);
        departmentNames.forEach((departmentName) => {
          userData.departments.push({
            department_name: departmentName,
          });
        });
      }
    });

    if (userData.sectors.length === 0 && userData.departments.length === 0) {
      setMessage("Please add at least one sector or department.");
      return;
    }

    MakeApiRequest(
      "post",
      `${config.baseUrl}company/addsectordepartments/`,
      {},
      {},
      userData
    )
      .then((response) => {
        console.log(response);
        setMessage("Data Added successfully");
        const updatedRows = rows.map((row) => ({
          ...row,
          companyType: [],
          companyDepartments: [],
        }));
        setRows(updatedRows);
        setTimeout(() => {
          setTogglesectormodal(false);
          setMessage("");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sectornotification = () => {
    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getsectornotification/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("notificationjobcategory", response);
        setNotification(response);
        updateNotification();
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

  useEffect(() => {
    sectornotification();
    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getallcompanysector/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("category", response);
        setSectorData(response);
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

  useEffect(() => {
    setIsloading(true);
    loadJobs();
  }, [limit, startIndex]);

  const loadJobs = () => {
    const params = {
      limit: limit,
      startIndex: startIndex,
    };
    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/limitcompanyview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        if (response.length < 5) {
          setButtonstatus(false);
        } else {
          setButtonstatus(true);
        }
        setAllcompanies(response);
        setIsloading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsloading(false);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });
  };

  const handleLoadMore = () => {
    setStartIndex(startIndex + limit);
  };

  const handleLoadPrevious = () => {
    setStartIndex(Math.max(0, startIndex - limit));
  };

  const handledeletemodal = (companyId) => {
    setCompanyid(companyId);
    setTogglemodal(true);
  };

  const deletecompany = () => {
    const params = {
      companyid: companyid,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/getallcompany/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal(false);
        setAllcompanies(
          allcompanies.filter(
            (company) => company.company_user_id !== companyid
          )
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
  };

  const statusmodal = (companyId) => {
    setCompanyid_activate(companyId);
    setTogglestatusmodal(true);
  };

  const approvecompany = () => {
    const params = {
      companyid: companyid_activate,
    };

    MakeApiRequest(
      "put",
      `${config.baseUrl}adminn/getallcompany/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        updateNotification();
        setTogglestatusmodal(false);
        setAllcompanies(
          allcompanies.map((company) => {
            if (company.company_user_id === companyid_activate) {
              return { ...company, is_verified: "true" };
            }
            return company;
          })
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
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const approvesector = (sectorId,companyName,companyId) => {
    const params = { 
      sectorid: sectorId,
      companyname: companyName, 
      companyid: companyId 

    };

    MakeApiRequest(
      "put",
      `${config.baseUrl}adminn/changesectorstatus/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        updateNotification();
        sectornotification();
        setSectorData((prevSectorData) =>
          prevSectorData.map((sector) =>
            sector.id === sectorId ? { ...sector, is_verified: true } : sector
          )
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
  };

  const handlesectordeletemodal = (sectorId,companyName,companyId) => {
    setSectorid(sectorId);
    setCompanyname(companyName)
    setCompany_Id(companyId)
    setTogglemodal2(true);
  };

  const deletesector = () => {
    const params = { 
      sectorid: sectorId,
      companyname: companyname, 
      companyid: company_Id 
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/deletesector_deletenotification/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal2(false);
        sectornotification();
        updateNotification();
        setSectorData((prevSectorData) =>
          prevSectorData.filter((sector) => sector.id !== sectorId)
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
  };

  return (
    <>
      <AdminNav />
      <div className="flex min-h-screen" style={{ backgroundColor: "#EEEEEE" }}>
        <div className="md:64">
          <Adminsidebar />
        </div>
        {isloading ? (
          <div
            className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
            style={{ backgroundColor: "#EEEEEE" }}
          >
            <BeatLoader color="#6b7280" margin={1} size={50} />
          </div>
        ) : (
          <div className="max-w-[75rem] h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto overflow-auto">
            <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-700">
                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
                          Companies
                        </h2>
                        <div>
                          <div className="inline-flex gap-x-2 relative">
                            <div className="absolute left-32 bottom-7 w-4 h-4 flex justify-center items-center bg-red-500 rounded-full">
                              <span className="text-sm text-white p-1">
                                {notification.length}
                              </span>
                            </div>
                            <button
                              onClick={handlesectormodal}
                              type="button"
                              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent  text-white  bg-slate-800 hover:bg-slate-900 disabled:opacity-50 disabled:pointer-events-none"
                            >
                              Add Dept & Sectors
                            </button>
                          </div>
                        </div>
                      </div>

                      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                        <thead className="bg-gray-50 dark:bg-neutral-800">
                          <tr>
                            <th
                              scope="col"
                              className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 text-start"
                            >
                              <div className="flex items-center gap-x-2 ml-7">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Name
                                </span>
                              </div>
                            </th>

                            <th scope="col" className="px-6 py-3 text-start">
                              <div className="flex items-center gap-x-2 ml-14">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  State
                                </span>
                              </div>
                            </th>

                            <th scope="col" className="px-11 py-3 text-start">
                              <div className="flex items-center gap-x-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Mobile
                                </span>
                              </div>
                            </th>

                            <th scope="col" className="px-11 py-3 text-start">
                              <div className="flex items-center gap-x-2 ml-1">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Status
                                </span>
                              </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-start">
                              <div className="flex items-center gap-x-2 ml-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Created
                                </span>
                              </div>
                            </th>

                            <th scope="col" className="px-6 py-3 text-start">
                              <div className="flex items-center gap-x-2 ml-3">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  View
                                </span>
                              </div>
                            </th>

                            <th
                              scope="col"
                              className="px-6 py-3 text-start ml-1"
                            >
                              <div className="flex items-center gap-x-2">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                                  Delete
                                </span>
                              </div>
                            </th>
                            <th scope="col" className="px-3 py-3 text-end"></th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                          {allcompanies.map((company, index) => (
                            <tr key={index}>
                              <td className="size-px whitespace-nowrap">
                                <div className="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3 ml-4">
                                  <div className="flex items-center gap-x-3">
                                    <img
                                      className="inline-block size-[38px] rounded-full"
                                      src={`${config.imagebaseurl}${company.profile_image}`}
                                      alt={company.company_name}
                                    />
                                    <div className="grow">
                                      <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                        {company.company_name}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="h-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-12">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {company.state}
                                  </span>
                                </div>
                              </td>

                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-3">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {company.mobile}
                                  </span>
                                </div>
                              </td>

                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-1">
                                  {company.is_verified ? (
                                    <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500">
                                      <svg
                                        className="size-2.5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                                      </svg>
                                      Active
                                    </span>
                                  ) : (
                                    <span
                                      onClick={() => {
                                        statusmodal(company.company_user_id);
                                      }}
                                      className=" cursor-pointer py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-500/10 dark:text-yellow-500"
                                    >
                                      <svg
                                        className="size-2.5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                                      </svg>
                                      Pending
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-3">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {formatDate(company.date_joined)}
                                  </span>
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="px-6 py-3 ml-3">
                                  <div className="flex items-center gap-x-3">
                                    <a
                                      onClick={() =>
                                        handleViewCompany(
                                          company.company_user_id
                                        )
                                      }
                                      className="text-sm text-blue-600 dark:text-neutral-500 cursor-pointer hover:text-blue-800"
                                    >
                                      View
                                    </a>
                                  </div>
                                </div>
                              </td>
                              <td className="size-px whitespace-nowrap">
                                <div className="px-3 py-3 ml-1">
                                  <span
                                    onClick={() =>
                                      handledeletemodal(company.company_user_id)
                                    }
                                    className="text-sm text-red-600 dark:text-neutral-500 cursor-pointer  hover:text-red-800"
                                  >
                                    Delete
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-neutral-400">
                            <span className="font-semibold text-gray-800 dark:text-neutral-200">
                              {allcompanies.length}
                            </span>{" "}
                            results
                          </p>
                        </div>

                        <div>
                          <div className="inline-flex gap-x-2">
                            <button
                              type="button"
                              disabled={startIndex === 0}
                              onClick={handleLoadPrevious}
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                              <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m15 18-6-6 6-6" />
                              </svg>
                              Prev
                            </button>

                            <button
                              type="button"
                              disabled={!buttonstatus}
                              onClick={handleLoadMore}
                              className="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                              Next
                              <svg
                                className="flex-shrink-0 size-4"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m9 18 6-6-6-6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {togglemodal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
                    aria-hidden="true"
                  ></div>
                  <div className="inline-block w-full max-w-2xl p-8 my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl dark:bg-neutral-800 dark:border dark:border-neutral-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">
                      Delete Company
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Are you sure you want to Delete this Company ?. This
                        action cannot be undone.
                      </p>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={deletecompany}
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

            {togglestatusmodal && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
                    aria-hidden="true"
                  ></div>
                  <div className="inline-block w-full max-w-2xl p-8 my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl dark:bg-neutral-800 dark:border dark:border-neutral-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">
                      Approve Company
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        Are you sure you want to Approve this Company ?
                      </p>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={approvecompany}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTogglestatusmodal(false);
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

            {togglesectormodal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-x-hidden overflow-y-auto">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-0">
                  <div className="flex justify-between items-center py-3 px-4 border-b">
                    <h3 className="font-bold text-gray-800">
                      Add Sector and Department
                    </h3>
                    <button
                      onClick={() => {
                        setTogglesectormodal(false);
                        setMessage("");
                      }}
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
                  <form>
                    <div className="p-4 space-y-4">
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
                              isMulti
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
                                handleCompanyDepartmentsChange(
                                  selectedOptions,
                                  index
                                )
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
                        </div>
                      ))}
                      {notification.length > 0
                        ? notification.map((notification, index) => (
                            <div
                              key={index}
                              className="w-full p-3 mt-4 rounded shadow hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-shrink-0 bg-blue-200"
                            >
                              <div className="pl-3 w-auto md:w-2/5 flex-col">
                                <div className="flex items-center justify-between">
                                  <p
                                    tabIndex="0"
                                    className="focus:outline-none text-sm leading-none"
                                  >
                                    <span className="text-indigo-700"></span>{" "}
                                    {notification.message} by{" "}
                                    {notification.companyname}
                                  </p>
                                </div>
                              </div>
                              {sectorData.find(
                                (sector) =>
                                  sector.id === notification.jobcategoryid &&
                                  sector.is_verified === false
                              ) ? (
                                <div className="flex cursor-pointer">
                                  <div className="flex flex-col items-center mr-4 ml-4 ">
                                    <div className="flex items-center justify-center w-7 h-7 border-2 hover:border-4 border-green-500 rounded-full">
                                      <svg
                                        onClick={() => {
                                          approvesector(
                                            notification.jobcategoryid,notification.companyname,notification.companyid
                                          );
                                        }}
                                        className="w-7 h-7 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        ></path>
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center w-7 h-7 border-2 hover:border-4 border-red-500 rounded-full">
                                      <svg
                                        onClick={() => {
                                          handlesectordeletemodal(
                                            notification.jobcategoryid,notification.companyname,notification.companyid
                                          );
                                        }}
                                        className="w-7 h-7 text-red-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinejoin="round"
                                          d="M6 18L18 6M6 6l12 12"
                                        ></path>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex text-sm text-green-600">
                                  Approved
                                </div>
                              )}
                            </div>
                          ))
                        : null}
                      <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                        <button
                          onClick={() => {
                            setTogglesectormodal(false);
                            setMessage("");
                          }}
                          type="button"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={SubmitSecDep}
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                    {message &&
                      (message === "Data Added successfully" ? (
                        <div
                          className="mt-2 bg-teal-100 border border-teal-200 text-sm text-teal-800 rounded-lg p-4 dark:bg-teal-800/10 dark:border-teal-900 dark:text-teal-500"
                          role="alert"
                        >
                          <span className="font-bold">Success:</span> Data Added
                          successfully.
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

            {togglemodal2 && (
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
                        Are you sure you want to Delete this Sector ?. This
                        action cannot be undone.
                      </p>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={deletesector}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTogglemodal2(false);
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
        )}
      </div>
    </>
  );
}

export default Viewcompanies;
