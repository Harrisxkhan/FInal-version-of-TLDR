import React from "react";
import { FaHeart } from "react-icons/fa";
import { IoClose, IoSend } from "react-icons/io5";
import axios from "axios";
import { useState } from "react";
axios.defaults.withCredentials = true;

const CommentModal = ({
  isOpen,
  onClose,
  comments,
  handleComment,
  handleCommentReply,
  handleNestedCommentReply,
  handleShareMessageChange,
  shareMessage,
  openCommentReplyID,
  setOpenCommentReplyID,
  openCommentNestedReplyID,
  setOpenCommentNestedReplyID,
  toukir,
}) => {
  if (!isOpen) return null;

  const [likedComments, setLikedComments] = useState({});

  const handleCommentLike = async (commentID, replyId = null, is_liked) => {
    
    try {
      // Send request to backend to like a comment/reply
      const response = await axios.post(
        `http://localhost:3000/like/${commentID}`,
        {
          replyId,
        },
       
      );
      // Toggle the like status in the local state
      setLikedComments((prevState) => ({
        ...prevState,
        [replyId || commentID]: !is_liked,
      }));
    } catch (error) {
      console.error("Error liking the comment:", error);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed top-0 left-0 w-screen h-screen bg-[#00000056] z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] md:w-[600px] lg:w-[700px] bg-white rounded-md absolute right-[50%] translate-x-1/2 top-[18%] md:top-[12%] flex flex-col justify-between"
      >
        <div className="bg-white">
          <div className="flex justify-end items-center py-2 px-2 border-b">
            <button
              type="button"
              className="text-2xl hover:bg-gray-100 p-1 rounded-full transition duration-150"
              onClick={onClose}
            >
              <IoClose />
            </button>
          </div>
          <div className="px-3">
            <div className="max-h-[450px] overflow-y-auto comment_scroll">
              {comments.map((data, key) => (
                <React.Fragment key={key}>
                  <div className="flex mt-2 pr-2">
                    <div className="pr-2 mr-1 shrink-0">
                      <img
                        className="w-8 h-8 rounded-full object-cover"
                        src={data.img}
                        alt="user"
                      />
                    </div>
                    <div>
                      <div className="bg-[#F0F2F5] py-1 px-2 rounded">
                        <p>
                          <span className="font-semibold text-sm">
                            {data.name}
                          </span>
                        </p>
                        <p className="mb-1 text-gray-800 leading-[1.3] text-sm">
                          {data.comment}
                        </p>
                      </div>
                      <div className="flex justify-between mt-1 gap-10 text-sm font-medium text-gray-700 ml-3">
                        <div className="flex gap-5">
                          <span>{data.timeStamp}</span>
                          <button
                            style={{ color: data.is_liked ? "red" : "black" }}
                            onClick={() =>
                              handleCommentLike(
                                data._id,
                                null,
                                likedComments[data._id]
                              )
                            }
                            className={`${
                              data.is_liked ? "text-rose-500" : "text-black"
                            }`}
                          >
                            Like
                          </button>
                          <button
                            onClick={() => {
                              setOpenCommentNestedReplyID(null);
                              setOpenCommentReplyID(data._id);
                            }}
                          >
                            Reply
                          </button>
                        </div>
                        <div className="flex items-center gap-[2px]">
                          <p>{data.like}</p>
                          <FaHeart
                            className={`${
                              likedComments[data._id]
                                ? "text-rose-500"
                                : "text-black"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Normal Reply Form */}
                  {openCommentReplyID === data._id &&
                    !openCommentNestedReplyID && (
                      <form
                        onSubmit={handleCommentReply}
                        className="flex items-center bg-[#F0F2F5] w-[60%] ml-10 mb-3 relative md:left-32"
                      >
                        <img
                          className="w-6 h-6 rounded-full mx-2 border border-gray-300"
                          src={toukir}
                          alt=""
                        />
                        <input
                          type="text"
                          id="commentReply"
                          className="w-full mt-1 outline-none  py-1 bg-[#F0F2F5] text-sm comment_placeholder"
                          placeholder={`Reply to ${data.name}`}
                        />
                        <button className="text-xl hover:bg-[#d1d2d4] py-[14px] pr-3 pl-4 transition duration-200">
                          <IoSend />
                        </button>
                      </form>
                    )}

                  <div className="ml-7">
                    {data.replys.map((reply, key) => (
                      <React.Fragment key={key}>
                        <div className="flex mt-2">
                          <div className="pr-2 mr-1 shrink-0">
                            <img
                              className="w-8 h-8 rounded-full object-cover"
                              src={reply.img}
                              alt="user"
                            />
                          </div>
                          <div>
                            <div className="bg-[#F0F2F5] py-1 px-2 rounded">
                              <p>
                                <span className="font-semibold text-sm">
                                  {reply.name}
                                </span>
                              </p>
                              <p className="mb-1 text-gray-800 leading-[1.3] text-sm">
                                {reply.comment}
                              </p>
                            </div>
                            <div className="flex gap-10 justify-between mt-1 text-sm font-medium text-gray-700 ml-3">
                              <div className="flex gap-5">
                                <span>{reply.timeStamp}</span>
                                <button
                                  onClick={() =>
                                    handleCommentLike(
                                      data._id,
                                      reply._id,
                                      likedComments[reply._id]
                                    )
                                  }
                                  className={`${
                                    likedComments[reply._id]
                                      ? "text-rose-500"
                                      : "text-black"
                                  }`}
                                >
                                  Like
                                </button>
                                <button
                                  onClick={() => {
                                    setOpenCommentReplyID(data._id);
                                    setOpenCommentNestedReplyID(reply._id);
                                  }}
                                >
                                  Reply
                                </button>
                              </div>
                              <div className="flex items-center gap-[2px]">
                                <p>{reply.like}</p>
                                <FaHeart
                                  className={`${
                                    likedComments[reply._id]
                                      ? "text-rose-500"
                                      : "text-black"
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Nested Reply Form */}
                        {openCommentReplyID === data._id &&
                          openCommentNestedReplyID === reply._id && (
                            <form
                              onSubmit={handleNestedCommentReply}
                              className="flex items-center bg-[#F0F2F5] w-[60%] ml-10 mb-3 relative md:left-32"
                            >
                              <img
                                className="w-6 h-6 rounded-full mx-2 border border-gray-300"
                                src={toukir}
                                alt=""
                              />
                              <input
                                type="text"
                                id="nestedCommentReply"
                                className="w-full mt-1 outline-none py-1 bg-[#F0F2F5] text-sm comment_placeholder"
                                placeholder={`Reply to ${reply.name}`}
                              />
                              <button className="text-xl hover:bg-[#d1d2d4] py-[14px] pr-3 pl-4 transition duration-200">
                                <IoSend />
                              </button>
                            </form>
                          )}
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div>
          <form
            onSubmit={handleComment}
            className="flex items-center bg-[#F0F2F5]"
          >
            <img
              className="w-8 h-8 rounded-full mx-2 border border-gray-300"
              src={toukir}
              alt=""
            />
            <input
              type="text"
              id="comment"
              className="w-full mt-1 outline-none py-2 bg-[#F0F2F5] text-sm comment_placeholder"
              placeholder="Write a comment..."
            />
            <button className="text-xl hover:bg-[#d1d2d4] py-[14px] pr-3 pl-4 transition duration-200">
              <IoSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
