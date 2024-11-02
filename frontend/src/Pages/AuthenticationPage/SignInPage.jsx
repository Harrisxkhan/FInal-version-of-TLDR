import { useContext, useState } from "react";
import Container from "../../Components/Shared/Container";
import loginImg from "/images/login.jpg";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../Providers/GlobalProvider";
import axios from "axios";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Logo from "../../Components/Shared/Logo";

export default function SignInPage() {
  const { setIsAuthenticate } = useContext(GlobalContext);
  const [passwordShow, setPasswordShow] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Password show function
  const handlePassShow = () => {
    setPasswordShow(passwordShow === "password" ? "text" : "password");
  };

  // Handle sign-in form
const handleSignin = async (e) => {
  e.preventDefault();

  // Initialize error messages
  const newErrors = {
    email: "",
    password: "",
  };

  // Check for empty fields and set specific error messages
  if (email.trim() === "") {
    newErrors.email = "*Email is required*";
  }
  if (password.trim() === "") {
    newErrors.password = "*Password is required*";
  }

  // If there are any errors, set the error state and return
  if (Object.values(newErrors).some((message) => message.length > 0)) {
    setError(newErrors);
    return;
  }

  // Clear errors if no issues
  setError(newErrors);

  const signinData = {
    email,
    password,
  };

  try {
    // Send login request to the backend
    const response = await axios.post("http://localhost:3000/login", signinData, {
      withCredentials: true, // Ensures cookies are sent and handled
    });

    console.log(response);
    const { data } = response;

    if (data.message === "Login successful") {
      // Set authenticated state in context or other state management
      setIsAuthenticate(true);

      // Redirect to home page after successful login
      navigate("/");
    }
  } catch (error) {
    // Handle login failure, show appropriate error messages
    const errorMessage =
      error.response?.data?.message || "Failed to sign in. Please try again.";
    navigate("/error", { state: { message: errorMessage } }); // Redirect to error page
  }
};


  const handleGoogleSignIn = async () => {
    try {
      window.location.href = "http://localhost:3000/auth/google";
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to sign in. Please try again later.");
      navigate("/error");
    }
  };

  const handleGithubSignIn = async () => {
    try {
      window.location.href = "http://localhost:3000/auth/github";
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to sign in. Please try again later.");
      navigate("/error");
    }
  };

  return (
    <Container>
      <div className="flex mx-auto justify-center md:gap-6 lg:gap-10 h-[100vh] items-center relative">
        {/* Logo */}
        <Link to={"/"} className="absolute top-6 left-4 text-2xl font-medium ">
          <Logo />
        </Link>

        <div className="text-center flex-1 mt-[100px] ">
          {/* Heading */}
          <div className="max-w-lg w-full mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-700 ">
              Welcome Back
            </h1>
            <p className="text-lg font-medium mt-2 text-gray-500">
              Are you ready to take the next step towards a successful career?
            </p>
          </div>

          {/* Sign-in form */}
          <form
            onSubmit={handleSignin}
            className="md:pt-8 md:pb-4 pt-4 pb-3 px-4"
          >
            <div className="max-w-lg mx-auto mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none ps-10">
                  <MdOutlineEmail className="text-base text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className=" border-b-2 border-gray-300 text-gray-900 focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
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
              className="max-w-lg w-full text-white bg-gray-800 hover:bg-gray-900 transition duration-150 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-xl px-5 py-2.5 mt-4"
            >
              Log In
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
              Don't have an account?{" "}
              <span className="text-blue-600 font-medium">
                <Link to={"/sign-up"}>Sign Up</Link>
              </span>
            </p>
          </div>
        </div>
        <div className="text-center flex-1 hidden md:flex justify-center ">
          <img
            className="w-full max-w-[550px] object-cover"
            src={loginImg}
            alt="Login"
          />
        </div>
      </div>
    </Container>
  );
}
