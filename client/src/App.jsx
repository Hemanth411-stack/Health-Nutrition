import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import SubscriptionForm from "./components/SubscriptionForm";
import SubscriptionDashboard from "./components/Subscriptionpage.jsx";
import MyDeliveries from "./components/MyDeliveries.jsx";
import DeliveryManagement from "./components/deliverymanagement.jsx";
import CancellationMessages from "./components/CancellationMessages.jsx";
import AddressManagement from "./components/address.jsx";
import DeliveryVerificationDashboard from "./components/admindeliveryverification.jsx";
import AdminDashboard from "./components/admindashboard.jsx";
import DeliveryBoyRegister from "./components/deliveryboiregister.jsx";
import DeliveryBoyLogin from "./components/deliveryboilogin.jsx";
import LocationCapture from "./components/googleaddresses.jsx";
import ProfileComponent from "./components/deliveryboiprofile.jsx";
import AllDeliveries from "./components/adminalldeliveries.jsx";
import Deliveryboidetails from "./components/deliveryboidetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<SubscriptionForm />} />
      <Route path="/me" element={<SubscriptionDashboard />} />
      <Route path="/deliveries" element={<MyDeliveries />} />
      <Route path="/manage-delivery" element={<DeliveryManagement />} />
      <Route path="/cancellation-notices" element={<CancellationMessages />} />
      <Route path="/address" element={<AddressManagement />} />
      <Route
        path="/admin-address-verification"
        element={<DeliveryVerificationDashboard />}
      />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/delivery-boi-register" element={<DeliveryBoyRegister />} />
      <Route path="/login-deliverboi" element={<DeliveryBoyLogin />} />
       <Route path="/google-addresses" element={<LocationCapture />} />
        <Route path="/deliveryboi-profile" element={<ProfileComponent />} />
        <Route path="/admin-all-deliveries" element={<AllDeliveries />} />
        <Route path="/admin-all-deliveriesboidetails" element={<Deliveryboidetails />} />
    </Routes>
  );
}

export default App;