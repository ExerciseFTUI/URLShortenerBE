const {
  apiGetAll,
  apiPostShorten,
  apiGetRedirect,
  apiPutShorten,
  apiGetAllUser,
  apiUploadFile,
} = require("../controllers/mainController");

const upload = require("../config/multer");

const express = require("express");
const { isAuthenticated } = require("../middlewares/authCheck");
const router = express.Router();

//Upload File
router.post("/upload", upload.single("filename"), apiUploadFile);

//Upload File
router.post("/upload", upload.single("filename"), apiUploadFile);

router.get("/", apiGetAll);
router.get("/users", isAuthenticated, apiGetAllUser);
router.post("/create", apiPostShorten);
router.put("/update", apiPutShorten);
router.get("/:shortUrl", apiGetRedirect);

module.exports = router;
