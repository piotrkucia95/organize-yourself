module.exports = {
    createUser: function(username, password, email, facebookId, googleId, id, isActive, displayName) {
        var user = {};
        user.username = username;
        user.password = password;
        user.email = email;
        user.facebookId = facebookId;
        user.googleId = googleId;
        user.id = id;
        user.isActive = isActive;
        user.displayName = displayName;
        return user;
    }
}