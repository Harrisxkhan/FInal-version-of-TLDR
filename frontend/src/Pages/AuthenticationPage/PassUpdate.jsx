import { useState } from "react";
import Container from "../../Components/Shared/Container";
import avater from "/images/avatar.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiFillEyeInvisible } from "react-icons/ai";
import { CiLock } from "react-icons/ci";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Navbar from "../../Components/Shared/Navbar";
axios.defaults.withCredentials = true;

export default function PassUpdate() {
  const [passInput1, setPassInput1] = useState(false);
  const [passInput2, setPassInput2] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePassShow = (inputNo) => {
    if (inputNo === 1) {
      setPassInput1(!passInput1);
    } else if (inputNo === 2) {
      setPassInput2(!passInput2);
    }
  };

  const validatePassword = (newPassword, confirmPassword) => {
    if (newPassword.length < 6) {
      return "New password must be at least 6 characters long.";
    }
    if (newPassword !== confirmPassword) {
      return "New password and confirm password do not match.";
    }
    return null;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const currentPassword = e.target.current_pass.value;
    const newPassword = e.target.new_pass.value;
    const confirmPassword = e.target.confirm_pass.value;

    // Validate the input fields
    if (!currentPassword) {
      setError("Current password cannot be empty.");
      return;
    }

    const validationError = validatePassword(newPassword, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    const changePasswordData = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };


    try {
      const response = await axios.post(
        "http://localhost:3000/passwordChange",
        changePasswordData,
        
      );
      console.log(response.data); // Log the response from the backend
      navigate("/profile/edit-profile/change-password/change-successfully"); // Redirect to the success page after password change
    } catch (error) {
      console.error("Error changing password:", error);
      // Handle the error (e.g., display error message to the user)
      setError("There was an error changing your password. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center h-[calc(100vh-96px)] px-4">
        <Container>
          <div className="text-center flex-1 mt-20 pb-10">
            <div className="max-w-lg w-full mx-auto">
              <img className="w-36 mx-auto" src={avater} alt="avater" />
              <p className="font-medium text-xl">Update Password</p>
            </div>
            <form onSubmit={handlePasswordChange} className="py-8">
              {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
              )}
              <div className="max-w-lg mx-auto mb-4 md:mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none ps-10">
                    <CiLock size={22} className="text-base text-gray-500" />
                  </div>
                  <input
                    type="password"
                    name="current-pass"
                    id="current_pass"
                    className="border-b-2 border-gray-300 text-gray-900 text focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
                    placeholder="Current Password"
                  />
                </div>
              </div>
              <div className="max-w-lg mx-auto mb-4 md:mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 flex items-center ps-10">
                    {passInput1 ? (
                      <BsEye
                        onClick={() => handlePassShow(1)}
                        className="text-[22px] cursor-pointer text-gray-500"
                      />
                    ) : (
                      <BsEyeSlash
                        onClick={() => handlePassShow(1)}
                        className="text-[19px] cursor-pointer text-gray-500"
                      />
                    )}
                  </div>
                  <input
                    type={passInput1 ? "text" : "password"}
                    name="new-pass"
                    id="new_pass"
                    className="border-b-2 border-gray-300 text-gray-900 text focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
                    placeholder="New Password"
                  />
                </div>
              </div>
              <div className="max-w-lg mx-auto mb-4 md:mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 end-0 flex items-center ps-10">
                    {passInput2 ? (
                      <BsEye
                        onClick={() => handlePassShow(2)}
                        className="text-[22px] cursor-pointer text-gray-500"
                      />
                    ) : (
                      <BsEyeSlash
                        onClick={() => handlePassShow(2)}
                        className="text-[19px] cursor-pointer text-gray-500"
                      />
                    )}
                  </div>
                  <input
                    type={passInput2 ? "text" : "password"}
                    name="confirm-pass"
                    id="confirm_pass"
                    className="border-b-2 border-gray-300 text-gray-900 text focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
              <div className="max-w-lg w-full mx-auto flex flex-wrap justify-between gap-x-1">
                <button
                  type="submit"
                  className="w-full md:w-auto text-gray-800 bg-white hover:bg-gray-800 hover:text-white border-2 border-gray-800 ease-in-out duration-150 focus:outline-none font-medium px-5 py-2.5 mt-4"
                >
                  Save Password
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full md:w-auto text-gray-800 bg-white hover:bg-gray-800 hover:text-white border-2 border-gray-800 ease-in-out duration-150 focus:outline-none font-medium px-5 py-2.5 mt-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </div>
  );
}
