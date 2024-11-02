const express = require('express');
const router = express.Router();
const { User,Comment,Likes,Post,FollowRequest,CommentsLikes } = require('../models/models'); 
const passport = require("passport");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const multer = require('multer');
const bucket = require('../firebase-config'); 
const upload = multer({ storage: multer.memoryStorage() }); 
const admin = require('firebase-admin');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const ensureAuthenticatedAndVerified = require('./middleware/aut');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const LocalStrategy = require('passport-local').Strategy;

router.get('/protected-route', ensureAuthenticatedAndVerified, (req, res) => {
  res.json({ message: "You have access to this protected route." });
});
function timeAgo(timeDifference) {
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Approximation
  const years = Math.floor(days / 365); // Approximation

  if (years > 0) {
    return `${years}y`;
  } else if (months > 0) {
    return `${months}mo`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}
// Handle user signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Check for missing fields
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Storing the hashed password
      verificationToken,         // Store the verification token
    });

    // Save the user to the database
    await newUser.save();

    // Setup Nodemailer for sending the verification email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // You can use another service provider if needed
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables to store sensitive information
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email verification link
    const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
    // HTML content for the email
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-container {
          background-color: white;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          background-color: #4CAF50;
          color: white;
          padding: 10px 0;
        }
        .content {
          padding: 20px;
          text-align: center;
        }
        .content p {
          font-size: 16px;
          line-height: 24px;
          color: #333;
        }
        .verify-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          display: inline-block;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>Email Verification</h2>
        </div>
        <div class="content">
          <p>Thank you for signing up! Please confirm your email address by clicking the button below:</p>
          <a href="${verificationLink}" class="verify-button">Verify Email</a>
        </div>
        <div class="footer">
          <p>If you didn't sign up, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: htmlContent, // HTML content here
    };

    // Send the email
    await transporter.sendMail(mailOptions);
     // Create a session for the user
     req.session.userId = newUser._id;
     req.session.username = newUser.username;
     req.session.email = newUser.email;
     req.session.isVerified = newUser.isVerified;

    res.status(200).json({ message: 'Registration successful. Please check your email for verification link.' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  try {
    // Find the user with the matching verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send({ message: 'Invalid or expired verification token' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    await user.save();
    // Update session to reflect verification
    req.session.isVerified = true;
   // Send the verification success HTML file
   res.sendFile(path.join(__dirname, '../public/emailVerification.html'));
  } catch (error) {       
    res.status(500).send({ message: 'Error verifying email' });
  }
});
// Handle user login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }
  try {
    const user = await User.findOne({ email });    
    if (!user) {
      return res.status(401).json({ message: 'You don\'t have an account. Please sign up.' });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);    
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).send({ message: 'Email not verified. Please verify your email.' });
    }
    // Set session variables
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;

    req.session.user = { id: user._id, username: user.username, email: user.email };

    // Save the session before sending the response
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Respond with a success message
      return res.status(200).json({ message: "Login successful" });
    });

  } catch (err) {
    console.error("Error during login:", err);
    next(err); 
  }
});
 // Handle user logout
