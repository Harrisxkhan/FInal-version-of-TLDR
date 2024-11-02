const mongoose = require('mongoose');
//User Credentials Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    unique: false,
  },
  password: {
    type: String,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  profilePicture: {
    type: String,
    default:'/images/toukir.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  googleId:{
    type:String
  },
  githubId:{
    type:String
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String }, 
});



const User = mongoose.model('User', userSchema);

//User post scheme
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title:{
    type:String,
    required:true
  },
  post_content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author_name:{
    type:String,
    required:true
  },
  like: {
    type: Number,
    default: 0,
  },
  is_shared:{
    type:Boolean,
    default:false
  },
  shares: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      comment:{
        type:String
      },
      sharedAt: {
        type: Date,
        default: Date.now
      },
      username:{
        type:String
      },
      sharedLikes:{
        type:Number,
        default:0
      }
    }
  ]
 
});

const Post = mongoose.model('Post', postSchema);

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  like:{
    type: Number,
    default:0
  },
  is_liked: Boolean,
});

//Posts Likes schema
const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});
const Likes = mongoose.model('Like',likeSchema);

//Users Comments
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  like: {
    type: Number,
    default: 0,
  },
  is_liked: Boolean,
  replies: [replySchema], // Nested replies
});

const Comment = mongoose.model('Comment', commentSchema);

//posts share schema
const shareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  originalPost: { // Reference to the original post being shared
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  sharedPost: { // Reference to the post created by the share action (can be null if sharing to a story)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const share = mongoose.model('Share', shareSchema);

const followRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: {
    type: Date,
    default: Date.now,
  },});

const FollowRequest = mongoose.model('FollowRequest', followRequestSchema);

//Comments Likes schema
const CommentslikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
});
const CommentsLikes = mongoose.model('CommentLike',CommentslikeSchema);

module.exports = { User,Comment,Likes,Post,FollowRequest,CommentsLikes};