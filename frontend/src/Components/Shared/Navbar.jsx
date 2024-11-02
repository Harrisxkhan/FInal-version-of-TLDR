import { useContext, useEffect, useState } from "react";
import avatar from "/images/toukir.jpg";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import Container from "./Container";
import { GlobalContext } from "../../Providers/GlobalProvider";
import axios from "axios";
import SearchModal from "../../Pages/Search"; // Import the SearchModal component

export default function Navbar() {
  const { isAuthenticate } = useContext(GlobalContext);
  const [profilepic, setProfilepic] = useState(null); // Set initial state to null
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          const response = await axios.get("http://localhost:3000/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProfilepic(response.data.profilePicture);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (isAuthenticate) {
      fetchUser();
    }
  }, [isAuthenticate]); // Re-run when authentication status changes

  return (
    <>
      {/* Navbar Section */}
      <Container>
        <div className="py-5 px-4 bg-white">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-medium">
              <Logo />
            </Link>

            {/* Conditional Rendering for Profile / Login Buttons */}
            <div className="flex items-center gap-4">
              {/* Search Button */}
              {isAuthenticate && (
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                  onClick={() => setIsSearchOpen(true)} // Toggle search modal
                >
                  Search Users
                </button>
              )}
              {/* Authentication Links */}
              {!isAuthenticate && (
                <div className="flex gap-4 font-medium">
                  <Link to="/sign-in" className="text-lg">
                    Log in
                  </Link>
                  <div className="text-[#AEAEAE]">|</div>
                  <Link to="/sign-up" className="text-lg">
                    Sign up
                  </Link>
                </div>
              )}

              {/* Profile Image for Authenticated User */}
              {isAuthenticate && (
                <Link to="/profile/edit-profile">
                  <img
                    className="w-[55px] rounded-full"
                    src={profilepic || avatar} // Fallback to default avatar
                    alt="Profile"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)} // Close modal handler
      />
    </>
  );
}
