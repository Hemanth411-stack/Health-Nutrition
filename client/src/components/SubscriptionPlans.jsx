import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, selectAllProducts, selectProductStatus, selectProductError } from "../Redux/Slices/productslice";
import logo from "../assets/familybox.png";


const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductStatus);
  const error = useSelector(selectProductError);
  const token = useSelector(state => state.user?.userInfo?.token);
  const [selectedAddons, setSelectedAddons] = useState({
    familyPlan: { ragiJawa: false, eggs: false, useAndThrowBox: false },
    bachelorPlan: { ragiJawa: false, eggs: false, useAndThrowBox: false },
    babyPlan: { ragiJawa: false, eggs: false, useAndThrowBox: false }
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const toggleAddon = (planType, addonType) => {
    setSelectedAddons(prev => ({
      ...prev,
      [planType]: {
        ...prev[planType],
        [addonType]: !prev[planType][addonType]
      }
    }));
  };

  const handleSubscribe = (productId, planType) => {
    const selectedProduct = products.find(product => product._id === productId);
    if (!token) {
      // Optionally remember where the user was heading so you can
      // bounce them back here after a successful sign‑in.
      navigate('/signin', {
        replace: true,
        state: { redirectTo: '/checkout' }   // or whatever makes sense
      });
      return;  // stop right here
    }
    if (!selectedProduct) return;

    const planData = {
      productId,
      paymentMethod: "COD",
      startDate: new Date().toISOString().split('T')[0],
      addOnPrices: {
        ragiJawa: selectedAddons[planType].ragiJawa ? 400 : 0,
        eggs: selectedAddons[planType].eggs ? 300 : 0,
        useAndThrowBox: selectedAddons[planType].useAndThrowBox ? 200 : 0
      },
      productInfo: {
        name: selectedProduct.name,
        description: selectedProduct.description,
        basePrice: selectedProduct.price,
        image: selectedProduct.image
      }
    };

    navigate("/checkout", { state: { plan: planData } });
  };

  const ADDON_CONFIG = [
    {
      id: 'ragiJawa',
      name: 'Ragi Jawa',
      price: 600,
      description: '',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 8a1 1 0 100-2 1 1 0 000 2zM9 10a1 1 0 100-2 1 1 0 000 2zM12 7a1 1 0 100-2 1 1 0 000 2zM15 9a1 1 0 100-2 1 1 0 000 2z" />
          <path fillRule="evenodd" d="M2 12a8 8 0 0116 0 1 1 0 01-1 1H3a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M5 14a1 1 0 100-2 1 1 0 000 2zM8 16a1 1 0 100-2 1 1 0 000 2zM11 14a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      )
    },
    {
      id: 'eggs',
      name: 'Eggs',
      price: 390,
      description: '1 egg daily',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-800" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 18a8 8 0 008-8c0-4.5-3-9-8-9S2 5.5 2 10a8 8 0 008 8z"/>
        </svg>
      )
    },
    {
      id: 'useAndThrowBox',
      name: 'Use-and-Throw Box',
      price: 400,
      description: 'Eco-friendly disposable box',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v7h-2l-1-1a1 1 0 00-1.414 0L10 12.586 8.707 11.293a1 1 0 00-1.414 0L6 14H4V5zm5 4a1 1 0 100-2 1 1 0 000 2zm4-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  if (status === 'loading') return <div className="text-center py-20">Loading plans...</div>;
  if (status === 'failed') return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  const familyPlan = products.find(product => product.name === "Family Pack");
  const bachelorPlan = products.find(product => product.name === "Bachelor Pack");
  const babyPlan = products.find(product => product.name === "Kid box");

  const renderPlanCard = (plan, planType) => {
    if (!plan) return null;
    
    // Determine color scheme based on plan type
    let colorScheme;
    switch(planType) {
      case 'familyPlan':
        colorScheme = {
          bg: 'bg-green-600',
          light: 'bg-green-100',
          text: 'text-green-200',
          button: 'bg-green-600 hover:bg-green-700',
          check: 'text-green-500'
        };
        break;
      case 'bachelorPlan':
        colorScheme = {
          bg: 'bg-blue-600',
          light: 'bg-blue-100',
          text: 'text-blue-200',
          button: 'bg-blue-600 hover:bg-blue-700',
          check: 'text-blue-500'
        };
        break;
      case 'babyPlan':
        colorScheme = {
          bg: 'bg-purple-600',
          light: 'bg-purple-100',
          text: 'text-purple-200',
          button: 'bg-purple-600 hover:bg-purple-700',
          check: 'text-purple-500'
        };
        break;
      default:
        colorScheme = {
          bg: 'bg-gray-600',
          light: 'bg-gray-100',
          text: 'text-gray-200',
          button: 'bg-gray-600 hover:bg-gray-700',
          check: 'text-gray-500'
        };
    }

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
        {/* Header with dynamic color */}
        <div className={`${colorScheme.bg} text-white py-6 px-6`}>
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <span className="text-sm font-bold bg-opacity-20 py-1 rounded-full">
          {plan.name === "Family Pack" ? "570gm" : 
          plan.name === "Bachelor Pack" ? "400gm" : 
          plan.name === "Kid box" ? "150gm" : ""}
          </span>
          <div className="flex items-end mt-2">
            <span className="text-3xl font-bold">₹{plan.price}</span>
            <span className={`ml-2 ${colorScheme.text}`}>/month</span>
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="space-y-4 mb-6">
            {ADDON_CONFIG.map(addon => (
              <div key={addon.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="mr-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {addon.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold">{addon.name} </h4>
                    <p className="text-gray-600 text-sm">{addon.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 font-medium">+₹{addon.price}</span>
                  <button
                    onClick={() => toggleAddon(planType, addon.id)}
                    className={`w-20 py-1 rounded-full text-sm font-medium ${
                      selectedAddons[planType][addon.id]
                        ? `${colorScheme.button} text-white`
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {selectedAddons[planType][addon.id] ? 'Added' : 'Add'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-col md:flex-row gap-4 flex-grow">
            <div className="flex-1">
              <h4 className="font-semibold mb-3">Package Includes:</h4>
              <ul className="space-y-2">
                {plan.contents?.includes?.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className={`w-4 h-4 mt-1 mr-2 flex-shrink-0 ${colorScheme.check}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="rounded-full overflow-hidden h-40 w-40 border-4 border-white shadow-lg hover:scale-105 transition-transform duration-300 mx-auto">
                <img 
                  src={logo} 
                  alt={plan.name} 
                  className="object-cover h-full w-full"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSubscribe(plan._id, planType)}
            className={`w-full ${colorScheme.button} text-white py-3 rounded-lg font-semibold transition duration-300 mt-auto`}
          >
            Subscribe Now - ₹{
              plan.price +
              (selectedAddons[planType].ragiJawa ? ADDON_CONFIG.find(a => a.id === 'ragiJawa').price : 0) +
              (selectedAddons[planType].eggs ? ADDON_CONFIG.find(a => a.id === 'eggs').price : 0) +
              (selectedAddons[planType].useAndThrowBox ? ADDON_CONFIG.find(a => a.id === 'useAndThrowBox').price : 0)
            }
          </button>
        </div>
      </div>
    );
  };

  return (
    <section id="plans" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our subscription boxes are designed to provide you with the
            perfect balance of nutrition and taste. Fresh fruits delivered
            right to your doorstep.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {renderPlanCard(familyPlan, 'familyPlan')}
          {renderPlanCard(bachelorPlan, 'bachelorPlan')}
          {renderPlanCard(babyPlan, 'babyPlan')}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionPlans;