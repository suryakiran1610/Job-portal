import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import config from '../../Functions/config';
import MakeApiRequest from '../../Functions/AxiosApi';
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";


function Companyinfo({ setActiveComponent,setCompanyName }) {
    const user_id = Cookies.get('user_id')
    const { id } = useParams();
    const access_token = Cookies.get('access_token')
    const [file, setFile] = useState();
    const [viewfile, setViewFile] = useState();
    const [details, setDetails] = useState(true);
    const [errors,setErrors]=useState({})
    const [companyinfo, setCompanyinfo] = useState({
        company_user_id:id,
        company_name: "",
        mobile: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pin_code: "",
    })


    function HandleCompanyInfo(e) {
        const { name, value } = e.target;
        setCompanyinfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "company_name") {
            setCompanyName(value); // Update company name in parent component
        }

        const newErrors = { ...errors };
        if (!value.trim()) {
            newErrors[name] = `${name.replace('_', ' ')} is required`;
        } else {
            delete newErrors[name];
        }
        setErrors(newErrors);

    }

    const validateFields = () => {
        const newErrors = {};
        Object.keys(companyinfo).forEach(key => {
            if (key !== 'address_line2' && !companyinfo[key]) {
                newErrors[key] = `${key.replace('_', ' ')} is required`;
            }
        });
        if (!file) {
            newErrors.profile_image = "Company logo is required";
        }
        return newErrors;
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        for (let key in companyinfo) {
            formData.append(key, companyinfo[key]);
        }
        formData.append("profile_image", file);

        const params = {
            user_id: id,
          };

        MakeApiRequest(
            "post",
            `${config.baseUrl}company/companypersonalinfo/`,
            {},
            params,
            formData
          )
            .then((response) => {
              console.log(response);
              setActiveComponent("companydetails");

            })
            .catch((error) => {
              // Handle any errors
            });
    };
    
    function HandleNextDetails() {
        setDetails(false)
    }

    function handleChange(e) {
        const file = e.target.files[0];
        // setViewFile(URL.createObjectURL(file));
        setFile(file);

        if (file) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                profile_image: "",
            }));
        } else {
            setErrors((prevErrors) => ({
                ...prevErrors,
                profile_image: "Company logo is required",
            }));
        }
    }


    return (<>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex justify-evenly pt-10 max-sm:flex-col-reverse max-sm:justify-normal max-sm:pt-3" >
                < div className='flex flex-col gap-2 max-sm:p-8'>
                    <div className='fill-personal font-bold text-xl '>
                        Add your Company Information
                    </div>
                    <label className='flex flex-col  gap-1 text-xs'>
                        Company Name
                        <input
                            type='text'
                            onChange={HandleCompanyInfo}
                            
                            name='company_name'
                            value={companyinfo.company_name}
                            className='signup-input border border-gray-300 w-64 h-8 ml-2'
                        />
                        {errors.company_name && <span className="text-red-500 text-xs">{errors.company_name}</span>}
                    </label>
                    <label className='flex flex-col mb-1 gap-1 text-xs'>Mobile
                        <div className='flex gap-3'>
                            <div className='flex justify-center items-center text-base border bg-white border-gray-300 w-14 h-8 ml-2'>+91</div>
                            <input
                                type='number'
                                value={companyinfo.mobile}
                                onChange={HandleCompanyInfo}
                                name='mobile'
                                className='signup-input border border-gray-300 w-60  h-8 ' 
                            />
                        </div>
                        {errors.mobile && <span className="text-red-500 text-xs">{errors.mobile}</span>}
                    </label>
                    <label className='flex flex-col  gap-1 text-xs'>Address Line 1
                        <input
                            type='text'
                            onChange={HandleCompanyInfo}
                            
                            value={companyinfo.address_line1}
                            name='address_line1'
                            className='signup-input border border-gray-300 w-64 h-8 ml-2' 
                        />
                        {errors.address_line1 && <span className="text-red-500 text-xs">{errors.address_line1}</span>}
                    </label>
                    <label className='flex flex-col  gap-1 text-xs'>Address Line 2
                        <input
                            type='text'
                            onChange={HandleCompanyInfo}
                            
                            value={companyinfo.address_line2}
                            name='address_line2'
                            className='signup-input border border-gray-300 w-64 h-8 ml-2' 
                        />
                    </label>
                    <div className="flex flex-row gap-5">
                        <label className='flex flex-col  gap-1 text-xs'>City
                            <input
                                type='text'
                                onChange={HandleCompanyInfo}
                                
                                value={companyinfo.city}
                                name='city'
                                className='signup-input border border-gray-300 w-20 h-8 ml-2' 
                            />
                            {errors.city && <span className="text-red-500 text-xs">{errors.city}</span>}
                        </label>
                        <label className='flex flex-col  gap-1 text-xs'>State
                            <input
                                type='text'
                                onChange={HandleCompanyInfo}
                                
                                value={companyinfo.state}
                                name='state'
                                className='signup-input border border-gray-300 w-20 h-8 ml-2' 
                            />
                            {errors.state && <span className="text-red-500 text-xs">{errors.state}</span>}
                        </label>
                        <label className='flex flex-col  gap-1 text-xs'>Pin Code
                            <input
                                type='text'
                                onChange={HandleCompanyInfo}
                                
                                value={companyinfo.pin_code}
                                name='pin_code'
                                className='signup-input border border-gray-300 w-20 h-8 ml-2' 
                            />
                            {errors.pin_code && <span className="text-red-500 text-xs">{errors.pin_code}</span>}
                        </label>
                    </div>
                    <button 
                    type='submit' 
                    style={{ backgroundColor: "#A91D3A" }}
                    className="continue-btn float-right px-5 py-2 mt-6 text-white">
                    Continue <FontAwesomeIcon className='text-white continue-btn' icon={faArrowRight} color='white' /></button>
                </div >
                <div className="flex flex-col gap-2 ml-9">
                    <div className='font-bold  text-base mb-3'>Add your Company Logo</div>
                    <div className="profile-add-text flex flex-col relative max-sm:flex-row">
                        <input type="file" title="" className='choose-file-box-company' id="" accept=" image/jpeg, image/png" onChange={handleChange} />
                    </div>
                    {errors.profile_image && <span className="text-red-500 text-xs">{errors.profile_image}</span>}

                </div>
            </form > 
    </>
    )
}

export default Companyinfo