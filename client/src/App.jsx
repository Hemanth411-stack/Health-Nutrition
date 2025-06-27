import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SmoothRender from "./components/smoothrender.jsx";
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

const AnimatedRoute = ({ element, delay = 0 }) => {
  const location = useLocation();

  // Skip animation for these paths
  const noAnimationPaths = ['/Signin', '/Signup'];
  if (noAnimationPaths.includes(location.pathname)) {
    return element;
  }

  return <SmoothRender delay={delay}>{element}</SmoothRender>;
};

function App() {
  return (
    <Routes>
      {/* Public routes without animation */}
      <Route path="/Signin" element={<Signin />} />
      <Route path="/Signup" element={<Signup />} />

      {/* Animated routes */}
      <Route
        path="/"
        element={<AnimatedRoute element={<Home />} delay={0} />}
      />
      <Route
        path="/checkout"
        element={<AnimatedRoute element={<SubscriptionForm />} delay={100} />}
      />
      <Route
        path="/me"
        element={<AnimatedRoute element={<SubscriptionDashboard />} delay={200} />}
      />
      <Route
        path="/deliveries"
        element={<AnimatedRoute element={<MyDeliveries />} delay={300} />}
      />
      <Route
        path="/manage-delivery"
        element={<AnimatedRoute element={<DeliveryManagement />} delay={400} />}
      />
      <Route
        path="/cancellation-notices"
        element={<AnimatedRoute element={<CancellationMessages />} delay={500} />}
      />
      <Route
        path="/address"
        element={<AnimatedRoute element={<AddressManagement />} delay={600} />}
      />
      <Route
        path="/admin-address-verification"
        element={<AnimatedRoute element={<DeliveryVerificationDashboard />} delay={700} />}
      />
      <Route
        path="/admin-dashboard"
        element={<AnimatedRoute element={<AdminDashboard />} delay={800} />}
      />
      <Route
        path="/delivery-boi-register"
        element={<AnimatedRoute element={<DeliveryBoyRegister />} delay={900} />}
      />
      <Route
        path="/login-deliverboi"
        element={<AnimatedRoute element={<DeliveryBoyLogin />} delay={1000} />}
      />
    </Routes>
  );
}

export default App;