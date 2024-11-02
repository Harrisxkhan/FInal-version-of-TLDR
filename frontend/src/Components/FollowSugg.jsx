import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../Providers/GlobalProvider";
axios.defaults.withCredentials = true;

export default function FollowSugg() {
  const navigate = useNavigate();
  const { setSuggFollowStatus } = useContext(GlobalContext);

  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowClick = (userId) => {
    axios
      .post("http://localhost:3000/suggestion/follow", { userId })
      .then((response) => {
        console.log("Follow request successful:", response);
        // Update the suggestion state to reflect the "requested" status
        setSuggestions((prevSuggestions) =>
          prevSuggestions.map((data) => {
            if (data._id === userId) {
              return { ...data, requested: true };
            }
            return data;
          })
        );
        // Set timeout to hide the button after 1 second
        setTimeout(() => {
          setSuggestions((prevSuggestions) =>
            prevSuggestions.filter((data) => data._id !== userId)
          );
        }, 1000);
      })
      .catch((error) => {
        console.log("Error during follow request:", error);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          "http://localhost:3000/follow/suggestions"
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching follow suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleRequest = (userId, requested) => {
    if (requested) {
      console.log("Already requested to follow this user:", userId);
    } else {
      handleFollowClick(userId);
    }
  };

  return (
    <div className="bg-white py-4 border-gray-300 rounded-b-xl h-[calc(100vh-300px)] cursor-pointer">
      <h6 className="font-medium px-4 border-b pb-4">Suggested for you</h6>
      <div className="h-[calc(100vh-359px)] overflow-y-scroll follow_box">
        {suggestions.map((data) => (
          <div
            key={data._id}
            className="py-3 border-b border-gray-300 bg-white"
            onClick={() => {
              setSuggFollowStatus("suggested");
              navigate("/profile/view-profile", {
                state: { userId: data._id },
              });
            }}
          >
            <div className="flex gap-1 px-3">
              <img
                className="w-10 rounded-full"
                src={data.profilePicture}
                alt=""
              />
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="text-sm font-medium">{data.username}</p>
                  <p className="text-sm text-txt-100">Suggested for you</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRequest(data._id, data.requested);
                  }}
                  className={`transition duration-150 text-white text-sm py-[2px] px-3 rounded-full ${
                    data.requested
                      ? "bg-gray-600 cursor-not-allowed"
                      : "hover:bg-black bg-gray-800"
                  }`}
                  disabled={data.requested}
                >
                  {data.requested ? "Requested" : "Follow"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
