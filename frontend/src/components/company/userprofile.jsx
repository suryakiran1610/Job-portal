import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { FaArrowLeft } from "react-icons/fa";
import CompanyNavbar from "../navbars/companynavbar";
import { useParams } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";
import { Link, useLocation, useNavigate } from "react-router-dom";





function UserProfile() {
  const token = Cookies.get("token");
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [isloading, setIsloading] = useState(false);




 

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const params = {
      userid: id
    };
    setIsloading(true);
    MakeApiRequest(
      "get",
      `${config.baseUrl}company/users/`,
      headers,
      params,
      {}
    )
      .then((response) => {
        console.log("profile", response);
        setUser(response);
        setIsloading(false);

      })
      .catch((error) => {
        console.error("Error:", error);
        setIsloading(false);
        setError(error);
        if (error.response && error.response.status === 401) {
          console.log(
            "Unauthorized access. Token might be expired or invalid."
          );
        } else {
          console.error("Unexpected error occurred:", error);
        }
      });    
  }, [id]);

  

  return (
    <>
        <CompanyNavbar/>
        {isloading ? (
        <div className="h-screen flex justify-center items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <BeatLoader color="#6b7280" margin={1} size={50} />
        </div>
      ) : error && error.response && error.response.status === 500 ? (
        <div className="h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" style={{ backgroundColor: "#EEEEEE" }}>
          <h1 className="text-red-700">User No Longer Exists....</h1>
        </div>
      ) : (
        <div style={{ backgroundColor: "#EEEEEE" }}>
    <div className="max-w-[65rem] h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        
      <div className="flex flex-col md:flex-row md:space-x-4 p-4">
        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center space-y-4 md:w-1/3 mb-6">
          <img
            className="w-24 h-24 rounded-full"
            src={`http://127.0.0.1:8000${user.profile_image}`}
            alt="User Avatar"
          />
          <h2 className="text-xl font-semibold">{user.fullname}</h2>
          
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-2 md:w-2/3">
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Full Name</h3>
            <p className="text-gray-600">{user.fullname}</p>
          </div>
          <hr />
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Email</h3>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <hr />
          
          <hr />
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Mobile</h3>
            <p className="text-gray-600">{user.mobile}</p>
          </div>
          <hr />
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Address</h3>
            <p className="text-gray-600">{user.address}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
      )}
    </>
  );
}

export default UserProfile;
