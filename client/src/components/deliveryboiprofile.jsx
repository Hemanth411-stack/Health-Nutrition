import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  updateDeliveryBoyProfile,
  logout,
  resetAuthState
} from '../Redux/Slices/deliveryboi.js';
import {
  selectDeliveryBoy,
  selectDeliveryBoyToken,
  selectAuthStatus,
  selectAuthError
} from '../Redux/Slices/deliveryboi.js';
import { FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaCamera, FaTimes } from 'react-icons/fa';

const hyderabadAreas = [
  "Ameerpet", "Abids", "Adikmet", "Alwal", "Amberpet", "Asif Nagar", "Attapur",
  "Azampura", "Bachupally", "Bahadurpura", "Balanagar", "Banjara Hills", "Barkatpura",
  "Basheerbagh", "Begumpet", "Bharat Nagar", "Boduppal", "Borabanda", "Bowenpally",
  "Chandanagar", "Chilkur", "Chintal", "Dammaiguda", "Dilsukhnagar", "DLF Gachibowli",
  "ECIL", "Erragadda", "Film Nagar", "Gachibowli", "Gaganpahad", "Gajularamaram",
  "Gandhinagar", "Ghatkesar", "Golconda", "Gowlidoddi", "Hafeezpet", "Himayatnagar",
  "Hitech City", "Hyderguda", "Jambagh", "Jubilee Hills", "Jagadgirigutta",
  "Jeedimetla", "Kachiguda", "Kalasiguda", "Karkhana", "Khairatabad", "Kismatpur",
  "Kompally", "Kondapur", "Kothaguda", "Koti", "KPHB Colony", "Kukatpally", "Langar Houz",
  "LB Nagar", "Lal Darwaza", "Langer House", "Madhapur", "Malakpet", "Manikonda",
  "Marredpally", "Masab Tank", "Medchal", "Mehdipatnam", "Mettuguda", "Miyapur",
  "Moosapet", "Moula Ali", "Musheerabad", "Nagole", "Nallakunta", "Nanakramguda",
  "Narayanaguda", "Narsingi", "Nizampet", "Old City", "Panjagutta", "Paradise",
  "Pet Basheerabad", "Pragathi Nagar", "Quthbullapur", "Ramanthapur", "RTC X Roads",
  "Safilguda", "Sainikpuri", "Sanathnagar", "Saroornagar", "Secunderabad", "Shaikpet",
  "Shamshabad", "Shapur Nagar", "Shivam Road", "Somajiguda", "SR Nagar",
  "Sri Nagar Colony", "Tarnaka", "Tolichowki", "Uppal", "Vidyanagar", "West Marredpally",
  "Yapral", "Yousufguda"
];

const ProfileComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const deliveryBoyInfo = useSelector(selectDeliveryBoy);
  const token = useSelector(selectDeliveryBoyToken);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceAreas: []
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [updateAttempted, setUpdateAttempted] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (deliveryBoyInfo) {
      setFormData({
        name: deliveryBoyInfo.name || '',
        phone: deliveryBoyInfo.phone || '',
        serviceAreas: deliveryBoyInfo.serviceAreas || []
      });
      // Set preview image from deliveryBoyInfo if it exists
      if (deliveryBoyInfo.profileImage) {
        setPreviewImage(deliveryBoyInfo.profileImage);
      }
    }
  }, [deliveryBoyInfo]);

  // Scroll to top when status changes to succeeded
  useEffect(() => {
    if (status === 'succeeded' && updateAttempted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [status, updateAttempted]);

  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

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
    setPreviewImage(deliveryBoyInfo?.profileImage || null); // Revert to original image if exists
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
    if (formData.serviceAreas.length === 0) {
      newErrors.serviceAreas = 'Please select at least one service area';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUpdateAttempted(true);
    
    if (!validateForm()) return;
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('serviceAreas', JSON.stringify(formData.serviceAreas));
    if (profileImage) {
      formDataToSend.append('profileImage', profileImage);
    } else if (!previewImage && deliveryBoyInfo?.profileImage) {
      // If removing existing image
      formDataToSend.append('removeImage', 'true');
    }
    
    dispatch(updateDeliveryBoyProfile({
      formData: formDataToSend,
      token: token
    }));
  };

  const isSubmitting = status === 'loading';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <button 
            onClick={() => navigate('/manage-delivery')}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="ml-4 text-xl font-bold text-gray-800">Delivery Partner Profile</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Success/Error messages */}
        {status === 'succeeded' && updateAttempted && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6" ref={formRef}>
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-white shadow-md overflow-hidden">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FaUser className="text-4xl" />
                    </div>
                  )}
                </div>
                {previewImage && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaCamera className="mr-2" />
                  {previewImage ? 'Change Photo' : 'Upload Photo'}
                </label>
                {errors.profileImage && (
                  <p className="mt-2 text-sm text-red-600 text-center">{errors.profileImage}</p>
                )}
              </div>
            </div>

            {/* Name Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                <div className="flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  Full Name
                </div>
              </label>
              <input
                className={`block w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:outline-none`}
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                <div className="flex items-center">
                  <FaPhone className="mr-2 text-gray-500" />
                  Phone Number
                </div>
              </label>
              <input
                className={`block w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} shadow-sm focus:outline-none`}
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your 10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Service Areas Field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-500" />
                  Service Areas
                </div>
              </label>
              <div className={`rounded-lg border ${errors.serviceAreas ? 'border-red-300' : 'border-gray-300'} p-4 bg-gray-50`}>
                <p className="text-sm text-gray-600 mb-3">Select areas where you can deliver:</p>
                
                {/* Search and Filter (for large lists) */}
                <input
                  type="text"
                  placeholder="Search areas..."
                  className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    // Implement search/filter if needed
                  }}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2">
                  {hyderabadAreas.map((area) => (
                    <div key={area} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`area-${area}`}
                        value={area}
                        checked={formData.serviceAreas.includes(area)}
                        onChange={() => handleAreaSelect(area)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`area-${area}`} className="ml-2 text-sm text-gray-700">
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {errors.serviceAreas && (
                <p className="mt-2 text-sm text-red-600">{errors.serviceAreas}</p>
              )}
              
              {/* Selected Areas Preview */}
              {formData.serviceAreas.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected Areas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.serviceAreas.map(area => (
                      <span 
                        key={area}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isSubmitting ? 'opacity-70' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfileComponent;