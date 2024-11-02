// src/components/AuthSuccess.js

import React, { useEffect, useContext } from 'react';
import axios from '../utils/axiosConfig'; // Adjust the path as necessary
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const { setIsAuthenticate, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Verifying user session...');
    axios.get('/api/user/profile')
      .then(response => {
        console.log('Received user profile:', response.data);
        if (response.data.user) {
          setUser(response.data.user); // Store user data in context
          setIsAuthenticate(true);
          navigate("/"); // Redirect to homepage or dashboard
        } else {
          console.error('User not authenticated');
          navigate("/error");
        }
      })
      .catch(error => {
        console.error('Error verifying session:', error);
        navigate("/error");
      });
  }, [setIsAuthenticate, setUser, navigate]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
