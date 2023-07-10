const ShortUrl = require("../models/shortUrl");
const User = require("../models/userModel");
const { uploadHandler } = require("../utils/uploadHandler");

//api to get all user
const apiGetAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, results: users });
  } catch (err) {
    res.status(400).json({ success: false, errors: err });
  }
};

//api to get all short urls
const apiGetAll = async (req, res) => {
  try {
    const { user_id } = req.body;
    const query = user_id ? { user_id } : {};

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
    if (req.body.short_url && req.body.short_url.trim() !== "") {
      shortUrls = new ShortUrl({
        user_id: req.body.user_id,
        full: req.body.full_url,
        short: req.body.short_url,
      });
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

//api to update a short url
const apiPutShorten = async (req, res) => {
  try {
    let shortUrls;
    if (req.body.full_url && req.body.full_url.trim() !== "") {
      shortUrls = await ShortUrl.findOneAndUpdate(
        { _id: req.body._id },
        { full: req.body.full_url, short: req.body.short_url }
      );
    } else {
      shortUrls = await ShortUrl.findOneAndUpdate(
        { _id: req.body._id },
        { short: req.body.short_url }
      );
    }
    res.status(200).json({ success: true, results: "Successfully Updated!" });
  } catch (err) {
    res.status(404).json({ success: false, errors: err });
  }
};

//api to redirect to the full url
const apiGetRedirect = async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
};

//api to get all user
const apiGetAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, users: users });
  } catch (err) {
    res.status(400).json(err);
  }
};

//api to upload file
const apiUploadFile = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Tidak ada file yang diunggah.");
    }

    const url = await uploadHandler(req, "Testing", "");

    //Response
    res.status(200).json({
      message: "Succefully Upload File",
      error: false,
      url: url,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  apiGetAll,
  apiPostShorten,
  apiGetRedirect,
  apiPutShorten,
  apiGetAllUser,
  apiUploadFile,
};
