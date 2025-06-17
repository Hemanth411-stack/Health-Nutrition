import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RequireAuth({ children }) {
  const token = useSelector(state => state.user?.userInfo?.token); // or whatever field you store it in
  const location = useLocation();

  if (!token) {
    // Bounce to /Signin and remember where the user was headed
    return <Navigate to="/Signin" replace state={{ from: location }} />;
  }

  return children;
}
