const express = require("express");
const Review = require("../models/review");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//REVIEWS post review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.postReview)
);

// DELETE Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync (reviewController.deleteReview));

module.exports = router;