const Router = require("express");
const verifyToken = require("../middleware/jwt.js");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController.js");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/auth/me", verifyToken, getProfile);

module.exports = router;
