const { isAuthenticated } = require("../middlewares/authCheck");

const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  apiGetAllQr,
  apiAddQr,
  apiGetQrByUserId,
  apiDeleteQrById,
  apiRedirect,
  apiGetQrById,
} = require("../controllers/qrcodeContoller");

// router.get("/getAll", isAuthenticated, apiGetAllQr);
router.get("/getSingleQr/:qrId", isAuthenticated, apiGetQrById);
router.get("/getQrByUserId/:userId", isAuthenticated, apiGetQrByUserId);
router.get("/:shortUrl", apiRedirect);

router.post("/addQr", upload.single("filename"), isAuthenticated, apiAddQr);
router.delete("/deleteQr/:qrId", isAuthenticated, apiDeleteQrById);

const qrcodeRoute = router;
module.exports = qrcodeRoute;
