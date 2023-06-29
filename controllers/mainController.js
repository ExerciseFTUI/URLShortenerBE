const ShortUrl = require("../models/shortUrl");
const User = require("../models/userModel");

//api to get all short urls
const apiGetAll = async (req, res) => {
  try {
    const shortUrls = await ShortUrl.find();
    res.status(200).json(shortUrls);
  } catch (err) {
    res.status(400).json(err);
  }
};

//api to post a new url and shorten it
const apiPostShorten = async (req, res) => {
  try {
    const shortUrls = new ShortUrl({
      full: req.body.fullUrl,
      short: req.body.shortUrl,
    });
    await shortUrls.save();
    res.status(200).json(shortUrls);
  } catch (err) {
    res.status(404).json(err);
  }
};

//api to update a short url
const apiPutShorten = async (req, res) => {
  try {
    const shortUrls = await ShortUrl.findOneAndUpdate(
      { full: req.body.fullUrl },
      { full: req.body.fullUrl, short: req.body.shortUrl }
    );
    res.status(200).json(shortUrls);
  } catch (err) {
    res.status(404).json(err);
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

module.exports = {
  apiGetAll,
  apiPostShorten,
  apiGetRedirect,
  apiPutShorten,
  apiGetAllUser,
};
