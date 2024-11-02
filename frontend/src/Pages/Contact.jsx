import React, { useState } from "react";
import axios from "axios";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { BsChatText } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Use `useNavigate` instead of `useHistory`

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const newError = {};

    if (!name) newError.name = "Full name is required";
    if (!email) newError.email = "Email is required";
    if (!message) newError.message = "Message is required";

    setError(newError);

    if (Object.keys(newError).length === 0) {
      try {
        await axios.post("http://localhost:3000/contact", {
          name,
          email,
          message,
        });

        navigate("/thank-you");
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 max-w-lg w-full"
      >
        <h2 className="text-2xl mb-6 text-center font-bold">Contact Us</h2>

        <div className="mb-4">
          <div className="relative">
            <FaRegUser className="absolute inset-y-0 right-3 text-gray-500 pointer-events-none" />
            <input
              type="text"
              name="name"
              className="border-b-2 border-gray-300 text-gray-900 focus:border-gray-600 block w-full p-2.5 outline-none"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error.name && (
              <p className="text-red-500 text-sm pt-1">{error.name}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <MdOutlineEmail className="absolute inset-y-0 right-3 text-gray-500 pointer-events-none" />
            <input
              type="email"
              name="email"
              className="border-b-2 border-gray-300 text-gray-900 focus:border-gray-600 block w-full p-2.5 outline-none"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && (
              <p className="text-red-500 text-sm pt-1">{error.email}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <BsChatText className="absolute inset-y-0 right-3 text-gray-500 pointer-events-none" />
            <textarea
              name="message"
              className="border-b-2 border-gray-300 text-gray-900 focus:border-gray-600 block w-full p-2.5 outline-none"
              placeholder="Your Message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            {error.message && (
              <p className="text-red-500 text-sm pt-1">{error.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full text-white bg-gray-800 hover:bg-gray-900 font-medium text-lg px-5 py-2.5 mt-4 focus:outline-none"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
