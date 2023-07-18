const Qr = require("../models/qrcodeModel");

//Route:
// AddQR
// GetAll
// GetByUser
// Delete

const apiAddQr = async (req, res) => {
  try {
    // Get data from client
    const { userId, url, qrLogo, title, customColor } = req.body;

    // Generate short URL
    const shortUrl = await generateShortUrl();

    const newQrCode = new Qr({
      userId,
      url,
      shortUrl,
      qrLogo,
      title,
      customColor,
    });

    await newQrCode.save();

    res.status(200).json({
      success: true,
      payload: newQrCode,
      message: "Successfully Add New QR",
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to add Qr Code", error });
  }
};

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
    res.status(200).json({ success: true, payload: qrCodes });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to get Qr code" });
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

    res.redirect(qrCode.url);
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to redirect" });
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

module.exports = {
  apiGetAllQr,
  apiGetQrByUserId,
  apiAddQr,
  apiDeleteQrById,
  apiRedirect,
};
