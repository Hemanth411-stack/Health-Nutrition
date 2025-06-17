import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../Redux/Slices/userSlice.js'; 
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: authError } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    isSubscribed: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        isSubscribed: formData.isSubscribed
      }));

      if (registerUser.fulfilled.match(result)) {
        navigate('/'); 
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
          {/* Fruit Box Image Side */}
          <div className="md:w-1/2 bg-green-50 flex items-center justify-center p-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
                alt="Fresh Fruit Box"
                className="mx-auto h-64 w-auto rounded-lg object-cover shadow-md"
              />
              <h2 className="mt-6 text-3xl font-extrabold text-green-700">
                7Star Fruit Box
              </h2>
              <p className="mt-2 text-lg text-green-600">
                Fresh fruits delivered to your doorstep
              </p>
            </div>
          </div>

          {/* Signup Form Side */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Create your account
            </h2>
            
            {/* Display authentication error from Redux */}
            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {authError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  />
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="isSubscribed"
                  name="isSubscribed"
                  type="checkbox"
                  checked={formData.isSubscribed}
                  onChange={handleChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="isSubscribed" className="ml-2 block text-sm text-gray-700">
                  Subscribe to our newsletter
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to='/Signin' className="font-medium text-green-600 hover:text-green-500">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;