/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import avatar from "/images/avatar.jpg";
import toukir from "/images/toukir.jpg";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // Initialize state from localStorage or set default values
  const [isAuthenticate, setIsAuthenticate] = useState(() => {
    const savedAuth = localStorage.getItem("isAuthenticate");
    return savedAuth ? JSON.parse(savedAuth) : false;
  });
  const [isHideNav, setIsHideNav] = useState(false);
  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [suggFollowStatus, setSuggFollowStatus] = useState("");
  const [viewProfileData, setViewProfileData] = useState({});

  const [userData, setUserData] = useState({
    name: "Toukir Ahmed",
    email: "toukir@gmail.com",
    img: toukir,
    followers: [
      // Sample follower data
    ],
    followings: [
      // Sample following data
    ],
  });

  const followSuggetionData = [
    {
      img: toukir,
      name: "Soeab Ahmed",
      email: "demo@gmail.com",
      id: 5,
    },
    {
      img: avatar,
      name: "Hafizur Rahman",
      email: "demo@gmail.com",
      id: 6,
    },
    // Add more suggestions as needed
  ];

  // Persist `isAuthenticate` in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isAuthenticate", JSON.stringify(isAuthenticate));
  }, [isAuthenticate]);

  const GlobalInfo = {
    isAuthenticate,
    setIsAuthenticate,
    userData,
    setUserData,
    followSuggetionData,
    setIsHideNav,
    isHideNav,
    setSuggFollowStatus,
    suggFollowStatus,
    followingModalOpen,
    setFollowingModalOpen,
    setViewProfileData,
    viewProfileData,
  };

  return (
    <GlobalContext.Provider value={GlobalInfo}>
      {children}
    </GlobalContext.Provider>
  );
};
