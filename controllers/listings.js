const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const { category, search } = req.query;
  let allListings = [];

  if (search) {
    const searchTerm = search.trim(); // Trim whitespace from the search term
    const searchRegex = new RegExp(searchTerm, "i"); // 'i' flag for case-insensitive search

    allListings = await Listing.find({
      $or: [
        { title: { $regex: searchRegex } },
        { location: { $regex: searchRegex } },
        { country: { $regex: searchRegex } },
      ],
    });
  } else if (category) {
    allListings = await Listing.find({ category: category });
  } else {
    allListings = await Listing.find({});
  }

// if (allListings.length == 0) {
//    req.flash("error", "No listings found matching your search criteria.");
// }

  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // console.log(req.user)
  res.render("./listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "This Listing doesn't exist!");
    return res.redirect("/listings");
  }
  // console.log(listing);
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => { 
  // let{title, description, image, price, location, country} = req.body;
   
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send()
  
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing!");
  }
  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url,"..", filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  // if(!newListing.description){
  //   throw new ExpressError(400, "Description is missing!");
  // }
  // if (!newListing.title) {
  //   throw new ExpressError(400, "Title is missing!");
  // }
  // if (!newListing.price) {
  //   throw new ExpressError(400, "Price is missing!");
  // }
  // if (!newListing.location) {
  //   throw new ExpressError(400, "Location is missing!");
  // }
  // if (!newListing.country) {
  //   throw new ExpressError(400, "Country is missing!");
  // }
  let savedListing = await newListing.save();
  // console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "This Listing doesn't exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
 ;
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};