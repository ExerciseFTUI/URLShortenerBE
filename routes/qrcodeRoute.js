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
} = require("../controllers/qrcodeContoller");

router.get("/getAll", apiGetAllQr);
router.get("/getQrByUserId/:userId", apiGetQrByUserId);
router.get("/:shortUrl", apiRedirect);
router.post("/addQr", apiAddQr);
router.delete("/deleteQr/:qrId", apiDeleteQrById);

const qrcodeRoute = router;
module.exports = qrcodeRoute;
