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

router.get("/", apiGetAllUser);
// router.get("/users", isAuthenticated, apiGetAllUser);
router.get("/url/:id", apiGetAll);
router.post("/create", apiPostShorten);
router.put("/update", apiPutShorten);

//api to redirect to the full url
router.get("/:shortUrl", apiGetRedirect);

module.exports = router;
