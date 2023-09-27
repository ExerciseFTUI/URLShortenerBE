const ShortUrl = require("../models/shortUrl");
const User = require("../models/userModel");

//api to get all user
const apiGetAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users: users });
  } catch (err) {
    res.status(400).json(err);
  }
};

//api to update user data
const apiUpdateUser = async (req, res) => {
  const userId = req.params.userId;
  const updatedData = req.body; // Assuming the request body contains the updated fields

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the user object with the new data
    user.name = updatedData.name || user.name;
    user.universitas = updatedData.universitas || user.universitas;
    user.fakultas = updatedData.fakultas || user.fakultas;
    user.jurusan = updatedData.jurusan || user.jurusan;
    user.angkatan = updatedData.angkatan || user.angkatan;

    // Save the updated user to the database
    const updatedUser = await user.save();

    console.log(updatedUser);

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update user",
      error: err.message,
    });
  }
};

//api to get all short urls by passing 0 else it will find by user id
const apiGetAll = async (req, res) => {
  try {
    const user_id = req.params.id;
    const query = user_id != 0 ? { user_id } : {};

    const shortUrls = await ShortUrl.find(query);
    const success = shortUrls.length > 0;
    res.status(200).json({ success: success, results: shortUrls });
  } catch (err) {
    res.status(400).json({ success: false, errors: err });
  }
};

//api to post a new url and shorten it
const apiPostShorten = async (req, res) => {
  try {
    let shortUrls;
     //Check if short url already exists in the database
     if (req.body.short_url) {
      const existingShortUrl = await ShortUrl.findOne({
        short: req.body.short_url.trim(),
      });
      if (existingShortUrl) {
        return res
          .status(409)
          .json({ success: false, error: "Short URL already exists" });
      }
    }

    if (
      (req.body.short_url && req.body.short_url.trim() !== "") ||
      (req.body.title && req.body.title.trim() !== "")
    ) {
      if (req.body.short_url.trim() === "") {
        shortUrls = new ShortUrl({
          user_id: req.body.user_id,
          title: req.body.title,
          full: req.body.full_url,
        });
      } else {
        shortUrls = new ShortUrl({
          user_id: req.body.user_id,
          title: req.body.title,
          full: req.body.full_url,
          short: req.body.short_url,
        });
      }
    } else {
      shortUrls = new ShortUrl({
        user_id: req.body.user_id,
        full: req.body.full_url,
      });
    }
    await shortUrls.save();
    res.status(200).json({ success: true, results: shortUrls });
  } catch (err) {
    res.status(404).json({ success: false, errors: err });
  }
};

//api to update a short urls
const apiPutShorten = async (req, res) => {
  try {
    if (!req.body.full_url) {
      return res.status(400).json({ success: false, error: "Full URL is required" });
    }
  
    if (!req.body.title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }
  
    if (req.body.short_url) {
      const existingShortUrl = await ShortUrl.findOne({ short: req.body.short_url.trim() });
  
      if (existingShortUrl && existingShortUrl._id.toString() !== req.body._id.toString()) {
        return res.status(409).json({ success: false, error: "Short URL already exists" });
      }
    }
  
    const updateFields = {
      full: req.body.full_url,
      title: req.body.title,
    };
  
    if (req.body.short_url) {
      updateFields.short = req.body.short_url;
    }
  
    const updatedShortUrl = await ShortUrl.findOneAndUpdate(
      { _id: req.body._id },
      updateFields,
      { new: true } // This option ensures you get the updated document
    );
  
    if (!updatedShortUrl) {
      return res.status(404).json({ success: false, error: "Short URL not found" });
    }
  
    return res.status(200).json({ success: true, results: "Successfully Updated the Short URL!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }  
};

//api to lookup a short url
const apiSearchShorten = async (req, res) => {
  try {
    const shortUrl = await ShortUrl.findOne({ _id: req.params.id });
    res.status(200).json({ success: true, results: shortUrl });
  } catch (err) {
    res.status(404).json({ success: false, errors: err });
  }
};

//api to delete a short url
const apiDeleteShorten = async (req, res) => {
  try {
    await ShortUrl.deleteOne({ _id: req.params.id });
    res.status(200).json({ success: true, results: "Successfully Deleted!" });
  } catch (err) {
    res.status(404).json({ success: false, errors: err });
  }
};

//api to redirect to the full url
const apiGetRedirect = async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (!shortUrl) return res.redirect(`${process.env.CLIENT_URL}/not-found`);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
};

module.exports = {
  apiGetAll,
  apiUpdateUser,
  apiPostShorten,
  apiGetRedirect,
  apiPutShorten,
  apiGetAllUser,
  apiDeleteShorten,
  apiSearchShorten,
};
