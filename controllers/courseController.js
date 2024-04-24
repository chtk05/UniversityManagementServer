const { queryAsync } = require("../utils/auth.js");
const { v4: uuidv4 } = require("uuid");

const getCourse = async (req, res) => {
  try {
    const queryCourse = "SELECT * FROM universityCourses";
    const listCourse = await queryAsync(queryCourse);
    return res.status(200).json(listCourse);
  } catch (err) {
    return res.status(501).json({ error: "Error getting course details" });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { userID } = req.params;
    const q = `
    SELECT e.*, c.*
    FROM universityStudentEnrollment e
    INNER JOIN universityCourses c ON e.courseID = c.courseID
    WHERE e.userID = ?
  `;

    const enrolledCourseDetails = await queryAsync(q, [userID]);

    if (enrolledCourseDetails.length === 0) {
      throw new Error("No course found for this user");
    }

    res.status(200).json(enrolledCourseDetails);
  } catch (err) {
    console.error("Error fetching course details:", err);
    res.status(500).json({ message: "Failed to fetch course details" });
  }
};

const postEnrollment = async (req, res) => {
  try {
    const { userID, courseID } = req.body;
    const generatedUuid = uuidv4();
    const shortId = generatedUuid.replace(/-/g, "").substring(0, 6);
    const selectUser = `SELECT * FROM universityUsers WHERE userID = ?`;
    const selectCourse = `SELECT * FROM universityCourses WHERE courseID = ?`;
    const user = await queryAsync(selectUser, [userID]);
    const course = await queryAsync(selectCourse, [courseID]);
    if (user.length === 0 || course.length === 0) {
      return res.status(404).send({ message: "User or Course not found" });
    }
    const insertQuery = `INSERT INTO universityStudentEnrollment (userID, courseID, enrollID) VALUES (?, ?, ?)`;
    await queryAsync(insertQuery, [userID, courseID, shortId]);

    res.send({ message: `User ${userID} enrolled in course ${courseID}` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to enroll", error: err });
  }
};

const getStudentEnrollmentByCourse = async (req, res) => {
  try {
    const { userID } = req.params;
    console.log("Endpoint hit");
    const query = `
      SELECT 
        s.userID,
        s.userFirstName,
        s.userLastName,
        e.courseID,
        c.courseName
      FROM universityUsers s
      JOIN universityStudentEnrollment e ON s.userID = e.userID
      JOIN universityCourses c ON e.courseID = c.courseID
      WHERE c.userID = ?
    `;
    const results = await queryAsync(query, [userID]);
    if (results.length === 0) {
      return res
        .status(404)
        .send("No students found or teacher does not exist");
    }
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ message: "Failed to get student courses", error: err });
  }
};

module.exports = {
  getCourse,
  getCourseById,
  postEnrollment,
  getStudentEnrollmentByCourse,
};
