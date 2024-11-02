import React from "react";
import { FaHeart, FaComment } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import axios from "axios";
axios.defaults.withCredentials = true;

function PostItem({
  post,
  onLike,
  onCommentClick,
  isUser = true,
  onShareClick,
  onDelete, 
  }) {
  if (!post) {
    return <div>No post data available</div>;
  }

  const {
    author_name = "Unknown",
    author_img = "https://via.placeholder.com/150",
    time_stamp = "Unknown time",
    title = "No title",
    post_content = "No content",
    post_id = "",
    is_liked = false,
    like = 0,
    comment = 0,
    share = 0,
  } = post;

 
  return (
    <div className="my-4 bg-white rounded-xl shadow-md">
      <div className="flex gap-2 items-center p-2 cursor-pointer w-fit">
        <img src={author_img} className="w-12 rounded-full" alt="Author" />
        <div>
          <p className="font-medium">{author_name}</p>
          <p className="text-sm text-primary-100">{time_stamp}</p>
        </div>
      </div>
      <h5 className="text-xl font-medium px-2 py-1">{title}</h5>
      <p className="px-2">{post_content}</p>
      <div className="flex justify-between mt-4 px-4 pb-4">
        <button
          className="flex items-center gap-1"
          onClick={() => onLike(post_id, is_liked)}
        >
          {is_liked ? (
            <FaHeart className="text-rose-600" />
          ) : (
            <FaHeart className="text-txt-200" />
          )}
          <p>{like}</p>
        </button>
        <button
          className="flex items-center gap-1"
          onClick={() => onCommentClick(post_id)}
        >
          <FaComment className="text-txt-200" />
          <p>{comment}</p>
        </button>
        {isUser ? (
          <button 
            className="flex items-center gap-1" 
            onClick={() => onDelete(post_id)}
          >
          <MdDelete className="text-2xl text-txt-200" />
          </button>
          ) : (
          <button
            onClick={() => onShareClick(post_id)}
            className="flex items-center gap-1"
          >
            <IoIosShareAlt className="text-2xl text-txt-200" />
            <p>{share}</p>
          </button>
        )}
      </div>
    </div>
  );
}
export default PostItem;