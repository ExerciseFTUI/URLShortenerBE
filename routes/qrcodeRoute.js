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

router.get("/getAll", apiGetAllQr);
router.get("/getSingleQr/:qrId", apiGetQrById);
router.get("/getQrByUserId/:userId", apiGetQrByUserId);
router.get("/:shortUrl", apiRedirect);
// router.post("/addQr", apiAddQr);
router.post("/addQr", upload.single("filename"), apiAddQr);
router.delete("/deleteQr/:qrId", apiDeleteQrById);

const qrcodeRoute = router;
module.exports = qrcodeRoute;
