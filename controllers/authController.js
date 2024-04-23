const jwt = require("jsonwebtoken");
const { comparePassword, hashPassword, queryAsync } = requrie("/utils/auth.js");

const register = async (req, res) => {
  const insertQuery =
    "INSERT INTO universityUsers (`userID`,`userFirstName`,`userLastName`,`username`,`password`,`userEmail`,`usertelelphone`,`userAddress`,`userFaculty`,`userRole`,`userGender`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
  try {
    const {
      userFirstName,
      userLastName,
      username,
      password,
      userEmail,
      userTelephone,
      userAddress,
      userFaculty,
      userRole,
      userGender,
      userID,
    } = req.body;
    if (!username) return res.json({ error: "Username is required" });
    if (!password || password.length < 6)
      return res.json({
        error: "Password is required and should be atleast 6 character",
      });
    if (!userFirstName) return res.json({ error: "First Name is required" });
    if (!userLastName) return res.json({ error: "Last Name is required" });
    if (!userEmail) return res.json({ error: "Email is required" });
    if (
      !userTelephone ||
      userTelephone.length < 10 ||
      userTelephone.length > 10
    )
      return res.json({
        error:
          "Employee Telephone Number is required and must within 10 Characters",
      });
    if (!userAddress) return res.json({ error: "Address is required" });
    if (!userFaculty) return res.json({ error: "Faculty is required" });
    if (!userRole) return res.json({ error: "Role is required" });
    if (!userGender) return res.json({ error: "Gender is required" });
    if (!userID) return res.json({ error: "User ID is required" });

    const existedUser = await queryAsync(selectQuery, [username]);
    if (existedUser.length) {
      return res.status(500).json({ message: "User already existed!!" }).end();
    }
    const hashedPassword = await hashPassword(password);
    const valuesToInsert = [
      userFirstName,
      userLastName,
      username,
      password,
      userEmail,
      userTelephone,
      userAddress,
      userFaculty,
      userRole,
      userGender,
      userID,
    ];
    const newRegisteredUser = await queryAsync(insertQuery, valuesToInsert);
    return res
      .status(200)
      .json({ message: "User created successfully", ...newRegisteredUser })
      .end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error creating new employee" }).end();
  }
};

module.exports = { register };
