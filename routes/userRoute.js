const Router = require("express");

const { getUser } = require("../controllers/userController.js");

const router = Router();

router.get("/users", getUser);
module.exports = router;
