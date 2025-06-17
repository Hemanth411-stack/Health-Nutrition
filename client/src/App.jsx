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


function App() {
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/Signin" element={<Signin/>}></Route>
      <Route path="/Signup" element={<Signup/>}></Route>
      <Route path="/checkout" element={<SubscriptionForm/>}></Route>
      <Route path="/me" element={<SubscriptionDashboard/>}></Route>
      <Route path="/deliveries" element={<MyDeliveries/>}></Route>
      <Route path="/admin-subscription" element={<SubscriptionManagement/>}></Route>
      <Route path="/manage-delivery" element={<DeliveryManagement/>}></Route>
      <Route path="/cancellation-notices" element={<CancellationMessages />} />
    </Routes>
    </>
  )
}

export default App
