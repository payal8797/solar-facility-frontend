import { jwtDecode } from "jwt-decode";
import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';

const initialState = {
  user: null,
};

// Check if there's a token in localStorage during initialization
if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'));
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
  } else {
    initialState.user = decodedToken;
  }
}

// Create an authentication context with initial values
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
  isLoggedIn: false,
});

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);

// Reducer function to manage state changes related to authentication
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

// Authentication provider component to manage authentication state
const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isLoggedIn, setIsLoggedIn] = useState(!!initialState.user);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData,
    });
    setIsLoggedIn(true);
  };

  // Function to handle logout action
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({
      type: 'LOGOUT',
    });
    setIsLoggedIn(false);
  };

  // To check localStorage for token during component initialization
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      logout();
    } else {
      dispatch({
        type: 'LOGIN',
        payload: decodedToken,
      });
      setIsLoggedIn(true);
    }}}, []);

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout, isLoggedIn }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
