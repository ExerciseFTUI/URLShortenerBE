const {
  apiGetAll,
  apiPostShorten,
  apiGetRedirect,
  apiPutShorten,
  apiGetAllUser,
} = require("../controllers/mainController");
const express = require("express");
const { isAuthenticated } = require("../middlewares/authCheck");
const router = express.Router();

router.get("/", apiGetAllUser);
router.post("/url", apiGetAll);
router.post("/create", apiPostShorten);
router.put("/update", apiPutShorten);
router.get("/:shortUrl", apiGetRedirect);

module.exports = router;
