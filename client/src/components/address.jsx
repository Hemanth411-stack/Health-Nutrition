import React, { useState, useEffect } from 'react';
import { FiPlus, FiChevronRight, FiCheck, FiClock, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createDeliveryVerification, 
  getMyVerificationStatus,
  resetVerificationState
} from '../Redux/Slices/deliverystatusmanagement.js';
import { toast } from 'react-toastify';
import Header from "../components/Header.jsx";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// API Keys (should be moved to environment variables in production)
const GOOGLE_MAP_API_KEY = "AIzaSyAMPrwC9ii-4QvIRA_75CbxSp-6keDC6aM";

// Map container styles
const containerStyle = {
  width: "100%",
  height: "300px",
  marginTop: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const AddressManagement = () => {
  const dispatch = useDispatch();
  const { 
    myVerification, 
    loading, 
    error, 
    success 
  } = useSelector((state) => state.verifyDelivery);

  const { userInfo } = useSelector((state) => state.user);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMethod, setLocationMethod] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });

  // Safely handle null/undefined myVerification
  const addressList = Array.isArray(myVerification) ? myVerification : [];

  // Load user's verification on mount
  useEffect(() => {
    if (userInfo) {
      dispatch(getMyVerificationStatus());
    }
  }, [dispatch, userInfo]);

  // Handle notifications and state updates
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetVerificationState());
      setIsSubmitting(false);
    }
    
    if (success) {
      toast.success(editingId ? 'Address updated successfully!' : 'Address added successfully!');
      setShowForm(false);
      setEditingId(null);
      resetForm();
      setIsSubmitting(false);
      dispatch(getMyVerificationStatus()).then(() => {
        dispatch(resetVerificationState());
      });
    }
  }, [error, success, dispatch, editingId]);

  // Fetch address when coordinates change
  useEffect(() => {
    if (coords) {
      setLastUpdated(new Date());
    }
  }, [coords]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Main location acquisition function
 // Main location acquisition function - Updated version
// Updated getCurrentLocation function
const getCurrentLocation = async () => {
  setLocationLoading(true);
  setLocationMethod(null);
  
  try {
    if (navigator.geolocation) {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const newCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setCoords(newCoords);
      setLocationMethod("GPS");

      // Use LocationIQ for reverse geocoding (more reliable than Google for address components)
      try {
        const LOCATIONIQ_TOKEN = "pk.2facabff1fbb7c3da67ac5b80179b3e3"; // Your LocationIQ token
        const response = await fetch(
          `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_TOKEN}&lat=${newCoords.lat}&lon=${newCoords.lng}&format=json`
        );
        const data = await response.json();
        
        if (data.address) {
          const addr = data.address;
          setFormData({
            street: addr.road || addr.pedestrian || addr.footway || '',
            area: addr.suburb || addr.neighbourhood || addr.quarter || '',
            city: addr.city || addr.town || addr.village || addr.county || '',
            state: addr.state || addr.region || '',
            pincode: addr.postcode || '',
            type: formData.type // Keep existing type
          });
        }
      } catch (geocodeError) {
        console.error("Geocoding error:", geocodeError);
        toast.info("Got your location but couldn't fetch full address details");
      }

      return newCoords;
    } else {
      throw new Error("Geolocation is not supported by this browser.");
    }
  } catch (error) {
    console.error("Location error:", error);
    toast.error("Couldn't get precise location. Please try manual selection.");
    return null;
  } finally {
    setLocationLoading(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Generate Google Maps link
    let googleMapsLink = "";
    if (coords) {
      googleMapsLink = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    } else {
      // Fallback to address-based link if coordinates not available
      const addressString = `${formData.street}, ${formData.area}, ${formData.city}, ${formData.state} ${formData.pincode}`;
      googleMapsLink = `https://www.google.com/maps?q=${encodeURIComponent(addressString)}`;
    }

    const addressData = {
      address: {
        street: formData.street,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        type: formData.type,
        googleMapLink: googleMapsLink,
      },
      
      
      
    };

    try {
      if (editingId) {
        console.log("address data with google map link",addressData)
        await dispatch(createDeliveryVerification({
          ...addressData,
          id: editingId
        })).unwrap();
      } else {
        await dispatch(createDeliveryVerification(addressData)).unwrap();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      type: 'Home'
    });
    setCoords(null);
    setAddress("");
    setSearchAddress("");
  };

  // Handle map clicks
  const handleMapClick = async (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setCoords({ lat: newLat, lng: newLng });
    setLocationMethod("Map Selection");
  };

  // Safely check for pending verifications
  const hasPendingVerification = addressList.some(
    address => address?.verifydeliverystatus === 'pending'
  );

  return (
    <div className="max-w-md mx-auto px-4 pb-20 font-sans bg-gray-50 min-h-screen">
      <Header/>
      <div className="pt-30 top-0 z-10 bg-white py-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold text-gray-900">Saved Addresses</h1>
      </div>

      {/* Loading state */}
      {loading && addressList.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {/* Address List */}
          {addressList.length > 0 ? (
            <div className="space-y-3 mt-4">
              {addressList.map(address => (
                <div 
                  key={address._id} 
                  className={`bg-white rounded-lg p-4 shadow-xs ${
                    address.verifydeliverystatus === 'approved' ? 'border-l-4 border-green-500' : 
                    address.verifydeliverystatus === 'not-deliverable' ? 'border-l-4 border-red-500' : 'border-l-4 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">
                          {address.address?.type || 'Address'}
                        </span>
                        {address.verifydeliverystatus === 'approved' ? (
                          <span className="flex items-center text-green-600 text-xs">
                            <FiCheck className="mr-1" /> Deliverable
                          </span>
                        ) : address.verifydeliverystatus === 'pending' ? (
                          <span className="flex items-center text-yellow-600 text-xs">
                            <FiClock className="mr-1" /> Verification pending
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600 text-xs">
                            <FiX className="mr-1" /> Not deliverable
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-900">{address.address?.street}</p>
                      <p className="text-gray-600 text-sm">
                        {address.address?.area}, {address.address?.city} - {address.address?.pincode}
                      </p>
                      {address.googleMapsLink && (
                        <a 
                          href={address.googleMapsLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 text-xs mt-1 inline-block hover:underline"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setFormData({
                          street: address.address?.street || '',
                          area: address.address?.area || '',
                          city: address.address?.city || '',
                          state: address.address?.state || '',
                          pincode: address.address?.pincode || '',
                          type: address.address?.type || 'Home'
                        });
                        if (address.coordinates) {
                          setCoords(address.coordinates);
                        }
                        setEditingId(address._id);
                        setShowForm(true);
                      }}
                      className="text-gray-400 hover:text-orange-500 ml-2"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-16">
              <div className="bg-gray-200 p-6 rounded-full mb-4">
                <FiPlus className="text-gray-500 text-2xl" />
              </div>
              <p className="text-gray-600 mb-4 text-center">You haven't saved any addresses yet</p>
            </div>
          )}
        </>
      )}

      {/* Add New Address Button (Fixed at bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 px-4 shadow-md">
        <button
          onClick={() => {
            if (!hasPendingVerification && !loading) {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }
          }}
          className={`
            w-full flex items-center justify-center
            px-4 py-3 rounded-lg
            transition-all duration-200
            ${hasPendingVerification || loading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
            }
          `}
          disabled={hasPendingVerification || loading}
        >
          <FiPlus className="mr-2" />
          <span className="font-medium">
            {hasPendingVerification
              ? 'Verification in Progress'
              : loading ? 'Loading...' : 'Add New Address'}
          </span>
        </button>
      </div>

      {/* Add/Edit Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-md mt-12 mb-8">
            <div className="sticky top-0 bg-white py-4 px-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <button 
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Home', 'Work', 'Other'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, type})}
                        className={`py-2 text-sm rounded-md border ${
                          formData.type === type 
                            ? 'border-orange-500 bg-orange-50 text-orange-600' 
                            : 'border-gray-300 bg-white'
                        }`}
                        disabled={isSubmitting}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address</label>
                  <textarea
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    rows="3"
                    placeholder="House/Flat No, Building, Street"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Area/Locality"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="City"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="State"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="6-digit pincode"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Map Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Pin</label>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading || isSubmitting}
                      className={`px-3 py-2 text-sm rounded-md border ${
                        locationLoading 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {locationLoading ? 'Locating...' : 'Use Current Location'}
                    </button>
                    {locationMethod && (
                      <span className="text-xs text-gray-500">
                        ({locationMethod} - {lastUpdated?.toLocaleTimeString()})
                      </span>
                    )}
                  </div>
                  
                  {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={coords || { lat: 20.5937, lng: 78.9629 }} // Default to India center
                      zoom={coords ? 15 : 5}
                      onClick={handleMapClick}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        styles: [
                          {
                            featureType: "poi",
                            stylers: [{ visibility: "off" }]
                          }
                        ]
                      }}
                    >
                      {coords && (
                        <Marker 
                          position={coords} 
                          icon={{
                            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                            fillColor: "#4285F4",
                            fillOpacity: 1,
                            strokeColor: "#fff",
                            strokeWeight: 1,
                            scale: 1.5
                          }}
                        />
                      )}
                    </GoogleMap>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagement;