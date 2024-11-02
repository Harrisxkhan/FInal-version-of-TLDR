import { useState } from "react";
import Container from "../../Components/Shared/Container";
import AlertBox from "../../Components/AlertBox";
import signupImg from "/images/signup.jpg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { FaGithub, FaGoogle } from "react-icons/fa";
import React from "react";
import { useContext } from "react";
import { GlobalContext } from "../../Providers/GlobalProvider";
import Logo from "../../Components/Shared/Logo";

export default function SignUpPage() {
  const { setIsAuthenticate } = useContext(GlobalContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [passwordShow, setPasswordShow] = useState("password");
  const [error, setError] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [alert, setAlert] = useState(null); // null if no alert to show

  const closeAlert = () => setAlert(null);

  // Password show function
  const handlePassShow = () => {
    setPasswordShow((prevState) =>
      prevState === "password" ? "text" : "password"
    );
  };

  // Handle sign up form
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Initialize error messages
    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    // Check for empty fields and set specific error messages
    if (username.trim() === "") {
      newErrors.username = "*Username is required*";
    }
    if (email.trim() === "") {
      newErrors.email = "*Email is required*";
    }
    if (password.trim() === "") {
      newErrors.password = "*Password is required*";
    } else if (password.trim().length < 6) {
      newErrors.password = "*Password must be 6 charecters*";
    }

    // If there are any errors, set the error state and return
    if (Object.values(newErrors).some((message) => message.length > 0)) {
      setError(newErrors);
      return;
    }
    // Clear errors if no issues
    setError(newErrors);
    const signupData = {
      username,
      email,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/signup",
        signupData
      );
      if (
        response.data.message ===
        "Registration successful. Please check your email for verification link."
      ) {
        setAlert({
          type: "success",
          message: response.data.message,
        });
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to sign up. Please try again Later.";
      navigate("/error", { state: { message: errorMessage } }); // Pass error message to the error page
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      window.location.href = "http://localhost:3000/auth/google";
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to sign up. Please try again later.");
      navigate("/error");
    }
  };

  const handleGithubSignIn = async () => {
    try {
      window.location.href = "http://localhost:3000/auth/github";
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to sign up. Please try again later.");
      navigate("/error");
    }
  };

  return (
    <Container>
      <div className="flex justify-center md:gap-6 lg:gap-10 h-[100vh] items-center relative">
        {/* Logo */}
        <Link to={"/"} className="absolute top-6 left-4 text-2xl font-medium ">
          <Logo />
        </Link>

        {alert && (
          <AlertBox
            type={alert.type}
            message={alert.message}
            onClose={closeAlert}
          />
        )}

        <div className="text-center flex-1 mt-[100px]">
          {/* Heading */}
          <div className="">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-700">
              Create an Account
            </h1>
            <p className="text-lg font-medium mt-2 text-gray-500">
              Create an account on TLDR AI to get started today!
            </p>
          </div>
          {/* Sign up form */}
          <form onSubmit={handleSignUp} className="pt-8 pb-4 px-3">
            <div className="max-w-lg mx-auto mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none ps1-10">
                  <FaRegUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  id="name"
                  className="border-b-2 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
                  placeholder="Full Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {error.username && (
                  <p className="text-red-500 text-sm font-medium pt-1 absolute start-0">
                    {error.username}
                  </p>
                )}
              </div>
            </div>
            <div className="max-w-lg mx-auto mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none ps-10">
                  <MdOutlineEmail className="text-base text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border-b-2 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error.email && (
                  <p className="text-red-500 text-sm font-medium pt-1 absolute start-0">
                    {error.email}
                  </p>
                )}
              </div>
            </div>
            <div className="max-w-lg mx-auto mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 end-0 flex items-center ps-10">
                  {passwordShow === "password" ? (
                    <BsEye
                      onClick={handlePassShow}
                      className="text-[19px] cursor-pointer text-gray-500"
                    />
                  ) : (
                    <BsEyeSlash
                      onClick={handlePassShow}
                      className="text-[22px] cursor-pointer text-gray-500"
                    />
                  )}
                </div>
                <input
                  type={passwordShow}
                  name="password"
                  id="password"
                  className="border-b-2 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error.password && (
                  <p className="text-red-500 text-sm font-medium pt-1 absolute start-0">
                    {error.password}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="max-w-lg w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-lg px-5 py-2.5 mt-4"
            >
              Sign Up
            </button>
          </form>

          {/* OR */}
          <div className="max-w-lg w-full mx-auto">
            <div id="or">OR</div>
          </div>

          {/* Social media login icons */}
          <div className="max-w-lg w-full mx-auto my-5 flex justify-center items-center gap-4 md:gap-6">
            <button
              className="border-2 border-gray-600 p-2"
              onClick={handleGoogleSignIn}
            >
              <FaGoogle className="text-[24px]" />
            </button>
            <button
              className="border-2 border-gray-600 p-2"
              onClick={handleGithubSignIn}
            >
              <FaGithub className="text-[24px]" />
            </button>
          </div>

          {/* Have an account */}
          <div className="mt-3 md:text-lg">
            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <span className="text-blue-600 font-medium">
                <Link to={"/sign-in"}>Log in</Link>
              </span>
            </p>
          </div>
        </div>
        <div className="text-center flex-1 hidden md:flex justify-center items-center">
          <img
            className="w-full max-w-[550px] object-cover"
            src={signupImg}
            alt="Sign Up"
          />
        </div>
      </div>
    </Container>
  );
}
