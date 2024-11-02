import { useEffect, useContext, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Navbar from "../Components/Shared/Navbar";
import { GlobalContext } from "../Providers/GlobalProvider";
import { Link } from "react-router-dom";
import PostItem from "../Components/Shared/PostItem";
import CommentModal from "../Components/Shared/CommentModal";
import ShareModal from "../Components/Shared/ShareModal";
import { useComment } from "../hooks/useComment";
import { useShare } from "../hooks/useShare";
import axios from "axios";
import { useLocation } from "react-router-dom";
axios.defaults.withCredentials = true;

const dummyPosts = [
  {
    post: {
      author_name: "Anum",
      author_img: "https://randomuser.me/api/portraits/men/1.jpg",
      time_stamp: "2 hours ago",
      title: "Exploring the React Ecosystem",
      post_content:
        "React has a rich ecosystem with many tools and libraries. Exploring these can help you build better applications.",
      post_id: "1",
      is_liked: true,
      like: 15,
      comment: 8,
      share: 5,
      email: "john.doe@example.com",
    },
  },
];

export default function ProfileView() {
  const location = useLocation();
  const userId = location.state?.userId;
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followerFollowingStatus, setFollowerFollowingStatus] = useState(null);
  const { userData, suggFollowStatus, setViewProfileData, viewProfileData } =
    useContext(GlobalContext);
  const [posts, setPosts] = useState(dummyPosts);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [comments, setComments] = useState([]);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [commentDataState, setCommentDataState] = useState({});
  const [username, setUserName] = useState();
  const [profilepic, setProfilePic] = useState();
  const [email, setEmail] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const {
    activePostId,
    setActivePostId,
    openCommentReplyID,
    setOpenCommentReplyID,
    shareMessage: commentShareMessage,
    handleComment,
    handleCommentReply,
    handleNestedCommentReply,
    handleShareMessageChange: handleCommentShareMessageChange,
    fetchComments,
  } = useComment(setComments, setCommentDataState);

  const {
    shareMessage,
    isOpenshare,
    setIsOpenshare,
    openShareModal,
    handleShare,
    handleShareMessageChange,
    handleShareClick,
    setSharePostID,
    setIsHideNav,
  } = useShare();

  const handleCommentClick = (postId) => {
    setActivePostId(postId);
    fetchComments(postId);
    setIsOpenComment(true);
  };

  const handleOnFollow = () => {
    setHasFollowed((follow) => !follow);
  };

  const handleLike = async (postId, isLiked) => {
  
    try {
      let updatedPosts;
      if (isLiked) {
        console.log("Unliking functionality route");
        await axios.post(
          "http://localhost:3000/like",
          { postId },
         
        );
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
        await axios.post(
          "http://localhost:3000/like",
          { postId },
       
        );
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
  useEffect(() => {
    if (userId) {
      // Fetch user data and posts using the userId
      const fetchUserProfile = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/${userId}`
          );
          setViewProfileData(response.data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      const fetchUserPosts = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/posts/${userId}`
          );
          setUserName(response.data.authorDetails.author_name);
          setProfilePic(response.data.authorDetails.author_img); 
          setEmail(response.data.authorDetails.author_email);
          setPosts(response.data.posts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      };
      const fetchFollowData = async () => {    
        console.log(userId);  
        try {
          const response = await axios.get(
            "http://localhost:3000/user/followers",
            {             
              params: {
                userId: userId,
              },
            }
          );
          setFollowers(response.data.followers);
          setFollowing(response.data.following);
        } catch (error) {
          console.error("Error fetching follow data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      // fetchUserProfile();
      fetchUserPosts();
      fetchFollowData();
    }
  }, [userId, setViewProfileData]);

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="flex justify-center items-center mh-[calc(100vh-96px)] mt-20 flex-col px-4">
        <img
          className="w-40 rounded-full object-cover"
          src={profilepic}
          alt=""
        />
        <div>
          <h4 className="mt-1 text-3xl">{username}</h4>
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

        {suggFollowStatus === "suggested" && (
          <button
            className=" bg-gray-900 hover:bg-black transition duration-200 text-white mt-8 py-[10px] text-lg font-medium md:w-[500px] w-full text-center"
            onClick={handleOnFollow}
          >
            {!hasFollowed ? "Follow" : "Unfollow"}
          </button>
        )}
        {suggFollowStatus === "follow" && (
          <button className=" bg-gray-900 hover:bg-black transition duration-200 text-white mt-8 py-[10px] text-lg font-medium md:w-[500px] w-full text-center">
            Delete
          </button>
        )}
        {suggFollowStatus === "unfollow" && (
          <button className=" bg-gray-900 hover:bg-black transition duration-200 text-white mt-8 py-[10px] text-lg font-medium md:w-[500px] w-full text-center">
            Unfollow
          </button>
        )}
        {/* modal  */}
        {followingModalOpen && (
          <div
            onClick={() => setFollowingModalOpen(false)}
            className="fixed bg-[#42424233] top-0 bottom-0 left-0 right-0"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl py-6 pr-1 absolute top-1/2 left-1/2 w-[95%] sm:w-[400px] h-[500px] -translate-y-1/2 -translate-x-1/2"
            >
              <div className="flex justify-between items-center pr-5 pl-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setFollowerFollowingStatus("follower")}
                    className={` pb-1 ${
                      followerFollowingStatus == "follower"
                        ? "border-blue-500 text-blue-500 border-b-2"
                        : "border-b-2 border-white"
                    }`}
                  >
                    Followers({followers.length})
                  </button>
                  <button
                    onClick={() => setFollowerFollowingStatus("following")}
                    className={` pb-1 ${
                      followerFollowingStatus == "following"
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
              {/* followers Data  */}
              {followerFollowingStatus == "follower" && (
                <div className="mt-4 overflow-y-scroll h-[430px] pl-6 followers_scroll">
                  {followers.map((data, key) => {
                    return (
                      <Link
                        onClick={() => {
                          setViewProfileData(data);
                          setFollowingModalOpen(false);
                        }}
                        to={`/profile/view-profile`}
                        key={key}
                        className="py-2 flex justify-between items-center pr-5"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={data.profilePicture}
                            className="w-6 h-6 rounded-full"
                            alt=""
                          />
                          <p className="font-medium text-sm">{data.username}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              {/* following Data  */}
              {followerFollowingStatus == "following" && (
                <div className="mt-4 overflow-y-scroll h-[430px] pl-6 followers_scroll">
                  {following.map((data, key) => {
                    return (
                      <Link
                        onClick={() => {
                          setViewProfileData(data);
                          setFollowingModalOpen(false);
                        }}
                        to={`/profile/view-profile`}
                        key={key}
                        className="py-2 flex justify-between items-center pr-5"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={data.profilePicture}
                            className="w-6 h-6 rounded-full"
                            alt=""
                          />
                          <p className="font-medium text-sm">{data.username}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="grid gap-6 mt-6">
          {posts.map((data, key) => (
            // In ProfileView component
            <PostItem
              key={key}
              post={data.post}
              onCommentClick={handleCommentClick}
              onShareClick={() => openShareModal(data.post.post_id)}
              isUser={false}
              onLike={() =>
                handleLike(data.post.post_id, data.post.is_liked, data.post)
              }
            />
          ))}
        </div>
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
          />
        )}
        {
          // In ShareModal component
          <ShareModal
            isOpen={isOpenshare}
            onClose={() => setIsOpenshare(false)}
            userImg={profilepic}
            userName={username}
            userEmail={email}
            shareMessage={shareMessage}
            handleShareMessageChange={handleShareMessageChange}
            handleShareClick={handleShare} // Make sure this is the correct function
          />
        }
      </div>
    </div>
  );
}
