// index.js
const express = require("express");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const cors = require("cors");
const { User, Comment, Likes, Follow, Post } = require("./models/models");
const routes = require("./routes/routes");
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userRoutes = require('./routes/user'); // Adjust the path as necessary
const LocalStrategy = require('passport-local').Strategy;
const app = express();

// -------------------- CORS Configuration --------------------
app.use(
  cors({
    origin: "http://localhost:5173", // Update with your React app's origin
    credentials: true, // Allow cookies to be sent
  })
);

// -------------------- Middleware Setup --------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "frontend", "public")));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// -------------------- MongoDB Connection --------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,    
    useUnifiedTopology: true,
    tlsInsecure: false,
    serverSelectionTimeoutMS: 5000,
          
  })
  .then(() => console.log("MongoDB connected")) 
  .catch((err) => console.error("MongoDB connection error:", err));

// -------------------- Session Configuration --------------------
app.use(
  session({
    name: "sessionId", // Name of the session ID cookie
    secret: process.env.SESSION_SECRET, // Replace with a strong secret
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: "sessions",
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true, 
      sameSite: "lax",
    },
  })
);

// -------------------- Passport Initialization --------------------
app.use(passport.initialize());
app.use(passport.session());

// -------------------- Passport Serialization --------------------
passport.serializeUser((user, done) => { 
  done(null, user.id); // Serialize the user ID to the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password"); // Exclude password field
    done(null, { _id: user._id, username: user.username, email: user.email, isVerified: user.isVerified }); // Return the full user object

    // done(null, user);
  } catch (err) {
    done(err, null);
  }
});

//---------------------Passport local strategy----------------------------
passport.use(new LocalStrategy(
  async (username, password, done) => {
    // Find the user by username
    const user = await User.findOne({ username });
    
    // Verify password (make sure to hash and compare)
    if (user && (await bcrypt.compare(password, user.password))) {
      // If login is successful, create a session with the same structure as Google login
      return done(null, { _id: user._id, username: user.username, email: user.email, isVerified: user.isVerified });
    } else {
      return done(null, false, { message: 'Invalid credentials.' });
    }
  }
));

// -------------------- Passport Google OAuth Strategy --------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true, // Pass req to the callback
    },
    async function (req, token, tokenSecret, profile, done) {
      try {
        const user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            isVerified:true,

          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return done(null, user);
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error
          return done(
            new Error("Email already in use. Please log in instead."),
            null
          );
        }
        return done(error, null);
      }
    }
  )
);

// -------------------- Passport GitHub OAuth Strategy --------------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOneAndUpdate(
          { githubId: profile.id },
          {
            githubId: profile.id,
            username: profile.username,
            email: profile.emails ? profile.emails[0].value : undefined,
            isVerified:true,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return done(null, user);
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error
          return done(
            new Error("Email already in use. Please log in instead."),
            null
          );
        }
        return done(error, null);
      }
    }
  )
);

// -------------------- Authentication Routes --------------------

// Google OAuth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
    // session: true is default; ensure it's true
  }),
  (req, res) => {
    // Successful authentication
    res.redirect("http://localhost:5173/auth/success"); // Redirect to frontend
  }
);

app.get("/auth/google/failure", (req, res) => {
  console.log("Failed to log in with Google");
  res.send("Google Authentication Failed");
});

// GitHub OAuth Routes
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/github/failure",
    // session: true is default; ensure it's true
  }),
  (req, res) => {
    // Successful authentication
    res.redirect("http://localhost:5173/auth/success"); // Redirect to frontend
  }
);

app.get("/auth/github/failure", (req, res) => {
  console.log("Failed to log in with GitHub");
  res.send("GitHub Authentication Failed");
});


app.get("/auth/token", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user); // Logs the authenticated user object
    return res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
});

// -------------------- Routes --------------------
app.use("/", routes);
app.use("/", userRoutes);

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
