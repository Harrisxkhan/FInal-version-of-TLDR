import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useComment = (setComments, setCommentDataState) => {
  const [activePostId, setActivePostId] = useState(null);
  const [openCommentReplyID, setOpenCommentReplyID] = useState(null);
  const [shareMessage, setShareMessage] = useState("");
  const navigate = useNavigate();


  const handleCommentLike = async (commentId, replyId = null) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }
    try {
      // Send request to backend to like a comment/reply
      const response = await axios.post("/api/comments/like", {
        commentId,
        replyId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update state immutably
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === commentId) {
            if (replyId) {
              return {
                ...comment,
                replys: comment.replys.map((reply) =>
                  reply._id === replyId
                    ? { ...reply, is_liked: !reply.is_liked, like: response.data.likes }
                    : reply
                ),
              };
            } else {
              return {
                ...comment,
                is_liked: !comment.is_liked,
                like: response.data.likes,
              };
            }
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Error liking the comment:", error);
    }
  };
  


  const fetchComments = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/comments/${postId}`
      );
      console.log(response.data);
      console.log(response.data.comments);
      setComments(response.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }
    console.log(activePostId);
    const commentText = e.target.comment.value;
    const commentData = {
      comment: commentText,
      postID: activePostId,
    };
    console.log(commentData);
    try {
      await axios.post("http://localhost:3000/comment/add", commentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments(activePostId);
      e.target.reset();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentReply = async (e) => {
    
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }

    const commentReplyData = e.target.commentReply.value;
    const commentData = {
      comment: commentReplyData,
      postID: activePostId,
      commentID: openCommentReplyID,
    };

    try {
      await axios.post("http://localhost:3000/comment/reply", commentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments(activePostId);
      e.target.reset();
    } catch (error) {
      console.error("Error adding comment reply:", error);
    }
  };

  const handleNestedCommentReply = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/sign-in");
      return;
    }
    const nestedCommentReplyData = e.target.nestedCommentReply.value;
    const commentData = {
      comment: nestedCommentReplyData,
      postID: activePostId,
      commentID: openCommentReplyID,
    };

    try {
      await axios.post(
        `http://localhost:3000/comment/${openCommentReplyID}/reply`,
        { reply: nestedCommentReplyData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchComments(activePostId);
      e.target.reset();
    } catch (error) {
      console.error("Error adding nested comment reply:", error);
    }
  };

  const handleShareMessageChange = (e) => {
    setShareMessage(e.target.value);
  };

  return {
    activePostId,
    setActivePostId,
    openCommentReplyID,
    setOpenCommentReplyID,
    shareMessage,
    handleComment,
    handleCommentReply,
    handleNestedCommentReply,
    handleShareMessageChange,
    fetchComments,
    handleCommentLike
  };
};
