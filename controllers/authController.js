const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const {
  comparePassword,
  hashPassword,
  queryAsync,
} = require("../utils/auth.js");
const selectQuery = "SELECT * FROM universityUsers WHERE username = ?";
const register = async (req, res) => {
  const insertQuery =
    "INSERT INTO universityUsers (`userID`,`userFirstName`,`userLastName`,`username`,`password`,`userEmail`,`usertelephone`,`userAddress`,`userFaculty`,`userRole`,`userGender`) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

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

    const existedUser = await queryAsync(selectQuery, [username]);
    if (existedUser.length) {
      return res.status(500).json({ message: "User already existed!!" }).end();
    }
    const hashedPassword = await hashPassword(password);
    const generatedUuid = uuidv4();
    let userID;
    const shortId = generatedUuid.replace(/-/g, "").substring(0, 6);
    if (userRole === "student") {
      userID = "ST" + shortId;
    } else if (userRole === "teacher") {
      userID = "TC" + shortId;
    } else {
      userID = "AD" + shortId;
    }
    const valuesToInsert = [
      userID,
      userFirstName,
      userLastName,
      username,
      hashedPassword,
      userEmail,
      userTelephone,
      userAddress,
      userFaculty,
      userRole,
      userGender,
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

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Invalid input" }).end();
    }

    const existedUser = await queryAsync(selectQuery, [username]);
    if (!existedUser) {
      return res.status(200).json({ message: "User not found" }).end();
    }
    const matchPassword = await comparePassword(
      password,
      existedUser[0].password
    );
    if (!matchPassword)
      return res.json({
        error: "Password do not matched!",
      });

    if (matchPassword) {
      jwt.sign(
        {
          firstName: existedUser[0].userFirstName,
          lastName: existedUser[0].userLastName,
          role: existedUser[0].userRole,
          userID: existedUser[0].userID,
        },
        process.env.JWT_SECRET,
        {
          //   expiresIn: "1h",
        },
        (err, token) => {
          if (err) {
            console.log(`login error ${err}`);
            return res
              .status(501)
              .json({ message: "Unauthorized access" })
              .end();
          }
          res.json({
            accessToken: token,
            user: existedUser[0],
          });
        }
      );
    }
  } catch (err) {
    console.log(`login error ${err}`);
    return res.status(501).json({ message: "Unauthorized access" }).end();
  }
};
const getProfile = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json({
    message: "User authenticated successfully",
    user: req.user,
  });
};

module.exports = { register, login, getProfile };
