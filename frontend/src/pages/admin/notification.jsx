import React, { useContext, useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import Cookies from "js-cookie";
import Adminsidebar from "../../components/navbars/Adminsidebar";
import AdminNav from "../../components/navbars/Adminnav";
import NotificationContext from "../../context/NotificationContext";
import BeatLoader from "react-spinners/BeatLoader";

function Notification() {
  const token = Cookies.get("token");
  const { notifications, updateNotification } = useContext(NotificationContext);
  const [companyData, setCompanyData] = useState({ company: [] });
  const [categoryData, setCategoryData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [togglemodal, setTogglemodal] = useState(false);
  const [togglemodal2, setTogglemodal2] = useState(false);
  const [togglemodal3, setTogglemodal3] = useState(false);
  const [companyid, setCompanyid] = useState("");
  const [sectorId, setSectorid] = useState("");
  const [categoryId, setCategoryid] = useState("");
  const [isloading, setIsloading] = useState(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    setIsloading(true);
    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getallnotification/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("notification", response);
        updateNotification();
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
  }, []);

  useEffect(() => {
    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/getallcompany/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("company", response);
        setCompanyData(response);
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
    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/alljobcategory/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log("category", response);
        setCategoryData(response);
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

  const approvecompany = (companyId) => {
    const params = {
      companyid: companyId,
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
        setCompanyData((prevCompanyData) => ({
          ...prevCompanyData,
          company: prevCompanyData.company.map((company) =>
            company.company_user_id === companyId
              ? { ...company, is_verified: true }
              : company
          ),
        }));
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

  const approvecategory = (categoryId) => {
    const params = { categoryid: categoryId };

    MakeApiRequest(
      "put",
      `${config.baseUrl}adminn/jobcategory/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setCategoryData((prevCategoryData) =>
          prevCategoryData.map((category) =>
            category.id === categoryId
              ? { ...category, isapproved: true }
              : category
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

  const handledeletemodal = (companyId) => {
    setCompanyid(companyId);
    setTogglemodal(true);
  };

  const handlecategorydeletemodal = (Id) => {
    setCategoryid(Id);
    setTogglemodal2(true);
  };

  const deletecompany = () => {
    const params = {
      companyid: companyid,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/deletecompany_deletenotification/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal(false);
        updateNotification();

        setCompanyData((prevCompanyData) => ({
          ...prevCompanyData,
          company: prevCompanyData.company.filter(
            (company) => company.company_user_id !== companyid
          ),
        }));
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

  const deletecategory = () => {
    const params = { categoryid: categoryId };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/deletecategory_deletenotification/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal2(false);
        updateNotification();
        setCategoryData((prevCategoryData) =>
          prevCategoryData.filter((category) => category.id !== categoryId)
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

  const approvesector = (sectorId) => {
    const params = { sectorid: sectorId };

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

  const handlesectordeletemodal = (Id) => {
    setSectorid(Id);
    setTogglemodal3(true);
  };

  const deletesector = () => {
    const params = { sectorid: sectorId };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/deletesector_deletenotification/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal3(false);
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

  const deletenotification = (notificationId) => {
    const params = {
      notificationid: notificationId,
    };

    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/deletenotification/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal(false);
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

  const readed = (notificationId) => {
    const params = {
      notificationid: notificationId,
    };

    MakeApiRequest(
      "put",
      `${config.baseUrl}adminn/notificationn_readed/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
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
  const deleteallnotification = () => {
    MakeApiRequest(
      "delete",
      `${config.baseUrl}adminn/deletenotification/`,
      headers,
      {},
      {}
    )
      .then((response) => {
        console.log(response);
        setTogglemodal(false);
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

  return (
    <div>
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
          <div className="flex-grow h-screen overflow-y-auto md:p-8 p-4 ">
            <div className="flex items-center justify-between">
              <p
                tabIndex="0"
                className="focus:outline-none text-2xl font-semibold leading-6 text-gray-800"
              >
                Notifications
              </p>
              <p
                onClick={deleteallnotification}
                className="cursor-pointer text-sm"
              >
                Clear All
              </p>
            </div>
            {notifications.notification.length > 0 ? (
              notifications.notification.map((notification, index) => (
                <div key={index}>
                  {notification.notificationtype === "registration" ? (
                    <div
                      onClick={() => {
                        readed(notification.id);
                      }}
                      className={`w-full p-3 mt-4 rounded shadow hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-shrink-0 ${
                        notification.isread ? "bg-white" : "bg-blue-200"
                      }`}
                    >
                      <div
                        tabIndex="0"
                        aria-label="group icon"
                        role="img"
                        className="focus:outline-none w-8 h-8 border rounded-full border-gray-200 flex flex-shrink-0 items-center justify-center"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.33325 14.6667C1.33325 13.2522 1.89516 11.8956 2.89535 10.8954C3.89554 9.89523 5.2521 9.33333 6.66659 9.33333C8.08107 9.33333 9.43763 9.89523 10.4378 10.8954C11.438 11.8956 11.9999 13.2522 11.9999 14.6667H1.33325ZM6.66659 8.66666C4.45659 8.66666 2.66659 6.87666 2.66659 4.66666C2.66659 2.45666 4.45659 0.666664 6.66659 0.666664C8.87659 0.666664 10.6666 2.45666 10.6666 4.66666C10.6666 6.87666 8.87659 8.66666 6.66659 8.66666ZM11.5753 10.1553C12.595 10.4174 13.5061 10.9946 14.1788 11.8046C14.8515 12.6145 15.2515 13.6161 15.3219 14.6667H13.3333C13.3333 12.9267 12.6666 11.3427 11.5753 10.1553ZM10.2266 8.638C10.7852 8.13831 11.232 7.52622 11.5376 6.84183C11.8432 6.15743 12.0008 5.41619 11.9999 4.66666C12.0013 3.75564 11.7683 2.85958 11.3233 2.06466C12.0783 2.21639 12.7576 2.62491 13.2456 3.2208C13.7335 3.81668 14.0001 4.56315 13.9999 5.33333C14.0001 5.80831 13.8987 6.27784 13.7027 6.71045C13.5066 7.14306 13.2203 7.52876 12.863 7.84169C12.5056 8.15463 12.0856 8.38757 11.6309 8.52491C11.1762 8.66224 10.6974 8.7008 10.2266 8.638Z"
                            fill="#047857"
                          />
                        </svg>
                      </div>
                      <div className="pl-3 w-auto md:w-2/5 flex-col">
                        <div className="flex items-center justify-between">
                          <p
                            tabIndex="0"
                            className="focus:outline-none text-sm leading-none"
                          >
                            <span className="text-indigo-700">
                              {notification.companyname}
                            </span>{" "}
                            {notification.message} on{" "}
                            {notification.registereddate}
                          </p>
                        </div>
                      </div>

                      {companyData.company.find(
                        (company) =>
                          company.company_user_id === notification.companyid &&
                          company.is_verified === false
                      ) ? (
                        <div className="flex cursor-pointer">
                          <div className="flex flex-col items-center mr-4 ml-4 ">
                            <div className="flex items-center justify-center w-7 h-7 border-2 hover:border-4 border-green-500 rounded-full">
                              <svg
                                onClick={() => {
                                  approvecompany(notification.companyid);
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
                                  handledeletemodal(notification.companyid);
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
                          Activated
                        </div>
                      )}

                      <div className="focus:outline-none cursor-pointer flex w-3/5 justify-end">
                        <svg
                          onClick={() => {
                            deletenotification(notification.id);
                          }}
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5 3.5L3.5 10.5"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.5 3.5L10.5 10.5"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : notification.notificationtype ===
                    "add_jobcategory_request" ? (
                    <div
                      onClick={() => {
                        readed(notification.id);
                      }}
                      className={`w-full p-3 mt-4 rounded shadow hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-shrink-0 ${
                        notification.isread ? "bg-white" : "bg-blue-200"
                      }`}
                    >
                      <div
                        tabIndex="0"
                        aria-label="group icon"
                        role="img"
                        className="focus:outline-none w-8 h-8 border rounded-full border-gray-200 flex flex-shrink-0 items-center justify-center"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.33325 14.6667C1.33325 13.2522 1.89516 11.8956 2.89535 10.8954C3.89554 9.89523 5.2521 9.33333 6.66659 9.33333C8.08107 9.33333 9.43763 9.89523 10.4378 10.8954C11.438 11.8956 11.9999 13.2522 11.9999 14.6667H1.33325ZM6.66659 8.66666C4.45659 8.66666 2.66659 6.87666 2.66659 4.66666C2.66659 2.45666 4.45659 0.666664 6.66659 0.666664C8.87659 0.666664 10.6666 2.45666 10.6666 4.66666C10.6666 6.87666 8.87659 8.66666 6.66659 8.66666ZM11.5753 10.1553C12.595 10.4174 13.5061 10.9946 14.1788 11.8046C14.8515 12.6145 15.2515 13.6161 15.3219 14.6667H13.3333C13.3333 12.9267 12.6666 11.3427 11.5753 10.1553ZM10.2266 8.638C10.7852 8.13831 11.232 7.52622 11.5376 6.84183C11.8432 6.15743 12.0008 5.41619 11.9999 4.66666C12.0013 3.75564 11.7683 2.85958 11.3233 2.06466C12.0783 2.21639 12.7576 2.62491 13.2456 3.2208C13.7335 3.81668 14.0001 4.56315 13.9999 5.33333C14.0001 5.80831 13.8987 6.27784 13.7027 6.71045C13.5066 7.14306 13.2203 7.52876 12.863 7.84169C12.5056 8.15463 12.0856 8.38757 11.6309 8.52491C11.1762 8.66224 10.6974 8.7008 10.2266 8.638Z"
                            fill="#047857"
                          />
                        </svg>
                      </div>
                      <div className="pl-3 w-auto md:w-2/5 flex-col">
                        <div className="flex items-center justify-between">
                          <p
                            tabIndex="0"
                            className="focus:outline-none text-sm leading-none"
                          >
                            <span className="text-indigo-700"></span>{" "}
                            {notification.message} by {notification.companyname}
                          </p>
                        </div>
                      </div>

                      {categoryData.find(
                        (category) =>
                          category.id === notification.jobcategoryid &&
                          category.isapproved === false
                      ) ? (
                        <div className="flex cursor-pointer">
                          <div className="flex flex-col items-center mr-4 ml-4 ">
                            <div className="flex items-center justify-center w-7 h-7 border-2 hover:border-4 border-green-500 rounded-full">
                              <svg
                                onClick={() => {
                                  approvecategory(notification.jobcategoryid);
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
                                  handlecategorydeletemodal(
                                    notification.jobcategoryid
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

                      <div className="focus:outline-none cursor-pointer flex w-3/5 justify-end">
                        <svg
                          onClick={() => {
                            deletenotification(notification.id);
                          }}
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5 3.5L3.5 10.5"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.5 3.5L10.5 10.5"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : notification.notificationtype === "sector_created" ? (
                    <div
                      onClick={() => {
                        readed(notification.id);
                      }}
                      className={`w-full p-3 mt-4 rounded shadow hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-shrink-0 ${
                        notification.isread ? "bg-white" : "bg-blue-200"
                      }`}
                    >
                      <div
                        tabIndex="0"
                        aria-label="group icon"
                        role="img"
                        className="focus:outline-none w-8 h-8 border rounded-full border-gray-200 flex flex-shrink-0 items-center justify-center"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1.33325 14.6667C1.33325 13.2522 1.89516 11.8956 2.89535 10.8954C3.89554 9.89523 5.2521 9.33333 6.66659 9.33333C8.08107 9.33333 9.43763 9.89523 10.4378 10.8954C11.438 11.8956 11.9999 13.2522 11.9999 14.6667H1.33325ZM6.66659 8.66666C4.45659 8.66666 2.66659 6.87666 2.66659 4.66666C2.66659 2.45666 4.45659 0.666664 6.66659 0.666664C8.87659 0.666664 10.6666 2.45666 10.6666 4.66666C10.6666 6.87666 8.87659 8.66666 6.66659 8.66666ZM11.5753 10.1553C12.595 10.4174 13.5061 10.9946 14.1788 11.8046C14.8515 12.6145 15.2515 13.6161 15.3219 14.6667H13.3333C13.3333 12.9267 12.6666 11.3427 11.5753 10.1553ZM10.2266 8.638C10.7852 8.13831 11.232 7.52622 11.5376 6.84183C11.8432 6.15743 12.0008 5.41619 11.9999 4.66666C12.0013 3.75564 11.7683 2.85958 11.3233 2.06466C12.0783 2.21639 12.7576 2.62491 13.2456 3.2208C13.7335 3.81668 14.0001 4.56315 13.9999 5.33333C14.0001 5.80831 13.8987 6.27784 13.7027 6.71045C13.5066 7.14306 13.2203 7.52876 12.863 7.84169C12.5056 8.15463 12.0856 8.38757 11.6309 8.52491C11.1762 8.66224 10.6974 8.7008 10.2266 8.638Z"
                            fill="#047857"
                          />
                        </svg>
                      </div>
                      <div className="pl-3 w-auto md:w-2/5 flex-col">
                        <div className="flex items-center justify-between">
                          <p
                            tabIndex="0"
                            className="focus:outline-none text-sm leading-none"
                          >
                            <span className="text-indigo-700"></span>{" "}
                            {notification.message} by {notification.companyname}
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
                                  approvesector(notification.jobcategoryid);
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
                                    notification.jobcategoryid
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

                      <div className="focus:outline-none cursor-pointer flex w-3/5 justify-end">
                        <svg
                          onClick={() => {
                            deletenotification(notification.id);
                          }}
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5 3.5L3.5 10.5"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M3.5 3.5L10.5 10.5"
                            stroke="#4B5563"
                            strokeWidth="1.25"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="text-center">No Notifications</p>
            )}
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
                  Delete Company
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Are you sure you want to Delete this Company ?. This action
                    cannot be undone.
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
        {togglemodal2 && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50"
                aria-hidden="true"
              ></div>
              <div className="inline-block w-full max-w-2xl p-8 my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl dark:bg-neutral-800 dark:border dark:border-neutral-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-neutral-200">
                  Delete Category
                </h3>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Are you sure you want to Delete this Category ?. This action
                    cannot be undone.
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="justify-center inline-flex items-center rounded-full py-3 px-4 text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    onClick={deletecategory}
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
        {togglemodal3 && (
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
                    Are you sure you want to Delete this Sector ?. This action
                    cannot be undone.
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
                      setTogglemodal3(false);
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
  );
}

export default Notification;
