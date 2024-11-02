import { FaComment, FaHeart } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import girl from "/images/girl.jpg";
import toukir from "/images/toukir.jpg";
import { useContext, useState } from "react";
import { GlobalContext } from "../Providers/GlobalProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { IoSend } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFacebookSquare } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useEffect } from "react";
const postData = [{}];
axios.defaults.withCredentials = true;

const handleLike = async (postId, isLiked, setPosts, posts, navigate) => {
  try {
    let updatedPosts;
    if (isLiked) {
      console.log("Unliking functionality route");
      await axios.post("http://localhost:3000/like", { postId });
      updatedPosts = posts.map((post) => {
        if (post.post.post_id === postId) {
          return {
            ...post,
            post: {
              ...post.post,
              is_liked: false,
              like: post.post.like - 1,
            },
          };
        }

        return post;
      });
      setPosts(updatedPosts);
    } else {
      console.log("Liking a post");
      await axios.post("http://localhost:3000/like", { postId });
      updatedPosts = posts.map((post) => {
        if (post.post.post_id === postId) {
          return {
            ...post,
            post: {
              ...post.post,
              is_liked: true,
              like: post.post.like + 1,
            },
          };
        }

        return post;
      });
      setPosts(updatedPosts);
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

const handleSharedPostLike = async (
  shared_id,
  isLiked,
  postID,
  setPosts,
  posts,
  navigate
) => {
  try {
    let updatedPosts;
    if (isLiked) {
      console.log("Unliking functionality route");
      await axios.post("http://localhost:3000/SharePostlike", {
        shared_id,
        postID,
      });
      updatedPosts = posts.map((post) => {
        if (post.shared_id === shared_id) {
          return {
            ...post,
            isLiked: false,
            shared_like: post.shared_like - 1,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } else {
      console.log("Liking a post");
      await axios.post(
        "http://localhost:3000/SharePostlike",
        { shared_id, postID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      updatedPosts = posts.map((post) => {
        if (post.shared_id === shared_id) {
          return {
            ...post,
            isLiked: true,
            shared_like: post.shared_like + 1,
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

export default function ViewPost() {
  const { setIsHideNav, setSuggFollowStatus } = useContext(GlobalContext);

  // State variables
  const [followRequests, setFollowRequests] = useState([]); // Start with an empty array
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [isOpenShare, setIsOpenshare] = useState(false);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activePostId, setActivePostId] = useState(null);
  const [openCommentReplyID, setOpenCommentReplyID] = useState(null);
  const [openCommentNestedReplyID, setOpenCommentNestedReplyID] =
    useState(null);
  const [shareMessage, setShareMessage] = useState("");
  const [sharePostID, setSharePostID] = useState("");
  const [email, setEmail] = useState(); // Initialized as an empty string
  const [profilepic, setProfilePic] = useState(""); // Initialized as an empty string
  const [isLoading, setIsLoading] = useState(false);
  const [username, setusername] = useState();

  const navigate = useNavigate();

  // Fetch follow suggestions when component mounts
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

    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/post/displayPosts"
        );
        if (Array.isArray(response.data)) {
          // console.log(response.data);
          setPosts(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user");
        // console.log(response.data);
        setusername(response.data.username);
        setEmail(response.data.email);
        setProfilePic(response.data.profilePicture);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchUser();
  }, []);
  const [likedComments, setLikedComments] = useState({});

  const handleCommentLike = async (commentId, replyId = null, is_liked) => {
    try {
      // Send request to backend to like a comment/reply
      const response = await axios.post(
        `http://localhost:3000/like/${commentId}`,
        {
          replyId,
        }
      );
      // Toggle the like status in the local state
      setLikedComments((prevState) => ({
        ...prevState,
        [replyId || commentId]: !is_liked,
      }));
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
    // Update the state with the modified comment data
    setCommentDataState(updatedCommentData);
  };

  const handleComment = async (e) => {
    e.preventDefault();

    const commentText = e.target.comment.value;
    const commentData = {
      comment: commentText,
      postID: activePostId,
      shared_id: sharePostID,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/comment/add",
        commentData
      );
      console.log(response.data);
      if (sharePostID) {
        fetchComments(sharePostID);
      } else {
        fetchComments(activePostId);
      }

      e.target.reset();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleCommentReply = async (e) => {
    e.preventDefault();

    const commentReplyData = e.target.commentReply.value;
    const commentData = {
      comment: commentReplyData,
      postID: activePostId,
      commentID: openCommentReplyID,
    };
    console.log(commentData);
    try {
      const response = await axios.post(
        "http://localhost:3000/comment/reply",
        commentData
      );
      console.log(response.data);
      fetchComments(activePostId);
      e.target.reset();
      setOpenCommentReplyID(null); // Close the reply input box
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleNestedCommentReply = async (e) => {
    e.preventDefault();

    const nestedCommentReplyData = e.target.nestedCommentReply.value;
    console.log(nestedCommentReplyData);
    const commentData = {
      comment: nestedCommentReplyData,
      postID: activePostId,
      commentID: openCommentReplyID,
    };
    console.log(commentData);
    try {
      const response = await axios.post(
        `http://localhost:3000/comment/${openCommentReplyID}/reply`,
        { reply: nestedCommentReplyData }
      );
      console.log(response.data);
      fetchComments(activePostId);
      e.target.reset();
      setOpenCommentReplyID(null); // Close the parent reply input box
      setOpenCommentNestedReplyID(null); // Close the nested reply input box
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleShareMessageChange = (e) => {
    setShareMessage(e.target.value);
  };

  const handleShareClick = () => {
    if (sharePostID) {
      handleShare(sharePostID, shareMessage, setPosts, posts, navigate);
      setIsOpenshare(false);
      setIsHideNav(true);
      setShareMessage(""); // Reset the share message after sharing
    } else {
      console.error("No active post ID to share");
    }
  };

  const handleShare = async (postId, message, setPosts, posts, navigate) => {
    try {
      const response = await axios.post(`http://localhost:3000/post/share`, {
        postId,
        message,
      });
      if (response.status === 200) {
        // Update the posts state with the new share data
        const updatedPosts = posts.map((post) =>
          post._id === postId ? { ...post, shares: post.shares + 1 } : post
        );
        setPosts(updatedPosts);
      } else {
        console.error("Failed to share the post");
      }
    } catch (error) {
      console.error("Error sharing the post:", error);
    }
  };

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
      // console.error("Error deleting follow request:", error);
    }
  };

  return (
    <>
      {!postData.length && (
        <h3 className="text-2xl font-medium text-center mt-20 text-gray-400">
          No posts have been made yet!
        </h3>
      )}
      {posts.map((data, key) => {
        return (
          <>
            {/* {!data.is_shared && ( */}
            <div key={key} className="my-4 bg-white rounded-xl shadow-md">
              <button
                onClick={() => {
                  setViewProfileData({
                    name: data.post.author_name,
                    img: data.post.author_img,
                    email: data.post.email,
                  });
                  navigate("/profile/view-profile");
                  setSuggFollowStatus("unfollow");
                }}
                className="  flex gap-2 items-center p-2 cursor-pointer w-fit"
              >
                <img
                  src={data.post.author_img}
                  className="w-12 rounded-full"
                  alt=""
                />
                <div>
                  <p className="font-medium">{data.post.author_name}</p>
                  <p className="text-sm text-primary-100">
                    {data.post.time_stamp}
                  </p>
                </div>
              </button>
              <h5 className="text-xl font-medium px-2 py-1">
                {data.post.title}
              </h5>
              <p className="px-2 break-words">{data.post.post_content}</p>
              <div className="flex justify-between mt-4 px-4 pb-4">
                <button
                  className="flex items-center gap-1"
                  onClick={() =>
                    handleLike(
                      data.post.post_id,
                      data.post.is_liked,
                      setPosts,
                      posts
                    )
                  }
                >
                  {data.post.is_liked && <FaHeart className="text-rose-600" />}
                  {!data.post.is_liked && <FaHeart className="text-txt-200" />}
                  <p>{data.post.like}</p>
                </button>
                <button
                  onClick={() => {
                    setActivePostId(data.post.post_id);
                    fetchComments(data.post.post_id);
                    setIsOpenComment(true);
                    setIsHideNav(false);
                  }}
                  className="flex items-center gap-1"
                >
                  <FaComment className="text-txt-200" />
                  <p>{data.post.comment}</p>
                </button>
                <button
                  onClick={() => {
                    setActivePostId(data.post.post_id);
                    setSharePostID(data.post.post_id);
                    setIsOpenshare(true);
                    setIsHideNav(false);
                  }}
                  className="flex items-center gap-1"
                >
                  <IoIosShareAlt className="text-2xl text-txt-200" />
                  <p>{data.post.share}</p>
                </button>
              </div>
            </div>

            {data.is_shared && (
              <div key={key} className="my-4 bg-white rounded-xl shadow-md">
                <div>
                  <>
                    <button
                      onClick={() => {
                        setViewProfileData({
                          name: data.shared_author_name,
                          img: data.shared_author_img,
                          email: data.share_auhhor_email,
                        });
                        navigate("/profile/view-profile");
                        setSuggFollowStatus("unfollow");
                      }}
                      className="  flex gap-2 items-center p-2 cursor-pointer w-fit "
                    >
                      <img
                        src={data.shared_author_img}
                        className="w-12 rounded-full"
                        alt=""
                      />
                      <div>
                        <p className="font-medium">{data.shared_author_name}</p>
                        <p className="text-sm text-primary-100">
                          {data.time_stamp}
                        </p>
                      </div>
                    </button>
                    <p className="px-2">{data.shared_title}</p>
                  </>
                  <div className="mx-4 border p-2 mt-2 rounded-lg">
                    <button
                      onClick={() => {
                        setViewProfileData({
                          name: data.post.author_name,
                          img: data.post.author_img,
                          email: data.post.auhhor_email,
                        });
                        navigate("/profile/view-profile");
                        setSuggFollowStatus("unfollow");
                      }}
                      className="  flex gap-2 items-center p-2 cursor-pointer w-fit "
                    >
                      <img
                        src={data.post.author_img}
                        className="w-10 rounded-full"
                        alt=""
                      />
                      <div>
                        <p className="font-medium">{data.post.author_name}</p>
                        <p className="text-sm text-primary-100">
                          {data.post.time_stamp}
                        </p>
                      </div>
                    </button>
                    <h5 className="text-xl font-medium px-2 py-1">
                      {data.post.title}
                    </h5>
                    <p className="px-2">{data.post.post_content}</p>
                  </div>
                  <div className="flex justify-between mt-4 px-4 pb-4">
                    <button
                      className="flex items-center gap-1"
                      onClick={() =>
                        handleSharedPostLike(
                          data.shared_id,
                          data.isLiked,
                          data.post.post_id,
                          setPosts,
                          posts
                        )
                      }
                    >
                      {data.isLiked && <FaHeart className="text-rose-600" />}
                      {!data.isLiked && <FaHeart className="text-txt-200" />}
                      <p>{data.shared_like}</p>
                    </button>
                    <button
                      onClick={() => {
                        setActivePostId(data.post.post_id);
                        setSharePostID(data.shared_id);
                        fetchComments(data.shared_id);
                        setIsOpenComment(true);
                        setIsHideNav(false);
                      }}
                      className="flex items-center gap-1"
                    >
                      <FaComment className="text-txt-200" />
                      <p>{data.shared_comment}</p>
                    </button>
                    <button
                      onClick={() => {
                        setActivePostId(data.post.post_id); // Ensure this is being set correctly
                        setSharePostID(data.post.post_id);
                        setIsOpenshare(true);
                        setIsHideNav(false);
                      }}
                      className="flex items-center gap-1"
                    >
                      <IoIosShareAlt className="text-2xl text-txt-200" />
                      <p>{data.share}</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* mobile follow request 
            {key == 1 && (
              <div className="my-4 bg-white p-4 rounded-lg block lg:hidden">
                <Swiper
                  slidesPerView={3}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {followRequests.map((data, key) => {
                    return (
                      <SwiperSlide key={key}>
                        <div>
                          <img className="w-fit" src={data.img} alt="" />
                          <p className="pt-2 text-sm font-medium text-center">
                            {data.username}
                          </p>
                          <p className="text-center text-xs pb-2 text-primary-100">
                            {data.email}
                          </p>
                          <button className="bg-black py-[3px] text-sm text-white w-full" onClick={(e) => {
                          e.stopPropagation();
                          handleConfirm(data._id);
                        }}>
                            Confirm
                          </button>
                          <button className=" border border-gray-700 hover:border-gray-900 text-gray-700 hover:text-gray-900 py-[3px] text-sm w-full mt-[6px]"
                            onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(data._id);
                        }}>
                            Delete
                          </button>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )} */}
          </>
        );
      })}

      {/* commet modal  */}
      {isOpenComment && (
        <div
          onClick={() => {
            setIsOpenComment(false);
            setIsHideNav(true);
          }}
          className="fixed top-0 left-0 w-screen h-screen bg-[#00000056] z-50 "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[95%] md:w-[600px] lg:w-[700px] bg-white rounded-md absolute right-[50%] translate-x-1/2 top-[18%] md:top-[12%] flex flex-col justify-between "
          >
            {/* hade and body  */}
            <div className="bg-white">
              <div className=" flex justify-end items-center py-2 px-2 border-b">
                <button
                  type="button"
                  className=" text-2xl hover:bg-gray-100 p-1 rounded-full transition duration-150"
                  onClick={() => setIsOpenComment(false)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="px-3">
                <div className="max-h-[450px] overflow-y-auto comment_scroll">
                  {comments.map((data, key) => {
                    return (
                      <>
                        <div key={key} className="flex mt-2 pr-2">
                          <div className=" pr-2 mr-1 shrink-0 ">
                            <img
                              className="w-8 h-8 rounded-full object-cover"
                              src={data.img}
                              alt="user"
                            />
                          </div>
                          <div>
                            <div className="bg-[#F0F2F5] py-1 px-2 rounded">
                              <p>
                                <span className="font-semibold  text-sm">
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
                                  onClick={() =>
                                    handleCommentLike(
                                      data._id,
                                      null,
                                      likedComments[data._id]
                                    )
                                  }
                                  className={`${
                                    data.is_liked && "text-rose-500"
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
                        {/* comment reply  */}
                        {openCommentReplyID === data._id &&
                          !openCommentNestedReplyID && (
                            <form
                              onSubmit={handleCommentReply}
                              className="flex items-center bg-[#F0F2F5] w-[60%] relative left-32 top-1 mb-3"
                            >
                              <img
                                className="w-6 h-6 rounded-full mx-2 border border-gray-3 00"
                                src={toukir}
                                alt=""
                              />
                              <input
                                type="text"
                                id="commentReply"
                                className="w-full mt-1 outline-none  py-1 bg-[#F0F2F5] text-sm comment_ploaceholder"
                                placeholder={`Reply to ${data.name}`}
                              />
                              <button className=" text-xl hover:bg-[#d1d2d4] py-[14px] pr-3 pl-4 transition duration-200">
                                <IoSend />
                              </button>
                            </form>
                          )}

                        {/* nested comment  */}
                        <div className="ml-7">
                          {data.replys.map((reply, key) => {
                            return (
                              <>
                                <div key={key} className="flex mt-2">
                                  <div className=" pr-2 mr-1 shrink-0 ">
                                    <img
                                      className="w-8 h-8 rounded-full object-cover"
                                      src={reply.img}
                                      alt="user"
                                    />
                                  </div>
                                  <div>
                                    <div className="bg-[#F0F2F5] py-1 px-2 rounded">
                                      <p>
                                        <span className="font-semibold  text-sm">
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
                                            reply.is_liked && "text-rose-500"
                                          }`}
                                        >
                                          Like
                                        </button>
                                        <button
                                          onClick={() => {
                                            setOpenCommentReplyID(data._id);
                                            setOpenCommentNestedReplyID(
                                              reply._id
                                            );
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
                                {openCommentReplyID === data._id &&
                                  openCommentNestedReplyID === reply._id && (
                                    <form
                                      onSubmit={handleNestedCommentReply}
                                      className="flex items-center bg-[#F0F2F5] w-[60%] relative left-32 top-1 mb-3"
                                    >
                                      <img
                                        className="w-6 h-6 rounded-full mx-2 border border-gray-3 00"
                                        src={toukir}
                                        alt=""
                                      />
                                      <input
                                        type="text"
                                        id="nestedCommentReply"
                                        className="w-full mt-1 outline-none  py-1 bg-[#F0F2F5] text-sm comment_ploaceholder"
                                        placeholder={`Reply to ${reply.name}`}
                                      />
                                      <button className=" text-xl hover:bg-[#d1d2d4] py-[14px] pr-3 pl-4 transition duration-200">
                                        <IoSend />
                                      </button>
                                    </form>
                                  )}
                              </>
                            );
                          })}
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
              <div>
                <form
                  onSubmit={handleComment}
                  className="flex items-center bg-[#F0F2F5]"
                >
                  <img
                    className="w-8 h-8 rounded-full mx-2 border border-gray-3 00"
                    src={toukir}
                    alt=""
                  />
                  <input
                    type="text"
                    id="comment"
                    className="w-full mt-1 outline-none  py-3 bg-[#F0F2F5] text-sm comment_ploaceholder"
                    placeholder="Write a comment..."
                  />
                  <button className=" text-xl hover:bg-[#d1d2d4] py-[17px] pr-3 pl-4 transition duration-200">
                    <IoSend />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* share modal  */}
      {isOpenShare && (
        <div
          onClick={() => {
            setIsOpenshare(false);
            setIsHideNav(true);
          }}
          className="fixed top-0 left-0 w-screen h-screen bg-[#00000056] z-50 "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className=" p-4 h-[230px] w-[95%] md:w-[700px] lg:w-[800px]  bg-white rounded-md absolute right-[50%] translate-x-1/2 bottom-[65px] top-[12%] flex flex-col z-10 "
          >
            <div className="flex gap-2 items-center">
              <img className="w-10 rounded-full" src={profilepic} alt="" />
              <div>
                <p className="font-medium">{username}</p>
                <p className="text-gray-600 text-sm">{email}</p>
              </div>
            </div>
            <form>
              <textarea
                style={{ resize: "none" }}
                className="border rounded outline-none w-full mt-2 px-2 py-2"
                rows={4}
                value={shareMessage}
                onChange={handleShareMessageChange}
                placeholder="Say something about this..."
              ></textarea>
              <div className="w-full flex justify-end mt-1 items-center gap-4">
                <button
                  type="button"
                  className="bg-black text-white py-1 px-4 rounded-full text-sm"
                  onClick={() => {
                    handleShareClick();
                  }}
                >
                  Share Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
