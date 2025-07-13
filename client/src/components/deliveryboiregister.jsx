import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerDeliveryBoy, resetAuthState } from '../Redux/Slices/deliveryboi';
import {
  selectDeliveryBoyToken,
  selectAuthStatus,
  selectAuthError
} from '../Redux/Slices/deliveryboi';

const hyderabadAreas = [
  "Abids", "Adikmet", "Alwal", "Amberpet", "Ameerpet", "Asif Nagar", "Athapur",
  "Attapur", "Azampura", "Bachupally", "Bahadurpura", "Balanagar", "Banjara Hills", 
  "Barkatpura", "Basheerbagh", "Begumpet", "Bharat Nagar", "Boduppal", "Borabanda", 
  "Bowenpally", "Chandanagar", "Chilkur", "Chintal", "Dammaiguda", "Dilsukhnagar", 
  "DLF Gachibowli", "ECIL", "Erragadda", "Film Nagar", "Gachibowli", "Gaganpahad", 
  "Gajularamaram", "Gandhinagar", "Ghatkesar", "Golconda", "Gowlidoddi", "Hafeezpet", 
  "Himayatnagar", "Hitech City", "Hyderguda", "Jagadgirigutta", "Jambagh", 
  "Jeedimetla", "Jubilee Hills", "Kachiguda", "Kalasiguda", "Karkhana", "Khairatabad", 
  "Kismatpur", "Kompally", "Kondapur", "Kothaguda", "Koti", "KPHB Colony", "Kukatpally", 
  "Langar Houz", "LB Nagar", "Lal Darwaza", "Langer House", "Madhapur", "Madhinaguda",
  "Malakpet", "Manikonda", "Marredpally", "Masab Tank", "Medchal", "Mehdipatnam", 
  "Mettuguda", "Miyapur", "Moosapet", "Moula Ali", "Musheerabad", "Nagole", 
  "Nallagandla", "Nallakunta", "Nanakramguda","Nampally","Lakdikapaul", "Narayanaguda", "Narsingi", "Nizampet", 
  "Nursing", "Old City", "Panjagutta", "Paradise", "Pet Basheerabad", "Pragathi Nagar", 
  "Quthbullapur", "Ramanthapur", "RTC X Roads", "Safilguda", "Sainikpuri", 
  "Sanathnagar", "Saroornagar", "Secunderabad", "Shaikpet", "Shamshabad", 
  "Shapur Nagar", "Sherlingampally", "Shivam Road", "Somajiguda", "SR Nagar",
  "Sri Nagar Colony", "Tarnaka", "Tolichowki", "Uppal", "Vidyanagar", 
  "West Marredpally", "Yapral", "Yousufguda"
];

const DeliveryBoyRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const token = useSelector(selectDeliveryBoyToken);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceAreas: []
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filter areas based on search term
  const filteredAreas = hyderabadAreas.filter(area =>
    area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/manage-delivery');
    }
  }, [token, navigate]);

  // Reset form after successful registration
  useEffect(() => {
    if (status === 'succeeded') {
      setFormData({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        serviceAreas: []
      });
      setProfileImage(null);
      setPreviewImage(null);
      setTimeout(() => {
        navigate('/login-deliverboi');
      }, 2000);
    }
  }, [status, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setErrors(prev => ({ ...prev, profileImage: 'Only image files are allowed' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: 'File size must be less than 5MB' }));
        return;
      }
      
      setProfileImage(file);
      setErrors(prev => ({ ...prev, profileImage: null }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setErrors(prev => ({ ...prev, profileImage: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAreaSelect = (area) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }));
    
    if (errors.serviceAreas) {
      setErrors({
        ...errors,
        serviceAreas: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.serviceAreas.length === 0) {
      newErrors.serviceAreas = 'Please select at least one service area';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    dispatch(resetAuthState());
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('serviceAreas', JSON.stringify(formData.serviceAreas));
    if (profileImage) {
      formDataToSend.append('profileImage', profileImage);
    }
    
    dispatch(registerDeliveryBoy(formDataToSend));
  };

  const isSubmitting = status === 'loading';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Delivery Boy Registration
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your delivery partner account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Success Message */}
          {status === 'succeeded' && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Registration successful! Redirecting to login...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Profile Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Image
              </label>
              <div className="mt-1 flex items-center">
                <div className="relative rounded-full overflow-hidden h-16 w-16 bg-gray-200">
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <svg
                      className="h-full w-full text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112 15c3.183 0 6.235 1.264 8.485 3.515A9.975 9.975 0 0024 20.993zM12 12a6 6 0 100-12 6 6 0 000 12z" />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <input
                    id="profileImage"
                    name="profileImage"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="profileImage"
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {previewImage ? 'Change' : 'Upload'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPEG, PNG (Max 5MB)
                  </p>
                  {errors.profileImage && (
                    <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Service Areas */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Areas
              </label>
              <div className="mt-1">
                {/* Search Input */}
                <div className="mb-2">
                  <input
                    type="text"
                    placeholder="Search areas..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="relative">
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {filteredAreas.length > 0 ? (
                      filteredAreas.map((area) => (
                        <div key={area} className="flex items-center">
                          <input
                            id={`area-${area}`}
                            type="checkbox"
                            checked={formData.serviceAreas.includes(area)}
                            onChange={() => handleAreaSelect(area)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`area-${area}`} className="ml-2 block text-sm text-gray-700">
                            {area}
                          </label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 p-2">No areas found matching your search</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        serviceAreas: []
                      });
                    }}
                    className="absolute right-0 top-0 mt-1 mr-2 px-2 py-1 text-xs text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                </div>
                {errors.serviceAreas && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceAreas}</p>
                )}
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Selected Areas:</p>
                  {formData.serviceAreas.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.serviceAreas.map(area => (
                        <span 
                          key={area}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {area}
                          <button
                            type="button"
                            onClick={() => handleAreaSelect(area)}
                            className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                          >
                            <span className="sr-only">Remove</span>
                            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No areas selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login-deliverboi"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBoyRegister;