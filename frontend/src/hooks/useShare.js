import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useShare = (initialShareMessage = "") => {
  const [shareMessage, setShareMessage] = useState(initialShareMessage);
  const [isOpenshare, setIsOpenshare] = useState(false);
  const [sharePostID, setSharePostID] = useState(null);
  const navigate = useNavigate();

  const handleShareMessageChange = (e) => {
    setShareMessage(e.target.value);
  };

  const openShareModal = (postId) => {
    setSharePostID(postId);
    setIsOpenshare(true);
  };

  const handleShare = async () => {
    if (sharePostID) {
      await handleSharePost(sharePostID, shareMessage);
      setShareMessage(""); // Clear message after sharing
      setIsOpenshare(false); // Optionally close the modal after sharing
    } else {
      console.error("No active post ID to share");
    }
  };

  const handleSharePost = async (postId, message) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/post/share",
        { postId, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Post shared successfully");
      } else {
        console.error("Failed to share the post");
      }
    } catch (error) {
      console.error("Error sharing the post:", error);
    }
  };

  return {
    shareMessage,
    isOpenshare,
    setShareMessage,
    setIsOpenshare,
    handleShareMessageChange,
    openShareModal,
    handleShare,
  };
};
