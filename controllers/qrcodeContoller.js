const Qr = require("../models/qrcodeModel");
const User = require("../models/userModel");
const cloudinary = require("../config/cloudinary");
// const { uploadHandler } = require("../utils/uploadHandler");

//Route:
// AddQR
// GetAll
// GetByUser
// Delete

//api to get all Qr
const apiGetAllQr = async (req, res) => {
  try {
    const qrCodes = await Qr.find();
    res.status(200).json({ success: true, payload: qrCodes });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to get Qr code" });
  }
};

//api to get Qr by userId
const apiGetQrByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const qrCodes = await Qr.find({ userId: userId });

    if (!qrCodes) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    res.status(200).json({ success: true, payload: qrCodes });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to get Qr code" });
  }
};

//api to get a single Qr by its ID
const apiGetQrById = async (req, res) => {
  try {
    const qrId = req.params.qrId;
    const qrCode = await Qr.findById(qrId);

    if (!qrCode) {
      return res
        .status(404)
        .json({ success: false, message: "QR code not found" });
    }

    res.status(200).json({ success: true, payload: qrCode });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to get QR code" });
  }
};

const apiDeleteQrById = async (req, res) => {
  try {
    const qrId = req.params.qrId;
    const deletedQr = await Qr.findByIdAndDelete(qrId);

    if (!deletedQr) {
      return res
        .status(404)
        .json({ success: false, message: "QR code not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "QR code deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete QR code" });
  }
};

const apiRedirect = async (req, res) => {
  try {
    const shortUrl = req.params.shortUrl;

    const qrCode = await Qr.findOne({ shortUrl });

    if (qrCode === null) {
      return res.status(400).json({ success: false, message: "Url Not Found" });
    }

    // Increment the 'scan' field
    qrCode.scan = qrCode.scan + 1;

    await qrCode.save();

    res.redirect(qrCode.url);
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to redirect" });
  }
};

//api to upload file
const apiAddQr = async (req, res) => {
  try {
    const { userId, url, title, customColor } = req.body;
    let fileUrl;
    //Check if 'url' exists and has a value
    if (!url || url.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });
    }

    //Check if 'url' is valid
    if (!isValidUrl(url)) {
      return res.status(400).json({ success: false, message: "Invalid Url" });
    }

    //Get User information
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    //Get Qr Code count for naming the file
    const numberOfQrCodes = await Qr.countDocuments({
      userId: userId,
      qrLogo: { $exists: true },
    });

    //Check if file exists
    if (req.file) {
      //Validating file size and type
      const fileError = validateImageFile(req.file);
      if (fileError) {
        return res.status(400).json({ success: false, message: fileError });
      }

      //Uploading file to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: `urlshortener/${user.name}`,
        use_filename: true,
      });

      //Set fileUrl to image url
      fileUrl = result.secure_url;
    }

    // Generate short URL
    const shortUrl = await generateShortUrl();

    const newQrCode = new Qr({
      userId,
      url,
      shortUrl,
      qrLogo: fileUrl,
      title,
      customColor,
    });

    await newQrCode.save();

    //Response
    res.status(200).json({
      success: true,
      payload: newQrCode,
      message: "Successfully Add New QR",
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const generateShortUrl = async () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let shortUrl = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUrl += characters[randomIndex];
  }

  // Check if the generated short URL already exists in the database
  const existingQrCode = await Qr.findOne({ shortUrl });
  if (existingQrCode) {
    // If it exists, recursively generate a new short URL
    return generateShortUrl();
  }

  return shortUrl;
};

function isValidUrl(urlString) {
  let url;
  try {
    url = new URL(urlString);
  } catch (e) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const validateImageFile = (file) => {
  if (!file.mimetype.startsWith("image/")) {
    return "Only image files are allowed.";
  }

  if (file.size > 3 * 1024 * 1024) {
    return "File size should be less than 3MB.";
  }

  return null; // No error
};

module.exports = {
  apiGetAllQr,
  apiGetQrById,
  apiGetQrByUserId,
  apiAddQr,
  apiDeleteQrById,
  apiRedirect,
};
