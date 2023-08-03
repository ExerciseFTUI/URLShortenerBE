const {
  apiGetAll,
  apiPostShorten,
  apiGetRedirect,
  apiPutShorten,
  apiGetAllUser,
  apiUpdateUser,
  apiDeleteShorten,
  apiSearchShorten,
} = require("../controllers/mainController");

const upload = require("../config/multer");

const express = require("express");
const { isAuthenticated } = require("../middlewares/authCheck");
const router = express.Router();

//Upload File
// router.post("/upload", upload.single("filename"), apiUploadFile);

//Update User Data
router.put("/updateUser/:userId", isAuthenticated, apiUpdateUser);

router.get("/", isAuthenticated, apiGetAllUser);
// router.get("/users", isAuthenticated, apiGetAllUser);
router.get("/url/:id", isAuthenticated, apiGetAll);
router.post("/create", isAuthenticated, apiPostShorten);
router.put("/update", isAuthenticated, apiPutShorten);
router.get("/search/:id", isAuthenticated, apiSearchShorten);
router.delete("/delete/:id", isAuthenticated, apiDeleteShorten);

//api to redirect to the full url
router.get("/:shortUrl", apiGetRedirect);

module.exports = router;
