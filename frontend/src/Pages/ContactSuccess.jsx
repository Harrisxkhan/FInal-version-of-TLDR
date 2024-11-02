import React from "react";
import { FiCheckCircle } from "react-icons/fi"; // Icon for success

const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-black flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-md rounded-lg  max-w-md w-full">
        <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Message Sent Successfully!</h1>
        <p className="text-lg mb-6">
          Thank you for getting in touch. We will get back to you shortly.
        </p>
        <a
          href="/contact"
          className="text-white bg-gray-800 hover:bg-gray-900 py-2 px-6 rounded-md inline-block"
        >
          Go Back
        </a>
      </div>
    </div>
  );
};

export default SuccessPage;
