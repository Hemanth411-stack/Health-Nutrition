import { useState, useEffect } from "react";
import { FaPhone, FaTimes, FaBars, FaUser, FaSignOutAlt, FaBoxOpen, FaUserShield, FaTruck, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slices/userSlice.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { fetchUserSubscriptions, selectSubscriptions } from "../Redux/Slices/subscriptionSlice.js";
import logo from '../../src/assets/image.png';
import ScrollingText from "../components/ScrollingText.jsx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const subscriptions = useSelector(selectSubscriptions);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const hasActiveSubscription = subscriptions?.some(
    (sub) => sub.status === "active" || sub.status === "completed" || sub.status === "pending"
  );

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserSubscriptions());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const goToMyPlans = () => {
    navigate('/me');
    setIsMenuOpen(false);
  };

  const goToAdminDashboard = () => {
    navigate('/admin-dashboard');
    setIsMenuOpen(false);
  };

  const goToDeliveries = () => {
    navigate('/manage-delivery');
    setIsMenuOpen(false);
  };

  const goToAddresses = () => {
    navigate('/address');
    setIsMenuOpen(false);
  };

  const navItems = [
    { id: "plans", label: "Plans" },
    { id: "why-us", label: "Why Choose Us" },
    { id: "benefits", label: "Benefits" },
    { id: "testimonials", label: "Testimonials" },
  ];

  return (
    <>
      <ScrollingText />
      <header
        className={`fixed top-8 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-lg py-2" : "bg-white/95 shadow-md py-3"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to='/' className="flex items-center">
            <img 
              src={logo}
              alt="7Star Fruit Box Logo"
              className="h-12 w-12 rounded-full object-cover border-2 border-yellow-400 shadow-md hover:scale-105 transition-transform duration-300"
            />
            <span className="ml-2 font-bold text-xl">
              <span className="text-green-800">7 Star</span>
              <span className="text-yellow-500"> Fruit Box</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {userInfo?.role === 'admin' && (
              <button
                onClick={goToAdminDashboard}
                className="flex items-center text-gray-800 hover:text-green-700 transition-colors duration-200 font-medium text-sm uppercase tracking-wider"
              >
                <FaUserShield className="mr-2" /> Admin
              </button>
            )}
            
            {userInfo?.role === 'deliveryboy' && (
              <button
                onClick={goToDeliveries}
                className="flex items-center text-gray-800 hover:text-green-700 transition-colors duration-200 font-medium text-sm uppercase tracking-wider"
              >
                <FaTruck className="mr-2" /> Deliveries
              </button>
            )}
            
            {userInfo && hasActiveSubscription && (
              <button
                onClick={goToMyPlans}
                className="flex items-center text-gray-800 hover:text-green-700 transition-colors duration-200 font-medium text-sm uppercase tracking-wider"
              >
                <FaBoxOpen className="mr-2" /> My Plans
              </button>
            )}
            
            {userInfo && (
              <button
                onClick={goToAddresses}
                className="flex items-center text-gray-800 hover:text-green-700 transition-colors duration-200 font-medium text-sm uppercase tracking-wider"
              >
                <FaMapMarkerAlt className="mr-2" /> My Addresses
              </button>
            )}
            
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSmoothScroll(item.id)}
                className="text-gray-800 hover:text-green-700 transition-colors duration-200 font-medium text-sm uppercase tracking-wider"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Contact and Auth Buttons */}
          <div className="flex items-center space-x-4">
            <a
              href="tel:+917082253728"
              className="hidden md:flex items-center bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium text-sm"
            >
              <FaPhone className="mr-2" />
              +91 70822 53728
            </a>

            {userInfo ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FaUser className="text-green-700 text-sm" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {userInfo.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-200"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-lg" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/signin')}
                className="hidden md:flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium text-sm"
              >
                Sign In
              </button>
            )}

            <button
              className="md:hidden text-gray-800 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed top-24 left-0 right-0 bg-white shadow-lg md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-full pointer-events-none"
            }`}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {userInfo?.role === 'admin' && (
                  <button
                    onClick={goToAdminDashboard}
                    className="flex items-center text-gray-800 hover:text-green-700 py-2 font-medium text-sm uppercase tracking-wider"
                  >
                    <FaUserShield className="mr-2" /> Admin Dashboard
                  </button>
                )}
                
                {userInfo?.role === 'deliveryboy' && (
                  <button
                    onClick={goToDeliveries}
                    className="flex items-center text-gray-800 hover:text-green-700 py-2 font-medium text-sm uppercase tracking-wider"
                  >
                    <FaTruck className="mr-2" /> Deliveries
                  </button>
                )}
                
                {userInfo && hasActiveSubscription && (
                  <button
                    onClick={goToMyPlans}
                    className="flex items-center text-gray-800 hover:text-green-700 py-2 font-medium text-sm uppercase tracking-wider"
                  >
                    <FaBoxOpen className="mr-2" /> My Plans
                  </button>
                )}
                
                {userInfo && (
                  <button
                    onClick={goToAddresses}
                    className="flex items-center text-gray-800 hover:text-green-700 py-2 font-medium text-sm uppercase tracking-wider"
                  >
                    <FaMapMarkerAlt className="mr-2" /> My Addresses
                  </button>
                )}
                
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSmoothScroll(item.id)}
                    className="text-gray-800 hover:text-green-700 py-2 font-medium text-sm uppercase tracking-wider text-left"
                  >
                    {item.label}
                  </button>
                ))}
                
                <a
                  href="tel:+917082253728"
                  className="flex items-center bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium text-sm"
                >
                  <FaPhone className="mr-2" />
                  +91 70822 53728
                </a>
                
                {userInfo ? (
                  <>
                    <div className="flex items-center space-x-2 py-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FaUser className="text-green-700 text-sm" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {userInfo.name.split(' ')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition-colors duration-200 font-medium text-sm"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/signin');
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium text-sm"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;