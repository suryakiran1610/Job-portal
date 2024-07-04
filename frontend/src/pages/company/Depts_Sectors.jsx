import React, { useEffect, useState } from "react";
import CompanyNavbar from "../../components/navbars/companynavbar";
import config from "../../Functions/config";
import MakeApiRequest from "../../Functions/AxiosApi";
import Cookies from "js-cookie";
import { BeatLoader } from "react-spinners";

function Depts_Sectors() {
  const [isloading, setIsloading] = useState(false);
  const token = Cookies.get("token");
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [deptSectors, setDeptSectors] = useState([]);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const params = {
      user_id: userdetails.id,
    };
    MakeApiRequest(
      "get",
      `${config.baseUrl}company/companydepartmentview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log(response);
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
  }, []);

  const sectors = deptSectors.reduce((acc, dept) => {
    const sector = dept.sector_name;
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(dept.department_name);
    return acc;
  }, {});

  return (
    <>
      <CompanyNavbar />
      {isloading ? (
        <div
          className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto"
          style={{ backgroundColor: "#EEEEEE" }}
        >
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : (
        <div style={{ backgroundColor: "#EEEEEE" }}>
          <div className="w-full min-h-screen sm:px-6 lg:px-8 lg:py-7 mx-auto">
            <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
              <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(sectors).map(([sectorName, departments], index) => (               
                <div class="group flex flex-col h-full bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                  <div class="p-4 md:p-6">
                    <h3 class="text-xl font-semibold text-gray-800 dark:text-neutral-300 dark:hover:text-white">
                      Sector
                    </h3>
                    <div>
                    <ul className="list-disc pl-5 mb-4 flex justify-evenly flex-wrap">
                      {departments.map((dept, idx) => (
                        <li key={idx} className="mb-1">{dept}</li>
                      ))}
                    </ul>
                    </div>
                  </div>
                  <div class="mt-auto flex border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700">
                    <a
                      class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-es-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                      href="#"
                    >
                      Add Dept
                    </a>
                    <a
                      class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-ee-xl bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                      href="#"
                    >
                      Delete
                    </a>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Depts_Sectors;