router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }

    // Clear the cookies (if needed)
    res.clearCookie('sessionId'); // Replace 'sessionId' with the actual name of your session cookie
    return res.json({ message: 'Logged out successfully' });
  });
});
// Edit user profile
router.post("/editProfile", async (req, res) => {
  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const userId = req.session.userId || req.user._id;

  try {
    const user = await User.findOneAndUpdate({_id: userId}, {username: req.body.username,email:req.body.email});

    // const user = await User.findOneAndUpdate({ _id: userId }, { username: newUsername, email: newEmail }, { new: true });
    if (user) {
      res.status(200).json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Change user password
router.post('/passwordChange', async (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const userId = req.session.userId || req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(current_password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Validate new password
    if (new_password !== confirm_password) {
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update password
      user.password = hashedPassword;
      await user.save(); // Save the user instance, not the User model

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Making a new post
router.post('/post/makepost',async function(req,res){
  try {
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const userId = req.session.userId || req.user._id;
    
    //  Access post data from request body
    const postData = req.body;
    
    // Implement post creation logic using userId and postData
    try {
      const user = await User.findOne({_id:userId});
      const newPost = new Post({
        user: userId,
        author_name:user.username,
        post_content:postData.description,
        title:postData.title
      });
      await newPost.save();
      
      // You can return the created post here if needed
    } catch (error) {
      console.error("Error creating post:", error);
    }
  
    res.status(201).json({ message: 'Post created successfully' }); // Or send created post data
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' }); // Generic error for client
  }
});

router.get('/post/displayPosts', async (req, res) => {
  try {
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const userId = req.session.userId || req.user._id;
   
    // Fetch regular posts
    const posts = await Post.find({  is_shared: false })
      .sort({ createdAt: -1 })
      .populate('user', 'username profilePicture')
      .lean();

    // Fetch shared posts
    const sharedPosts = await Post.find({ is_shared: true })
      .sort({ 'shares.sharedAt': -1 })
      .populate('shares.user', 'username email profilePicture')
      .populate('user', 'username email profilePicture')
      .lean();

    // Array to hold all formatted posts
    const postsWithDetails = [];

    // Process regular posts (that have not been shared)
    for (const post of posts) {
      const isLiked = await Likes.exists({ post: post._id, user: userId });
      const commentCount = await Comment.countDocuments({ post: post._id });
      const creationTime = new Date(post.createdAt);
      const now = new Date();
      const timeDifference = now - creationTime;
      const timeAgoString = timeAgo(timeDifference);

      // Create a formatted regular post
      const formattedPost = {
        is_shared: false,
        isLiked: Boolean(isLiked),
        post: {
          author_name: post.user.username,
          author_img: post.user.profilePicture,
          author_email: post.user.email,
          title: post.title,
          post_content: post.post_content,
          time_stamp: timeAgoString,
          like: post.like,
          comment: commentCount,
          share: post.shares.length,
          is_liked: Boolean(isLiked),
          post_id: post._id,
        }
      };

      // Add the formatted post to the result array
      postsWithDetails.push(formattedPost);
    }

    // Process shared posts
    for (const post of sharedPosts) {
      for (let i = 0; i < post.shares.length; i++) {
        const share = post.shares[i];

        // Check if the current user has liked the share
        const isShareLiked = await Likes.exists({ post: share._id, user: userId });
        const shareCommentCount = await Comment.countDocuments({ post: share._id });

        // Calculate time ago for shared post
        const sharedCreationTime = new Date(share.sharedAt);
        const now = new Date();
        const sharedTimeDifference = now - sharedCreationTime;
        const sharedTimeAgoString = timeAgo(sharedTimeDifference);

        // Create a formatted post for each share
        const formattedSharedPost = {
          is_shared: true,
          isLiked: Boolean(isShareLiked),
          shared_author_name: share.user.username,
          shared_author_img: share.user.profilePicture,
          shared_author_email: share.user.email,
          shared_title: share.comment,
          shared_like: share.sharedLikes || 0,
          shared_comment: shareCommentCount,
          shared_id: share._id,
          time_stamp: sharedTimeAgoString,
          post: {
            author_name: post.user.username,
            author_img: post.user.profilePicture,
            author_email: post.user.email,
            title: post.title,
            post_content: post.post_content,
            time_stamp: sharedTimeAgoString,
            like: post.like,
            comment: await Comment.countDocuments({ post: post._id }),
            share: post.shares.length,
            is_liked: Boolean(isShareLiked),
            post_id: post._id,
          }
        };

        // Add the formatted shared post to the result array
        postsWithDetails.push(formattedSharedPost);
      }
    }

    // Send the array of formatted posts to the frontend
    res.json(postsWithDetails);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
});

router.get('/profileView', async (req, res) => {
  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const userId = req.session.userId || req.user._id;

  try {
    // Fetch the user's posts
    const posts = await Post.find({ user: userId }).populate('user', 'username email profilePicture');

    // Structure the posts according to the required format
    const structuredPosts = await Promise.all(posts.map(async post => {
      // Calculate comment count asynchronously
      const commentCount = await Comment.countDocuments({ post: post._id });

      return {
        post: {
          author_name: post.author_name || post.user.username,
          author_img: post.user.profilePicture || "https://randomuser.me/api/portraits/men/1.jpg",
          time_stamp: new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          title: post.title,
          post_content: post.post_content,
          post_id: post._id.toString(),
          is_liked: false, // Assuming the like status is determined elsewhere
          like: post.like,
          comment: commentCount, // Use the calculated comment count
          share: post.shares.length,
          email: post.user.email
        }
      };
    }));

    res.status(200).json(structuredPosts);
  } catch (error) {
    console.error("Error fetching posts: ", error);
    res.status(500).json({ message: 'Server error: Unable to fetch posts' });
  }
});
//..........................................................
//Liking or Unliking a post route
//..........................................................
router.post('/Like', async function(req, res) {
  try {
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const userId = req.session.userId || req.user._id;
    const postId = req.body.postId;
    const existingLike = await Likes.findOne({ post: postId, user: userId });
    if (existingLike) {
      // Handle unlike logic
      await Likes.deleteOne({ _id: existingLike._id });

      const post = await Post.findById(postId);
      post.like--;
      await post.save();
      res.status(200).json({ message: 'Post unliked' });
    } else {
      // Handle like logic
      const like = new Likes({ user: userId, post: postId });
      await like.save();
      const post = await Post.findById(postId);
      post.like++;
      await post.save();
      res.status(200).json({ message: 'Post liked' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/SharePostlike', async function(req, res) {
  try {
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const userId = req.session.userId || req.user._id;
    const postId = req.body.postID;
    const shareid = req.body.shared_id;

    const existingLike = await Likes.findOne({ post: shareid, user: userId });

    if (existingLike) {
      // Handle unlike logic
      await Likes.deleteOne({ _id: existingLike._id });

      const post = await Post.findById(postId);
      
      post.shares.forEach(share => {
          console.log(share);
          if (share._id==shareid) {
            share.sharedLikes--;
            share.save();
          }
        });
      await post.save();
      res.status(200).json({ message: 'Post unliked' });
    } else {
      // Handle like logic
      const like = new Likes({ user: userId, post: shareid });
      await like.save();

      const post = await Post.findById(postId);
      console.log(post);
      console.log("post is found for liking");
      
        post.shares.forEach (share =>{
          if (share._id==shareid) {
            share.sharedLikes++;
            share.save();
          }
        });
      await post.save();
      res.status(200).json({ message: 'Post liked' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
//.......................................................................................
//Comments Handling
//.......................................................................................
router.post('/comment/add', async (req, res) => {
  try {
    const { comment, postID, shared_id } = req.body;
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const userId = req.session.userId || req.user._id;  

    let post;
    if (shared_id) {
      // When shared_id is provided
      post = await Post.findById(postID);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
         // Create and save the new comment
      const newComment = new Comment({ user: userId, post: shared_id, comment });
      await newComment.save();
      // Find the specific share
      const share = post.shares.id(shared_id);
      if (!share) {
        return res.status(404).json({ message: 'Share not found' });
      }    
  
      // Retrieve user data
      const user = await User.findById(userId, 'username profilePicture');
      const postDetails = {
        _id: post._id,
        title: post.title,
        post_content: post.post_content
      };

      return res.status(201).json({
        message: 'Comment added successfully',
        comment: {
          ...newComment._doc,
          user,
          post: postDetails
        },
        share
      });
    } else {
      // When only postID is provided
      post = await Post.findById(postID);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
     // Create and save the new comment
        const newComment = new Comment({ user: userId, post: postID, comment });
        await newComment.save();
      // Retrieve user data
      const user = await User.findById(userId, 'username profilePicture');
      const postDetails = {
        _id: post._id,
        title: post.title,
        post_content: post.post_content
      };

      return res.status(201).json({
        message: 'Comment added successfully',
        comment: {
          ...newComment._doc,
          user,
          post: postDetails
        }
      });
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/comments/:postID", async (req, res) => {
  try {
    const postID = req.params.postID;

    const comments = await Comment.find({ post: postID }).populate('user replies.user');
    const now = new Date();
    const commentsData = comments.map(comment => ({
      img: comment.user.profilePicture,
      name: comment.user.username,
      comment: comment.comment,
      _id: comment._id,
      like:comment.like,
      is_liked:comment.is_liked,
      timeStamp: timeAgo(now - new Date(comment.createdAt)),
      replys: comment.replies.map(reply => ({
        _id: reply._id, 
        img: reply.user.profilePicture,
        name: reply.user.username,
        comment: reply.comment,
        timeStamp: timeAgo(now - new Date(reply.createdAt)), 
        like:reply.like,
        is_liked:reply.is_liked,
      }))
    }));

    res.json({ comments: commentsData });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post("/comment/reply",async function(req,res){
  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const userId = req.session.userId || req.user._id;
    try {
      const comment = await Comment.findById(req.body.commentID);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      const newReply = {
        user: userId,
        comment: req.body.comment,
        createdAt: new Date(),
      };
  
      comment.replies.push(newReply);
      await comment.save();
  
      res.status(200).json(newReply);
    } catch (error) {
      res.status(500).json({ message: 'Error adding reply', error });
    }
});

router.post('/comment/:commentId/reply', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reply } = req.body;
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const userId = req.session.userId || req.user._id;
    const newReply = {
      user: userId,
      comment: reply,
      createdAt: new Date(),
      like: 0,
      is_liked: false,
    };

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $push: { replies: newReply } },
      { new: true }
    ).populate('replies.user', 'username');
    res.status(200).json({ message: 'Reply added successfully', comment: updatedComment });
    
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});
//......................................................................................................
//Follow Suggestion Handling
//......................................................................................................
router.post("/suggestion/follow", async function (req, res) {
  const userToFollow = req.body.userId;
 
  // Verify the JWT token
  try {
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const currentUser = req.session.userId || req.user._id;

    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    const newfollower = new FollowRequest({
      sender:currentUser,
      receiver:userToFollow
    });
    newfollower.save();

    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/follow/suggestions", async (req, res) => {

  try {
    // Verify the JWT token
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const currentUser = req.session.userId || req.user._id;

    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Get the current user document
    const currentUserDoc = await User.findById(currentUser);
    if (!currentUserDoc) {
      return res.status(404).json({ message: 'User not found' });
    }
    const followRequests = await FollowRequest.find({
      sender: currentUser,
      status: { $in: ['pending', 'accepted'] }
    }).select('receiver');
    
    const followRequestUserIds = followRequests.map(req => req.receiver);
    
    const suggestions = await User.find({
      _id: { 
        $ne: currentUser, 
        $nin: [...currentUserDoc.following, ...followRequestUserIds] 
      }
    }).select('username profilePicture');
  
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching follow suggestions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/user/followers", async (req, res) => {
  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const currentUserId = req.session.userId || req.user._id;
  const userId = req.query.userId || currentUserId;  // Use userId from the request body or the current user from token
  try {
    const user = await User.findById(userId).populate('followers', 'username profilePicture _id').populate('following', 'username profilePicture _id');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      followers: user.followers,
      following: user.following,
      username: user.username,
      img:user.profilePicture,
    });
  } catch (error) {
    console.error('Error fetching user followers and following:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete("/follower/:userId", async (req, res) => {
  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const currentUser = req.session.userId || req.user._id;

  const userIdToRemove = req.params.userId;

  try {
    // Remove userIdToRemove from the followers array of currentUser
    await User.findByIdAndUpdate(currentUser, { $pull: { followers: userIdToRemove } });
    
    // Remove currentUser from the following array of userIdToRemove
    await User.findByIdAndUpdate(userIdToRemove, { $pull: { following: currentUser } });

    res.status(200).json({ message: "Follower/Following removed successfully" });
  } catch (error) {
    console.error("Error removing follower/following:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/following/:userId", async (req, res) => {
  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const currentUser = req.session.userId || req.user._id;

  const userIdToRemove = req.params.userId;

  try {
    // Remove userIdToRemove from the followers array of currentUser
    await User.findByIdAndUpdate(currentUser, { $pull: { following: userIdToRemove } });
    
    // Remove currentUser from the following array of userIdToRemove
    await User.findByIdAndUpdate(userIdToRemove, { $pull: { followers: currentUser } });

    res.status(200).json({ message: "Follower/Following removed successfully" });
  } catch (error) {
    console.error("Error removing follower/following:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/follow/requests", async function (req, res) {
 
  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const currentUser = req.session.userId || req.user._id;

  try {
    // Query the database for follow requests where the receiver is the current user and status is pending
    const followRequests = await FollowRequest.find({ receiver: currentUser, status: "pending" });
    if (followRequests.length > 0) {
      const followRequestsData = [];
      for (const request of followRequests) {
        // Calculate the time difference for the follow req coming
      const creationTime = new Date(request.createdAt);
      const now = new Date();
      const timeDifference = now - creationTime;
      const timeAgoString = timeAgo(timeDifference);

        const sender = await User.findById(request.sender);
        const requestData = {
          username: sender.username,
          email: sender.email,
          timeStamp: timeAgoString, // Assuming you want to use createdAt as the timestamp
          _id: sender._id, // This should be the request ID, not sender ID
          img:sender.profilePicture
        };
        followRequestsData.push(requestData);
      }
      res.status(200).json(followRequestsData);
    } else {
      res.status(200).json([]); // Return an empty array if no follow requests are found
    }
  } catch (error) {
    console.error("Error fetching follow requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/follow/confirm', async (req, res) => {
  const { requestId } = req.body;

  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const currentUser = req.session.userId || req.user._id;
  try {
    // Find the follow request
    const followRequest = await FollowRequest.findOne({
      receiver: currentUser,
      sender: requestId
    });
      if (!followRequest) {
      console.log('Follow request not found');
      return res.status(404).json({ message: 'Follow request not found' });
    }
    // Update follow request status to accepted
    followRequest.status = 'accepted';
    await followRequest.save();

    // Update the followers and following lists
    const sender = await User.findByIdAndUpdate(
      followRequest.sender,
      { $addToSet: { following: currentUser } },
      { new: true }
    );

    const receiver = await User.findByIdAndUpdate(
      currentUser,
      { $addToSet: { followers: followRequest.sender } },
      { new: true }
    ); 

    res.status(200).json({ message: 'Follow request accepted' });
  } catch (error) {
    console.error('Error confirming follow request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a follow request
router.post("/follow/delete", async function (req, res) {
  const { requestId } = req.body;

  if (!req.session.userId && !req.user) {
    return res.status(401).json({ message: 'Unauthorized: No session or user found' });
  }

  const currentUser = req.session.userId || req.user._id;

  try {
    

    // Find the follow request by ID
    const followRequest = await FollowRequest.findOne({
      receiver: currentUser,
      sender: requestId
    });
      
    if (!followRequest) {
      return res.status(404).json({ message: "Follow request not found" });
    }
    // Delete the follow request
    await FollowRequest.deleteOne({sender:requestId,receiver:currentUser});

    res.status(200).json({ message: "Follow request deleted" });
  } catch (error) {
    console.error("Error deleting follow request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/comment/reply', async (req, res) => {
  try {
    const { commentId, userId, reply } = req.body;

    // Check if the comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Add the reply to the comment
    comment.replies.push({ user: userId, comment: reply });
    await comment.save();

    // Return success response
    res.status(201).json({ message: 'Reply added successfully' });
  } catch (error) {
    handleServerError(res, error);
  }
});
//.........................................................................................................
//post Sharing Handling
//.........................................................................................................
router.post("/post/share",async (req, res) => {
  try {
    const { postId, message } = req.body; // Get postId from request body
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const currentUser = req.session.userId || req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const user = await User.findById(currentUser);
    if (!user) {
      console.error("User not found with ID:", currentUser);
    }   
    const share = {
      user: currentUser,
      comment: message || '',
      sharedAt: Date.now(),
      username:user.username,
    };
    post.shares.push(share);
    post.is_shared = true;
    await post.save();
    res.status(200).json({ message: 'Post shared successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});
router.delete("/post/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    // Find the post by ID and delete it
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (deletedPost) {
      res.status(200).json({ message: "Post deleted successfully" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
});
router.post('/like/:commentId', async function(req, res) {
  try {
    const { replyId } = req.body; // Use consistent naming
    const { commentId } = req.params;

    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const userId = req.session.userId || req.user._id;

    if (!replyId) {
      // Handling likes/unlikes for comments
      const existingLike = await CommentsLikes.findOne({ comment: commentId, user: userId });
      if (existingLike) {
        // Handle unlike logic
        await CommentsLikes.deleteOne({ _id: existingLike._id });
        const comment = await Comment.findById(commentId);
        if (comment) {
          comment.like--;
          comment.is_liked = false;
          await comment.save();
          res.status(200).json({ message: 'Comment unliked' });
        } else {
          res.status(404).json({ message: 'Comment not found' });
        }
      } else {
        // Handle like logic
        const like = new CommentsLikes({ user: userId, comment: commentId });
        await like.save();
        const comment = await Comment.findById(commentId);
        if (comment) {
          comment.like++;
          comment.is_liked = true;
          await comment.save();
          res.status(200).json({ message: 'Comment liked' });
        } else {
          res.status(404).json({ message: 'Comment not found' });
        }
      }
    } else {
      // Handling likes/unlikes for replies
      const existingLike = await CommentsLikes.findOne({ comment: replyId, user: userId });

      if (existingLike) {
        // Handle unlike logic
        await CommentsLikes.deleteOne({ _id: existingLike._id });

        const comment = await Comment.findById(commentId);
        if (comment) {
          const reply = comment.replies.id(replyId); // Find the reply by ID
          if (reply) {
            reply.like--;
            reply.is_liked = false;
            await comment.save();
            res.status(200).json({ message: 'Reply unliked' });
          } else {
            res.status(404).json({ message: 'Reply not found' });
          }
        } else {
          res.status(404).json({ message: 'Comment not found' });
        }
      } else {
        // Handle like logic
        const like = new CommentsLikes({ user: userId, comment: replyId });
        await like.save();

        const comment = await Comment.findById(commentId);
        if (comment) {
          const reply = comment.replies.id(replyId); // Find the reply by ID
          if (reply) {
            reply.like++;
            reply.is_liked = true;
            await comment.save();
            res.status(200).json({ message: 'Reply liked' });
          } else {
            res.status(404).json({ message: 'Reply not found' });
          }
        } else {
          res.status(404).json({ message: 'Comment not found' });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/uploads', upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.session.userId && !req.user) {
      return res.status(401).json({ message: 'Unauthorized: No session or user found' });
    }

    const userId = req.session.userId || req.user._id;

    // Check if a file is provided
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const file = req.file;
    const fileName = `${userId}_${Date.now()}`; 

    const user = await User.findById(userId);
   
    // Check if the user has an existing profile picture
    if (user && user.profilePicture && user.profilePicture !== '/images/toukir.jpg') {
      const oldProfilePicUrl = user.profilePicture;
      
      // Ensure oldProfilePicUrl is a valid string before trying to split
      if (oldProfilePicUrl.includes('/o/') && oldProfilePicUrl.includes('?')) {
        const oldFilePath = decodeURIComponent(oldProfilePicUrl.split('/o/')[1].split('?')[0]);

        try {
          // Delete the old profile picture from Firebase Storage
          await admin.storage().bucket().file(oldFilePath).delete();
          console.log('Old profile picture deleted successfully');
        } catch (deleteError) {
          console.error('Error deleting old profile picture:', deleteError);
        }
      } else {
        console.error('Invalid old profile picture URL:', oldProfilePicUrl);
      }
    }

    // Upload the new profile picture to Firebase Storage
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (err) => {
      console.error('Error uploading to Firebase:', err);
      return res.status(500).json({ message: 'Error uploading file' });
    });

    blobStream.on('finish', async () => {
      // Get the public URL of the uploaded image
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media`;

      // Update the user's profile picture URL in the database
      await User.findByIdAndUpdate(userId, { profilePicture: publicUrl });
      res.status(200).json({ message: 'Profile picture uploaded successfully', profilePicUrl: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
router.get('/posts/:userId', async function(req, res) {
  const userId = req.params.userId;
  try {
    // Fetch the user details, even if the user hasn't made any posts
    const user = await User.findById(userId).select('username email profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the user's posts
    const posts = await Post.find({ user: userId }).populate('user', 'username email profilePicture');

    // Create author details from the user info
    const authorDetails = {
      author_name: user.username,
      author_img: user.profilePicture,
      author_email: user.email,
    };

    // Structure the posts according to the required format
    const structuredPosts = await Promise.all(posts.map(async post => {
      // Calculate comment count asynchronously
      const commentCount = await Comment.countDocuments({ post: post._id });

      return {
        post: {
          author_name: post.user.username, // Use user details from the post
          author_img: post.user.profilePicture,
          time_stamp: new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          title: post.title,
          post_content: post.post_content,
          post_id: post._id.toString(),
          is_liked: false, // Assuming the like status is determined elsewhere
          like: post.like,
          comment: commentCount, // Use the calculated comment count
          share: post.shares.length,
          email: post.user.email
        }
      };
    }));

    res.status(200).json({
      authorDetails,
      posts: structuredPosts
    });
  } catch (error) {
    console.error("Error fetching posts: ", error);
    res.status(500).json({ message: 'Server error: Unable to fetch posts' });
  }
});
router.get('/user',async function(req,res) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized: No session found' });
  }

  const userId = req.session.userId;
   // Use findById with select to fetch only specific fields
   const user = await User.findById(userId).select('username profilePicture email');

   if (!user) {
     return res.status(404).json({ message: 'User not found' });
   }

   // Send only username, profilePicture, and email to the frontend
   res.json({
     username: user.username,
     profilePicture: user.profilePicture,
     email: user.email
   });
});
router.get('/auth/check-session', (req, res) => {
  if (req.session.user || req.user) { // Checking both session for regular login and Passport user object
    console.log(req.session.user);
    console.log(req.user);
    return res.status(200).json({ isAuthenticated: true });
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
});

router.post('/contact', async function (req, res) {
  const { name, email, message } = req.body;
  // Setup Nodemailer for sending the email
  const transporter = nodemailer.createTransport({
    service: 'Gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, 
    subject: `Contact form submission from: ${name}`, 
    text: `You have a new contact form submission.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`, 
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error during contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Search users based on username
router.get('/search/users', async (req, res) => {
  try {
    // // Check for an active session
    // if (!req.session || !req.session.userId) {
    //   return res.status(401).json({ message: 'Unauthorized: No session found' });
    // }
    // Retrieve the search term from query parameters
    const { value } = req.query;
    if (!value || typeof value !== 'string') {
      return res.status(400).json({ message: 'Invalid search query' });
    }
    // Perform a case-insensitive search on the username
    const regex = new RegExp(value, 'i'); // 'i' for case-insensitive
    const users = await User.find({ username: { $regex: regex } }).limit(10); // Limit results for performance
    res.json(users);
  } catch (error) {
    console.error('Error in /search/users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;