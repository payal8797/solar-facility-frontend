import React from 'react';
import { Navigate  } from 'react-router-dom';
import { useAuth } from './context/authContext';


//To protect from accessing the application without login
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/login" replace />;

};

export default ProtectedRoute;
