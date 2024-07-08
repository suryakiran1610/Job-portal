import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, {useContext, useEffect, useState } from "react";
import { IoHome } from "react-icons/io5";
import { FaUsersLine } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { IoNotifications } from "react-icons/io5";
import { RiTimelineView } from "react-icons/ri";
import NotificationContext from "../../context/NotificationContext";



const AdminSideBar = () => {
  const path = useLocation().pathname;
  const token = Cookies.get("token");
  const { notifications,updateNotification } = useContext(NotificationContext);

  useEffect(()=>{
    updateNotification()
  },[])

  return (
    <div className=" w-52 border-r-2 hidden sm:block transition-transform -translate-x-full sm:translate-x-0 h-full bg-white">
      <aside
        id="default-sidebar"
        className="w-52 transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
          <ul className="space-y-2 font-medium flex flex-col gap-2">
            <li>
              <Link
                to="/admin/dashboard"
                className={`flex items-center p-2 rounded-lg group ${
                  path === "/admin/dashboard"
                    ? "bg-slate-900 text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <IoHome
                  className={`w-5 h-5 text-black transition duration-75 ${
                    path === "/admin/dashboard"
                      ? "group-hover:text-white text-white"
                      : "group-hover:text-gray-900"
                  }`}
                />
                <span
                  className={`ms-3 transition duration-75 ${
                    path === "/admin/dashboard"
                      ? "group-hover:text-white"
                      : "group-hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/viewcompanies"
                className={`flex items-center p-2 rounded-lg group ${
                  path === "/admin/viewcompanies"
                    ? "bg-slate-900 text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <FaUsersLine
                  className={`w-5 h-5 text-black transition duration-75 ${
                    path === "/admin/viewcompanies"
                      ? "group-hover:text-white text-white"
                      : "group-hover:text-gray-900"
                  }`}
                />
                <span
                  className={`ms-3 transition duration-75 ${
                    path === "/admin/viewcompanies"
                      ? "group-hover:text-white"
                      : "group-hover:text-gray-900"
                  }`}
                >
                  Company
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/viewjobseekers"
                className={`flex items-center p-2 rounded-lg group ${
                  path === "/admin/viewjobseekers"
                    ? "bg-slate-900 text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <HiUsers
                  className={`w-5 h-5 text-black transition duration-75 ${
                    path === "/admin/viewjobseekers"
                      ? "group-hover:text-white text-white"
                      : "group-hover:text-gray-900"
                  }`}
                />
                <span
                  className={`ms-3 transition duration-75 ${
                    path === "/admin/viewjobseekers"
                      ? "group-hover:text-white"
                      : "group-hover:text-gray-900"
                  }`}
                >
                Users
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/viewjobs"
                className={`flex items-center p-2 rounded-lg group ${
                  path === "/admin/viewjobs"
                    ? "bg-slate-900 text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <RiTimelineView
                  className={`w-5 h-5 text-black transition duration-75 ${
                    path === "/admin/viewjobs"
                      ? "group-hover:text-white text-white"
                      : "group-hover:text-gray-900"
                  }`}
                />
                <span
                  className={`ms-3 transition duration-75 ${
                    path === "/admin/viewjobs"
                      ? "group-hover:text-white"
                      : "group-hover:text-gray-900"
                  }`}
                >
                  Jobs
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/notifications"
                className={`relative flex items-center p-2 rounded-lg group ${
                  path === "/admin/notifications"
                    ? "bg-slate-900 text-white"
                    : "text-black hover:bg-gray-100"
                }`}
              >
                <div className="absolute left-1 bottom-5 w-4 h-4 flex justify-center items-center bg-red-500 rounded-full">
                    <span className="text-sm text-white p-1">
                      {notifications.unreadnotificationcount}
                    </span>
                </div>
                <IoNotifications
                  className={`w-5 h-5 text-black transition duration-75 ${
                    path === "/admin/notifications"
                      ? "group-hover:text-white text-white"
                      : "group-hover:text-gray-900"
                  }`}
                />
                <span
                  className={`ms-3 transition duration-75 ${
                    path === "/admin/notifications"
                      ? "group-hover:text-white"
                      : "group-hover:text-gray-900"
                  }`}
                >
                  Notifications
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default AdminSideBar;
