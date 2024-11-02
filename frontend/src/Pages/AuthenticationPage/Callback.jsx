import React, { useEffect } from 'react';
import axios from 'axios';
import { useContext } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const { setIsAuthenticate } = useContext(GlobalContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log('Sending request to /auth/token...');
    axios.get('http://localhost:3000/auth/token', { withCredentials: true })
      .then(response => {
        console.log('Received response:', response);
        if (response.data.isAuthenticated) {        
          setIsAuthenticate(true);  // Authenticated
          navigate('/');
        } else {
          setIsAuthenticate(false); // Not authenticated
          navigate('/');
        }
      })
      .catch(error => {
        console.error('Error during authentication:', error);
        navigate("/error");
      });
  }, [setIsAuthenticate, navigate]);

  return <div>Loading...</div>;
};

export default AuthSuccess;
