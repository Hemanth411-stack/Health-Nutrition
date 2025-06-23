import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:5000/api/deliveries'; // Adjust based on your API endpoint

// Async Thunks
export const scheduleDelivery = createAsyncThunk(
  'deliveries/scheduleDelivery',
  async (deliveryData, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(API_URL, deliveryData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to schedule delivery'
      );
    }
  }
);

export const getUserDeliveries = createAsyncThunk(
  'deliveries/getUserDeliveries',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token;
      console.log("token",token)
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',

        },
      };

      const response = await axios.get(`${API_URL}/me`, config);
      console.log("response",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch deliveries'
      );
    }
  }
);

export const getAllDeliveries = createAsyncThunk(
  'deliveries/getAllDeliveries',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/all`, config);
      return response.data;
      cons
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch all deliveries'
      );
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  'deliveries/updateDeliveryStatus',
  async ({ deliveryId, status }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(
        `${API_URL}/${deliveryId}`,
        { status },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update delivery status'
      );
    }
  }
);

// Initial State
const initialState = {
  deliveries: [],
  allDeliveries: [],
  loading: false,
  error: null,
  success: false,
};

// Slice
const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    resetDeliveryState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Schedule Delivery
      .addCase(scheduleDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(scheduleDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deliveries.unshift(action.payload);
      })
      .addCase(scheduleDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Deliveries
      .addCase(getUserDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveries = action.payload;
        console.log("user deliveries",state.deliveries)
      })
      .addCase(getUserDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Deliveries (Admin)
      .addCase(getAllDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.allDeliveries = action.payload;
      })
      .addCase(getAllDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Delivery Status
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Update in deliveries array
        const index = state.deliveries.findIndex(
          (d) => d._id === action.payload._id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload;
        }
        // Update in allDeliveries array (for admin)
        const allIndex = state.allDeliveries.findIndex(
          (d) => d._id === action.payload._id
        );
        if (allIndex !== -1) {
          state.allDeliveries[allIndex] = action.payload;
        }
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDeliveryState } = deliverySlice.actions;
export default deliverySlice.reducer;



  return (
    <div className="pt-24 pb-16">
      <Header />
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Complete Your Subscription
          </h1>
          <p className="text-gray-600 mt-2">
            Fresh fruits delivered to your doorstep, just a few steps away
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600">
                    1
                  </span>
                  Personal Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.firstName ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.lastName ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="john.doe@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600">
                    2
                  </span>
                  Delivery Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address*
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.address ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="123 Main Street, Apartment 4B"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                      Area/Locality*
                    </label>
                    <input
                      type="text"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${errors.area ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="Gachibowli"
                    />
                    {errors.area && (
                      <p className="text-red-500 text-xs mt-1">{errors.area}</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.city ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="Hyderabad"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State*
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.state ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="Telangana"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode*
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.pincode ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="500081"
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        id="landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Near Apollo Hospital"
                      />
                    </div>
                  </div>
                </div>
              </div>

            {/* Delivery Preferences */}
<div className="bg-white rounded-xl shadow-sm p-6 mb-6">
  <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
    <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600">
      3
    </span>
    Delivery Preferences
  </h2>
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Preferred Delivery Time
      </label>
      <div className="flex space-x-4">
        <div
          className={`flex-1 border rounded-lg p-4 cursor-pointer transition-all ${formData.deliveryTime === "morning" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
          onClick={() => setFormData({...formData, deliveryTime: "morning"})}
        >
          <div className="flex items-center">
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.deliveryTime === "morning" ? "border-green-500" : "border-gray-300"}`}>
              {formData.deliveryTime === "morning" && (
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              )}
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Morning</h3>
              <p className="text-sm text-gray-500">6:00 AM - 9:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
        Start Date*
      </label>
      <input
        type="date"
        id="startDate"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        min={new Date().toISOString().split("T")[0]}
        className={`w-full px-4 py-2 rounded-lg border ${errors.startDate ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
      />
      {errors.startDate && (
        <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
      )}
      <p className="text-sm text-gray-500 mt-1">
        We deliver Monday through Saturday (No delivery on Sundays and major festivals)
      </p>
    </div>
    <div>
      <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700 mb-1">
        Delivery Instructions (Optional)
      </label>
      <textarea
        id="deliveryInstructions"
        name="deliveryInstructions"
        value={formData.deliveryInstructions}
        onChange={handleChange}
        rows={3}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="E.g., Leave at the door, call when arriving, etc."
      ></textarea>
    </div>
  </div>
</div>

              {/* Add-ons Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600">
                    4
                  </span>
                  Add-ons
                </h2>
                <div className="space-y-4">
                  <div className={`p-4 border rounded-lg ${formData.addOnPrices.useAndThrowBox ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.addOnPrices.useAndThrowBox > 0}
                          onChange={() => handleAddOnChange('useAndThrowBox', 200)}
                          className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">Use-and-Throw Box</h3>
                          <p className="text-sm text-gray-500">Eco-friendly disposable box</p>
                        </div>
                      </div>
                      <span className="font-medium">+₹400</span>
                    </div>
                  </div>
                  
                  <div className={`p-4 border rounded-lg ${formData.addOnPrices.eggs ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.addOnPrices.eggs > 0}
                          onChange={() => handleAddOnChange('eggs', 390)}
                          className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">Eggs</h3>
                          <p className="text-sm text-gray-500">2 eggs daily (₹10/day)</p>
                        </div>
                      </div>
                      <span className="font-medium">+₹390</span>
                    </div>
                  </div>
                  
                  <div className={`p-4 border rounded-lg ${formData.addOnPrices.ragiJawa ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.addOnPrices.ragiJawa > 0}
                          onChange={() => handleAddOnChange('ragiJawa', 400)}
                          className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">Ragi Jawa</h3>
                          <p className="text-sm text-gray-500">250ml daily (₹13/day)</p>
                        </div>
                      </div>
                      <span className="font-medium">+₹600</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 text-green-600">
                    5
                  </span>
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === "COD" ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                    onClick={() => setFormData({...formData, paymentMethod: "COD"})}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === "COD" ? "border-green-500" : "border-gray-300"}`}>
                        {formData.paymentMethod === "COD" && (
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        )}
                      </div>
                      <div className="ml-3 flex items-center">
                        <i className="fas fa-money-bill-wave text-gray-600 mr-2"></i>
                        <span>COD on Delivery</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer ${formData.paymentMethod === "PhonePe" ? "border-green-500 bg-green-50" : "border-gray-200"}`}
                    onClick={() => setFormData({...formData, paymentMethod: "PhonePe"})}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === "PhonePe" ? "border-green-500" : "border-gray-300"}`}>
                        {formData.paymentMethod === "PhonePe" && (
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        )}
                      </div>
                      <div className="ml-3 flex items-center">
                        <img 
                          src="https://static.vecteezy.com/system/resources/previews/049/116/753/non_2x/phonepe-app-icon-transparent-background-free-png.png"
                          alt="PhonePe" 
                          className="w-9 h-9 mr-2"
                        />
                        <span>PhonePe: 897822735</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* UTR Number Field (shown only when PhonePe is selected) */}
                  {formData.paymentMethod === "PhonePe" && (
                    <div className="mt-4">
                      <label htmlFor="utrNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        UTR Number*
                      </label>
                      <input
                        type="text"
                        id="utrNumber"
                        name="utrNumber"
                        value={formData.utrNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-lg border ${errors.utrNumber ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        placeholder="Enter UTR number from PhonePe"
                      />
                      {errors.utrNumber && (
                        <p className="text-red-500 text-xs mt-1">{errors.utrNumber}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Please enter the UTR number from your PhonePe payment receipt
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center">
                  <i className="fas fa-lock text-gray-500 mr-2"></i>
                  <p className="text-sm text-gray-500">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-green-600 hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-green-600 hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                    {errors.terms && (
                      <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-300 ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-circle-notch fa-spin mr-2"></i>
                    Processing...
                  </span>
                ) : (
                  "Confirm Subscription"
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">
                    {formData.productInfo?.name || "Subscription Plan"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">
                    ₹{formData.productInfo?.basePrice?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
              
              {/* Add-ons Summary */}
              <div className="space-y-2 border-b border-gray-200 pb-4 mb-4">
                <h3 className="font-medium text-gray-700">Add-ons:</h3>
                {formData.addOnPrices.useAndThrowBox > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Use-and-Throw Box:</span>
                    <span className="font-medium">+₹400</span>
                  </div>
                )}
                {formData.addOnPrices.eggs > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eggs:</span>
                    <span className="font-medium">+₹390</span>
                  </div>
                )}
                {formData.addOnPrices.ragiJawa > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ragi Jawa:</span>
                    <span className="font-medium">+₹600</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <div className="flex items-start">
                  <i className="fas fa-info-circle text-green-600 mt-1 mr-3"></i>
                  <div>
                    <h3 className="font-medium text-green-800">
                      Subscription Benefits
                    </h3>
                    <ul className="text-sm text-green-700 mt-2 space-y-1">
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-600 mt-1 mr-2"></i>
                        <span>Free delivery up to 12 KM</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-600 mt-1 mr-2"></i>
                        <span>No repetition of fruits in the same week</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-600 mt-1 mr-2"></i>
                        <span>Pause or modify subscription anytime</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
