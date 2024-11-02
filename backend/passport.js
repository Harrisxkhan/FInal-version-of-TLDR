const passport = require('passport'); 
const GoogleStrategy = require('passport-google-oauth2').Strategy; 
const { User,Comment,Likes,Follow,Post } = require('./models/models'); // Adjust the path to models

passport.serializeUser((user , done) => { 
	done(null , user); 
}) 
passport.deserializeUser(function(user, done) { 
	done(null, user); 
}); 

passport.use(new GoogleStrategy({ 
	clientID:process.env.CLIENT_ID, 
	clientSecret:process.env.CLIENT_SECRET, 
	callbackURL:"http://localhost:3000/auth/google/callback", 
	passReqToCallback:true
}, 
function(request, accessToken, refreshToken, profile, done) { 
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
    });
} 
));
