import Container from "../Components/Shared/Container";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../Providers/GlobalProvider";
import LandingPage from "./LandingPage";
import Navbar from "../Components/Shared/Navbar";
import ViewPost from "../Components/ViewPost";
import axios from "axios";
import FollowSugg from "../Components/FollowSugg";
import FollowReq from "../Components/FollowReq";
axios.defaults.withCredentials = true;
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { isAuthenticate, setIsAuthenticate, isHideNav } =
    useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [textareaHeight, setTextareaHeight] = useState("");
  const [textareaHeightFirstTime, setTextareaHeightFirstTime] = useState(0);
  const navigate = useNavigate();

  const [isFollowSuggModalOpen, setIsFollowSuggModalOpen] = useState(false);
  const [isFollowReqModalOpen, setIsFollowReqModalOpen] = useState(false);

  const handleChange = (event) => {
    setText(event.target.value);
    setTextareaHeight(event.target.scrollHeight);
  };

  const checkAuthCookie = () => {
    const cookies = document.cookie.split("; ");
    const authCookie = cookies.find((cookie) =>
      cookie.startsWith("authToken=")
    );
    return !!authCookie; // Returns true if authToken exists
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/auth/check-session",
          { withCredentials: true }
        );
        if (response.data.isAuthenticated) {
          setIsAuthenticate(true);
        } else {
          setIsAuthenticate(false);
        }
      } catch (error) {
        setIsAuthenticate(false);
      }
    };

    checkAuthentication();
  }, [setIsAuthenticate]);

  const handleSubmitPost = async (event) => {
    event.preventDefault();
    const postData = { title, description: text };
    try {
      await axios.post("http://localhost:3000/post/makepost", postData);
      setText("");
      setTitle("");
    } catch (error) {
      // console.error("Error making post:", error);
    }
  };

  useEffect(() => {
    const textarea = document.getElementById("myTextarea");
    if (textarea) {
      setTextareaHeightFirstTime(textarea.scrollHeight);
    }
  }, []);

  return (
    <div>
      {!isAuthenticate && <LandingPage />}

      {isAuthenticate && (
        <div className="bg-[#F0F2F5] min-h-screen">
          <Container>
            <div className={`sticky ${isHideNav && "z-20"} top-0`}>
              <Navbar />
            </div>

            <div className="flex flex-wrap lg:flex-nowrap gap-4">
              {/* Buttons for modals - only on smaller screens */}
              <div className="w-full flex flex-wrap justify-between gap-4 mt-4 lg:hidden">
                {/* Button to open Follow Suggestions Modal */}
                <button
                  className="flex-grow py-2 px-4 bg-gray-800 text-white rounded-full hover:bg-black"
                  onClick={() => setIsFollowSuggModalOpen(true)}
                >
                  Follow Suggestions
                </button>

                {/* Button to open Follow Requests Modal */}
                <button
                  className="flex-grow py-2 px-4 bg-gray-800 text-white rounded-full hover:bg-black"
                  onClick={() => setIsFollowReqModalOpen(true)}
                >
                  Follow Requests
                </button>
              </div>

              {/* Follow Suggestions - only on larger screens */}
              <div className="w-full lg:w-[22%] lg:flex lg:flex-col lg:justify-between lg:sticky top-28 lg:h-[600px] mb-4 lg:mb-0 mt-4 hidden lg:block">
                <FollowSugg />
              </div>

              {/* Main Content */}
              <div className="w-full lg:w-[58%] min-h-[calc(100vh-96px)] border-gray-300 py-4 px-2 xl:px-8 lg:pr-6">
                <form
                  className="w-full px-3 py-4 rounded-xl border bg-white"
                  onSubmit={handleSubmitPost}
                >
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What is your title?"
                    className="text-xl w-full pb-2 outline-none border-b-2"
                  />
                  <textarea
                    placeholder="Highlight the essentials:"
                    id="myTextarea"
                    className="custom-textarea w-full flex items-center outline-none resize-none text-md pt-2 overflow-auto"
                    value={text}
                    rows={
                      textareaHeight < textareaHeightFirstTime ? "2" : undefined
                    }
                    onChange={handleChange}
                    style={{
                      height:
                        textareaHeight > textareaHeightFirstTime &&
                        `${textareaHeight}px`,
                    }}
                  ></textarea>
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="py-1 px-7 text-sm rounded-full flex gap-1 items-center text-white hover:bg-black bg-gray-800 transition ease-in-out duration-150"
                    >
                      <p>Post</p>
                    </button>
                  </div>
                </form>

                <ViewPost />
              </div>

              {/* Follow Requests - only on larger screens */}
              <div className="w-full lg:w-[20%] lg:flex lg:flex-col lg:sticky top-28 lg:h-[600px] mb-20 lg:mb-0 hidden lg:block">
                <FollowReq />
              </div>
            </div>

            {/* Follow Suggestions Modal */}
            {isFollowSuggModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-[95%] max-w-md">
                  <button
                    className="absolute top-2 right-4 text-white"
                    onClick={() => setIsFollowSuggModalOpen(false)}
                  >
                    Close
                  </button>
                  <FollowSugg />
                </div>
              </div>
            )}

            {/* Follow Requests Modal */}
            {isFollowReqModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg w-[95%] max-w-md">
                  <button
                    className="absolute top-2 right-4 text-white"
                    onClick={() => setIsFollowReqModalOpen(false)}
                  >
                    Close
                  </button>
                  <FollowReq />
                </div>
              </div>
            )}
          </Container>
        </div>
      )}
    </div>
  );
}
