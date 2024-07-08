import { GiHamburgerMenu } from "react-icons/gi";
import { Avatar, Dropdown, Navbar, Sidebar, Drawer } from "flowbite-react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import Cookies from "js-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { FaUsersLine } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi";
import { IoNotifications } from "react-icons/io5";
import { RiTimelineView } from "react-icons/ri";
import ProfileContext from "../../context/ProfileContext";
import NotificationContext from "../../context/NotificationContext";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const { profile, setProfile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const token = Cookies.get("token");
  const { notifications } = useContext(NotificationContext);

  const handleClose = () => setIsOpen(false);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/admin/adminprofile");
  };

  useEffect(() => {
    const params = {
      user_id: userdetails.id,
    };

    MakeApiRequest(
      "get",
      `${config.baseUrl}adminn/adminprofileview/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("profile", response);
        setProfile(response);
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

  return (
    <div>
      <Navbar
        fluid
        className="border-b-2 px-4"
        style={{ backgroundColor: "#A91D3A" }}
      >
        <div className="flex items-center">
          <GiHamburgerMenu
            className="mr-4 cursor-pointer block sm:hidden text-lg text-gray-500"
            onClick={() => setIsOpen(true)}
          />
          <Link
            className="whitespace-nowrap text-xl font-semibold text-white dark:text-white"
            to="/admin/dashboard"
          >
            JobPortal
          </Link>
        </div>
        <div className="flex md:order-2 items-center gap-3">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <img
                className="inline-block size-[38px] rounded-full"
                src={`${config.imagebaseurl}${profile.profile_image}`}
                alt="profile"
              />
            }
          >
            <Dropdown.Header>
              <span className="block truncate text-sm font-medium">
                {profile.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleProfileClick}>
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Profile
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
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
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m8 17 4 4 4-4" />
              </svg>
              Sign out
            </Dropdown.Item>
          </Dropdown>
        </div>
      </Navbar>
      <Drawer open={isOpen} onClose={handleClose} className="w-fit">
        <Drawer.Header
          title={
            <>
              <span className="text-lg">Menu</span>
            </>
          }
          titleIcon={() => <></>}
        />
        <Drawer.Items>
          <Sidebar
            aria-label=""
            className="[&>div]:bg-transparent [&>div]:p-0 w-60"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <Sidebar.Items>
                  <Sidebar.ItemGroup className="flex flex-col gap-2 font-medium">
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
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </div>
  );
};

export default AdminNav;
