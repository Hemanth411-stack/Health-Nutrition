import React from "react"
import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Signin from "./Pages/Signin"
import Signup from "./Pages/Signup"
import SubscriptionForm from "./components/SubscriptionForm"
import SubscriptionDashboard from "./components/Subscriptionpage.jsx"
import MyDeliveries from "./components/MyDeliveries.jsx"
import SubscriptionManagement from "./components/adminpage.jsx"
import DeliveryManagement from "./components/deliverymanagement.jsx"
import CancellationMessages from "./components/CancellationMessages.jsx"
import RequireAuth from "./security/RequireAuth.jsx"


function App() {
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signup" element={<Signup />} />

      {/* 🔐 Protected section */}
      <Route element={<RequireAuth />}>
        <Route path="/checkout" element={<SubscriptionForm />} />
        <Route path="/me" element={<SubscriptionDashboard />} />
        <Route path="/deliveries" element={<MyDeliveries />} />
        <Route path="/admin-subscription" element={<SubscriptionManagement />} />
        <Route path="/manage-delivery" element={<DeliveryManagement />} />
        <Route path="/cancellation-notices" element={<CancellationMessages />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
