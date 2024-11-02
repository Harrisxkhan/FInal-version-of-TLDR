import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
axios.defaults.withCredentials = true;

const UserSearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get("http://localhost:3000/search/users",{
          params: { value }, // Correctly pass the query parameter

        });
        console.log(response.data);
        setResults(response.data); // Assume the backend sends back the array of user data
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    } else {
      setResults([]); // Clear results if search term is empty
    }
  };
  const handleOverlayClick = (e) => {
    e.stopPropagation();
    onClose();
  };
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-white w-[95%] max-w-lg p-6 rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-4 text-gray-600 text-2xl hover:text-gray-800"
              onClick={onClose}
            >
              <IoCloseOutline />
            </button>

            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute inset-y-0 left-3 top-3 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded-full py-2 px-4 pl-10 w-full outline-none focus:border-gray-600"
                placeholder="Search for users..."
              />
            </div>

            {/* Search Results */}
            <div className="mt-4">
              {isLoading ? (
                <p className="text-gray-500 mt-2">Loading...</p> // Show loading state
              ) : results.length > 0 ? (
                <ul className="text-gray-700">
                  {results.map((user, index) => (
                    <li
                      key={index}
                      className="py-2 border-b border-gray-300 cursor-pointer flex justify-between"
                      onClick={() =>
                        navigate("/profile/view-profile", {
                          state: { userId: user._id }, // Use the correct user ID
                        })
                      }
                    >
                      @{user.username} <IoIosArrowForward />
                    </li>
                  ))}
                </ul>
              ) : (
                searchTerm.length !== 0 &&
                results.length === 0 && (
                  <p className="text-gray-500 mt-2">No users found.</p>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSearchModal;
