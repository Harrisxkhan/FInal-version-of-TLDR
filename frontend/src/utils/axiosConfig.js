// src/utils/axiosConfig.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Update with your backend URL
  withCredentials: true, // Enable sending of cookies
});

export default axiosInstance;
