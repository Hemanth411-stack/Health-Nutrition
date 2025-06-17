import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../Redux/Slices/userSlice';

const Signin = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get the loading state and error from Redux store
  const { status, error: authError } = useSelector(state => state.user);
  const isSubmitting = status === 'loading';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Dispatch the login action
        const resultAction = await dispatch(loginUser({
          phone: formData.phone,
          password: formData.password
        }));
        
        // Check if the login was successful
        if (loginUser.fulfilled.match(resultAction)) {
          navigate('/'); // Redirect after successful login
        }
      } catch (err) {
        // Errors are already handled by the Redux slice
        console.error('Login error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
          {/* Image Side (matches signup layout) */}
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

          {/* Form Side */}
          <div className="md:w-1/2 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome back!
            </h2>
            
            {/* Display authentication error from Redux */}
            {authError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {authError}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="Enter your registered phone number"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

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
                  placeholder="Enter your password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                {/* <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                    Forgot password?
                  </Link>
                </div> */}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;