import { useContext, useEffect, useState } from "react";
import avatar from "/images/avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { GlobalContext } from "../../Providers/GlobalProvider";
import Navbar from "../../Components/Shared/Navbar";
import axios from "axios";
import { CiUser } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Loader from "../../Components/Loader";
import PostItem from "../../Components/Shared/PostItem";
import CommentModal from "../../Components/Shared/CommentModal";
import { useComment } from "../../hooks/useComment";
import Container from "../../Components/Shared/Container";
axios.defaults.withCredentials = true;

const dummyPosts = [
  {
    post: {
      author_name: "John Doe",
      author_img: "https://randomuser.me/api/portraits/men/1.jpg",
      time_stamp: "1 day ago",
      title: "Component Lifecycle in React",
      post_content:
        "Understanding component lifecycle methods is crucial for managing side effects in React components.",
      post_id: "3",
      is_liked: true,
      like: 22,
      comment: 15,
      share: 10,
      email: "alice.johnson@example.com",
    },
  },
];

export default function EditProfile() {
  const [followerFollowingStatus, setFollowerFollowingStatus] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUserName] = useState();
  const [isOpenEditProfile, setIsOpenEditProfile] = useState(false);
  const {
    userData,
    setUserData,
    followingModalOpen,
    setFollowingModalOpen,
    setViewProfileData,
  } = useContext(GlobalContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const [posts, setPosts] = useState(dummyPosts);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [commentDataState, setCommentDataState] = useState({});
  const [openCommentNestedReplyID, setOpenCommentNestedReplyID] =
    useState(null);

  const {
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
  } = useComment(setComments, setCommentDataState);

  const handleLike = async (postId, isLiked) => {
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

  const handleCommentClick = (postId) => {
    setActivePostId(postId);
    fetchComments(postId);
    setIsOpenComment(true);
  };

  const handleLogout = async () => {
    try {
      // Call the backend to clear the session and cookies
      await axios.post("http://localhost:3000/logout");

      // Remove authentication flag from localStorage
      localStorage.removeItem("sessionId");

      // Redirect to the login page
      navigate("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleRemove = async (userId, action) => {
    try {
      // Send a request to the backend to remove the follower/following
      await axios.delete(`http://localhost:3000/${action}/${userId}`);
      // Update the followers or following state after removal
      if (followerFollowingStatus === "follower") {
        setFollowers((prevFollowers) =>
          prevFollowers.filter((follower) => follower._id !== userId)
        );
      } else {
        setFollowing((prevFollowing) =>
          prevFollowing.filter((following) => following._id !== userId)
        );
      }
    } catch (error) {
      console.error("Error removing follower/following:", error);
      navigate("/error");
    }
  };

  const handleEditProfile = (e) => {
    e.preventDefault();
    const editProfileData = {
      username: e.target.username.value,
      email: e.target.email.value,
    };
    axios
      .post("http://localhost:3000/editProfile", editProfileData)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
    navigate("/");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/profileView");

        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();

    const fetchFollowData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/followers"
        );
        setFollowers(response.data.followers);
        setFollowing(response.data.following);
        setUserName(response.data.username);
        setSelectedImg(response.data.img);
      } catch (error) {
        console.error("Error fetching follow data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowData();
  }, [navigate]);

  const handleDeletePost = (postId) => {
    // Optimistically update the UI
    const newPosts = posts.filter((post) => post.post.post_id !== postId);
    setPosts(newPosts);

    // Then send a request to the server to delete the post
    axios
      .delete(`http://localhost:3000/post/${postId}`)
      .then((response) => {
        console.log("Post deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        // If there's an error, revert the UI change
        setPosts(posts);
      });
  };

  const handleProfileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      const response = await axios.post(
        "http://localhost:3000/uploads",
        formData
      );
      const uploadedImagePath = response.data.filePath;
      setSelectedImg(uploadedImagePath);
      await axios.post("http://localhost:3000/editProfile", {
        profileImgUrl: uploadedImagePath,
      });
      console.log("Profile updated with the new image");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem("isAuthenticate");
    if (savedAuth) {
      setIsAuthenticated(JSON.parse(savedAuth));
    }
  }, []);
  console.log(isAuthenticated);
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mh-[calc(100vh-96px)] flex-col px-4">
        <img
          className="w-40 rounded-full object-cover"
          src={selectedImg}
          alt="Profile avatar"
        />
        <div>
          <h4 className="mt-1 text-3xl">@{username}</h4>
        </div>

        <div className="flex gap-4 mt-2">
          <button
            onClick={() => {
              setFollowerFollowingStatus("follower");
              setFollowingModalOpen(true);
            }}
            className="text-blue-500"
          >
            Followers({followers.length})
          </button>
          <button
            onClick={() => {
              setFollowerFollowingStatus("following");
              setFollowingModalOpen(true);
            }}
            className="text-blue-500"
          >
            Following({following.length})
          </button>
        </div>

        <div className="flex flex-col items-center md:w-[500px] w-full md:mt-8 mt-6 gap-6">
          <button
            onClick={() => setIsOpenEditProfile(!isOpenEditProfile)}
            className="w-full md:w-[500px] mt-4 text-center text-white transition hover:bg-white bg-black hover:text-black border-2 border-gray-800 ease-in-out duration-200 focus:outline-none font-medium px-5 py-3 mb-4 md:mb-0"
          >
            Edit Profile
          </button>

          <div className="md:w-[500px] w-full md:flex justify-between gap-6">
            <button
              onClick={() => navigate("/profile/edit-profile/password-change")}
              className="w-full text-center text-gray-800 bg-white hover:bg-black hover:text-white border-2 border-gray-800 ease-in-out duration-150 focus:outline-none font-medium px-5 py-3 mb-4 md:mb-0"
            >
              Change Pass
            </button>
            <button
              className="w-full text-center text-gray-800 bg-white hover:bg-black hover:text-white border-2 border-gray-800 ease-in-out duration-150 focus:outline-none font-medium px-5 py-3 mb-4 md:mb-0"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          {isOpenEditProfile && (
            <div className="w-full md:w-[500px] mb-6 flex flex-col items-center gap-4">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-800 rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer transition duration-200 hover:bg-black hover:text-white">
                <FaRegUserCircle size={26} />
                <span className="mt-2 text-base leading-normal">
                  Upload Profile Picture
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleProfileUpload}
                />
              </label>
            </div>
          )}
        </div>

        {isOpenEditProfile && (
          <form onSubmit={handleEditProfile} className="py-8 w-full">
            <div className="max-w-lg mx-auto mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none ps-10">
                  <CiUser className="text-xl text-gray-500" />
                </div>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="border-b-2 border-gray-300 text-gray-900 text focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
                  placeholder="Username"
                  required
                />
              </div>
            </div>

            <div className="max-w-lg mx-auto mb-4 md:mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none ps-10">
                  <MdOutlineEmail className="text-base text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="current_pass"
                  className="border-b-2 border-gray-300 text-gray-900 text focus:border-b-2 focus:border-gray-600 block outline-none w-full p-2.5"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <div className="max-w-lg w-full mx-auto flex flex-wrap justify-between gap-2 sm:gap-x-12">
              <button
                type="submit"
                className="w-full sm:w-auto flex-1 text-black bg-white hover:bg-black hover:text-white border-2 border-gray-800 ease-in-out duration-150 focus:outline-none font-medium px-5 py-3 mt-4"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpenEditProfile(false);
                }}
                className="w-full sm:w-auto flex-1 text-black bg-white hover:bg-black hover:text-white border-2 border-gray-800 ease-in-out duration-150 focus:outline-none font-medium px-5 py-3 mt-4"
              >
                Cancel Changes
              </button>
            </div>
          </form>
        )}
        {/* Modal */}
        {followingModalOpen && (
          <div
            onClick={() => setFollowingModalOpen(false)}
            className="fixed bg-[#42424233] top-0 bottom-0 left-0 right-0 w-full h-full"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl py-6 pr-1 absolute top-1/2 left-1/2 w-[95%] sm:w-[400px] h-[500px] -translate-y-1/2 -translate-x-1/2"
            >
              <div className="flex justify-between items-center pr-5 pl-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setFollowerFollowingStatus("follower")}
                    className={`pb-1 ${
                      followerFollowingStatus === "follower"
                        ? "border-blue-500 text-blue-500 border-b-2"
                        : "border-b-2 border-white"
                    }`}
                  >
                    Followers({followers.length})
                  </button>
                  <button
                    onClick={() => setFollowerFollowingStatus("following")}
                    className={`pb-1 ${
                      followerFollowingStatus === "following"
                        ? "border-blue-500 text-blue-500 border-b-2"
                        : "border-b-2 border-white"
                    }`}
                  >
                    Following({following.length})
                  </button>
                </div>
                <button className="text-gray-800 hover:text-black transition duration-200 cursor-pointer absolute top-3 right-3 hover:bg-gray-100 p-1.5 rounded-full">
                  <IoMdClose
                    onClick={() => setFollowingModalOpen(false)}
                    size={20}
                  />
                </button>
              </div>

              {/* Followers Data */}
              {followerFollowingStatus === "follower" && (
                <div className="mt-4 overflow-y-scroll h-[430px] pl-6 followers_scroll">
                  {followers.map((data, key) => (
                    <div
                      key={data._id}
                      className="py-2 flex justify-between items-center pr-5"
                    >
                      <div
                        onClick={() => {
                          setFollowingModalOpen(false);
                          setViewProfileData(data);
                          navigate("/profile/view-profile", {
                            state: { userId: data._id },
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <img
                          src={data.profilePicture}
                          className="w-6 h-6 rounded-full"
                          alt="Follower avatar"
                        />
                        <p className="font-medium text-sm">{data.username}</p>
                      </div>
                      <button
                        className="text-xs bg-gray-800 transition duration-150 hover:bg-black px-4 py-1 text-white rounded"
                        onClick={() => handleRemove(data._id, "follower")}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Following Data */}
              {followerFollowingStatus === "following" && (
                <div className="mt-4 overflow-y-scroll h-[430px] pl-6 followers_scroll">
                  {following.map((data, key) => (
                    <div
                      key={key}
                      className="py-2 flex justify-between items-center pr-5"
                    >
                      <div
                        onClick={() => {
                          setViewProfileData(data);
                          navigate("/profile/view-profile", {
                            state: { userId: data._id },
                          });
                          setFollowingModalOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        <img
                          src={data.profilePicture}
                          className="w-6 h-6 rounded-full"
                          alt="Following avatar"
                        />
                        <p className="font-medium text-sm">{data.username}</p>
                      </div>
                      <button
                        className="text-xs bg-gray-800 transition duration-150 hover:bg-black px-4 py-1 text-white rounded"
                        onClick={() => handleRemove(data._id, "following")}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <Container>
          <div className="grid gap-6 mt-6">
            {posts.map((data, key) => (
              // <PostItem
              //   key={key}
              //   post={data.post}
              //   onProfileClick={handleProfileClick}
              //   onLike={handleLike}
              //   onComment={handleComment}
              //   onShare={handleShare}
              // />
              <PostItem
                key={key}
                post={data.post}
                onCommentClick={handleCommentClick}
                onDelete={() => handleDeletePost(data.post.post_id)}
                onLike={() =>
                  handleLike(data.post.post_id, data.post.is_liked, data.post)
                }
              />
            ))}
          </div>
        </Container>
        {isOpenComment && (
          <CommentModal
            isOpen={isOpenComment}
            onClose={() => setIsOpenComment(false)}
            comments={comments}
            handleComment={handleComment}
            handleCommentReply={handleCommentReply}
            handleNestedCommentReply={handleNestedCommentReply}
            handleShareMessageChange={handleShareMessageChange}
            shareMessage={shareMessage}
            openCommentReplyID={openCommentReplyID}
            setOpenCommentReplyID={setOpenCommentReplyID}
            openCommentNestedReplyID={openCommentNestedReplyID}
            setOpenCommentNestedReplyID={setOpenCommentNestedReplyID}
          />
        )}
      </div>
    </>
  );
}
