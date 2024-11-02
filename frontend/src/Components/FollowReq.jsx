import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../Providers/GlobalProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FollowReq() {
  const { setSuggFollowStatus, setViewProfileData } = useContext(GlobalContext);
  const [followRequests, setFollowRequests] = useState([]); // Start with an empty array
  const [confirmed, setConfirmed] = useState({});
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => {
        setActionMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  useEffect(() => {
    // Fetch follow requests from the backend when the component mounts
    const fetchFollowRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/follow/requests"
        );
        // console.log(response.data);
        setFollowRequests(response.data); // Set the fetched data directly
      } catch (error) {
        console.error("Error fetching follow requests:", error);
      }
    };
    fetchFollowRequests();
  }, [navigate]);

  const handleConfirm = async (requestId) => {
    try {
      await axios.post("http://localhost:3000/follow/confirm", { requestId });
      setFollowRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      setActionMessage("Follow request confirmed successfully!");
    } catch (error) {
      console.error("Error confirming follow request:", error);
    }
  };

  const handleDelete = async (requestId) => {
    try {
      await axios.post("http://localhost:3000/follow/delete", { requestId });

      setFollowRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== requestId)
      );
      setActionMessage("Follow request deleted successfully!");
    } catch (error) {
      console.error("Error deleting follow request:", error);
    }
  };

  return (
    <div className="bg-white py-4 border-gray-300 rounded-b-xl h-[calc(100vh-300px)] cursor-pointer">
      <h6 className="font-medium px-4 border-b pb-4">Follow Requests</h6>
      {actionMessage && (
        <div className="bg-green-50 text-green-800 text-center p-2 mb-4 rounded">
          {actionMessage}
        </div>
      )}
      <div className="h-[calc(100vh-359px)] overflow-y-scroll follow_box">
        {followRequests.map((data) => (
          <div
            onClick={() => {
              setViewProfileData(data);
              setSuggFollowStatus("suggested");
              navigate("/profile/view-profile", {
                state: { userId: data._id },
              });
            }}
            key={data._id} // Use the unique _id from the fetched data
            className="py-3 border-b relative"
          >
            <p className="text-sm text-gray-500 font-medium absolute right-2">
              {data.timeStamp}
            </p>
            <div className="flex gap-2 items-center px-3">
              <div>
                <img className="w-10 rounded-full" src={data.img} alt="" />
              </div>
              <div>
                <div className="flex justify-between w-full">
                  <p className="text-sm font-medium">{data.username}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  {confirmed[data._id] ? (
                    <p className="text-sm font-medium text-green-500">
                      Confirmed
                    </p>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConfirm(data._id);
                        }}
                        className="hover:bg-black bg-gray-800 transition duration-150 text-white text-sm py-[2px] px-3 rounded-full"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(data._id);
                        }}
                        className="border-gray-700 border hover:border-gray-900 text-gray-700 hover:text-gray-900 transition duration-150 text-sm py-[2px] px-3 rounded-full"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
