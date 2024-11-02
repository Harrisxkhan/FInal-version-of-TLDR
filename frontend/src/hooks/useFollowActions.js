import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useFollowActions = () => {
  const [confirmed, setConfirmed] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFollowClick = async (userId) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/suggestion/follow",
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setConfirmed((prev) => ({ ...prev, [userId]: true }));
      setMessage("Follow request sent successfully!");
    } catch (error) {
      console.error("Error following user:", error);
      setMessage("Failed to send follow request.");
    }
  };

  const handleConfirm = async (requestId) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/follow/confirm",
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Follow request confirmed:", response);
      setConfirmed((prev) => ({ ...prev, [requestId]: true }));
      setMessage("Follow request confirmed!");
    } catch (error) {
      console.error("Error confirming follow request:", error);
      setMessage("Failed to confirm follow request.");
    }
  };

  const handleDelete = async (requestId) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/follow/delete",
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Follow request deleted");
      setMessage("Follow request deleted successfully!");
    } catch (error) {
      console.error("Error deleting follow request:", error);
      setMessage("Failed to delete follow request.");
    }
  };

  return {
    handleFollowClick,
    handleConfirm,
    handleDelete,
    confirmed,
    message,
    setMessage,
  };
};
