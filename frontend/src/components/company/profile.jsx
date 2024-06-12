import React, { useEffect, useState } from "react";
import MakeApiRequest from "../../Functions/AxiosApi";
import config from "../../Functions/config";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

function Profile({ profileImageURL, setProfileImageURL }) {
  const userdetails = JSON.parse(localStorage.getItem("user"));
  const [toggleeditmodal, setToggleeditmodal] = useState(false);
  const token = Cookies.get("token");
  const [profile,setProfile]=useState("")
  const [message, setMessage] = useState("");
  const [editedprofile, setEditedprofile] = useState({
    email: "",
    username: "",
    companyname: "",
    address: "",
    mobile: "",
    profile_image: "",
  });


  const handleeditmodal = () => {
    setToggleeditmodal(true);
    setEditedprofile(profile);
  };

  const handleCloseModal = () => {
    setToggleeditmodal(false);
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };


    useEffect(() => {
        const params = {
            userid: userdetails.id,
        };

        MakeApiRequest(
        "get",
        `${config.baseUrl}company/users/`,
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

    function Handleprofiledetails(e) {
        const { name, value, type, files } = e.target;
        if (type === "file") {
          setEditedprofile((prevState) => ({
            ...prevState,
            [name]: files[0],
          }));
        } else {
          setEditedprofile((prevState) => ({
            ...prevState,
            [name]: value,
          }));
        }
      }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const params = {
            userid: userdetails.id,
        };
      
        const formData = new FormData();
        for (let key in editedprofile) {
          if (key === 'profile_image') {
            if (editedprofile[key] instanceof File) {
              formData.append(key, editedprofile[key]);
            }
          } else {
            formData.append(key, editedprofile[key]);
          }
        }
      
          MakeApiRequest(
            "put",
            `${config.baseUrl}company/users/`,
            headers,
            params,
            formData
          )
            .then((response) => {
              console.log(response);
              setMessage("Job Updated successfully");
              setProfile(response);
                setToggleeditmodal(false);
                setProfileImageURL(response.profile_image);
    
              
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
    <div className="max-w-[65rem] h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="flex flex-col md:flex-row md:space-x-4 p-4">


        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center space-y-4 md:w-1/3 mb-6">
          <img
            className="w-24 h-24 rounded-full"
            src={`http://127.0.0.1:8000${profile.profile_image}`}
            alt="User Avatar"
          />
          <h2 className="text-xl font-semibold">{profile.companyname}</h2>
          <div className="flex space-x-2">
            <button onClick={handleeditmodal} className="px-3 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md">Edit Profile</button>
            <button className="px-3 py-2 bg-gray-800 text-white hover:bg-gray-900 rounded-md">Change Password</button>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-2 md:w-2/3">
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Company Name</h3>
            <p className="text-gray-600">{profile.companyname}</p>
          </div>
          <hr />
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Email</h3>
            <p className="text-gray-600">{profile.email}</p>
          </div>
          <hr />
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Username</h3>
            <p className="text-gray-600">{profile.username}</p>
          </div>
          <hr />
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Mobile</h3>
            <p className="text-gray-600">{profile.mobile}</p>
          </div>
          <hr />
          <div className="flex justify-between p-2 md:ml-6 md:mr-6">
            <h3 className="text-gray-700 font-semibold">Address</h3>
            <p className="text-gray-600">{profile.address}</p>
          </div>
        </div>
      </div>

      {toggleeditmodal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center py-3 px-4 border-b">
              <h3 className="font-bold text-gray-800">Edit Profile</h3>
              <button onClick={handleCloseModal} type="button" className="text-gray-800 hover:bg-gray-100 rounded-full p-1">
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="p-2">
                <label  className="block text-sm font-medium mb-2">Company Name</label>
                <input onChange={Handleprofiledetails} value={editedprofile.companyname}  name='companyname' type="text" className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div className="p-2">
                <label  className="block text-sm font-medium mb-2">Email</label>
                <input onChange={Handleprofiledetails} value={editedprofile.email}  name='email' type="email"  className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"  />
                </div>
                <div className="p-2">
                <label  className="block text-sm font-medium mb-2">Username</label>
                <input onChange={Handleprofiledetails} value={editedprofile.username}  name='username' type="text"  className="py-2 px-22 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div className="p-2">
                <label  className="block text-sm font-medium mb-2">Mobile</label>
                <input onChange={Handleprofiledetails} value={editedprofile.mobile}  name='mobile' type="text"  className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div className="p-2">
                <label  className="block text-sm font-medium mb-2">Address</label>
                <input onChange={Handleprofiledetails} value={editedprofile.address}  name='address' type="text" className="py-2 px-2 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div className="p-2">
                <label  className="block text-sm font-medium mb-2">Profile Image</label>
                <input onChange={Handleprofiledetails} name='profile_image' type="file"  className="py-1 px-1 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"/>
                </div>
                <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
                <button onClick={handleCloseModal} type="button" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50">Close</button>
                <button type="submit" className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700">Save changes</button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
