const User = require("../models/user.js")

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};
module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      // console.log(registeredUser);
      req.login(registeredUser, (e) => {
        if (e) {
          return next(e);
        }
        req.flash("success", "Welcome to WanderBloom!");
        res.redirect("/listings");
      });
    } catch (error) {
      // console.log(error);
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  }

  module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
  };

  module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to WanderBloom!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logout = (req, res, next) => {
    req.logout((e) => {
      if (e) {
        return next(e);
      }
      req.flash("success", "You are now Logged Out!");
      res.redirect("/listings");
    });
  };