const Router = require("express");
const {
  getCourse,
  getCourseById,
  postEnrollment,
  getStudentEnrollmentByCourse,
} = require("../controllers/courseController.js");

const router = Router();
router.get("/course", getCourse);
router.get("/course/:userID", getCourseById);
router.post("/course", postEnrollment);
router.get("/teachercourse/:userID", getStudentEnrollmentByCourse);

module.exports = router;
