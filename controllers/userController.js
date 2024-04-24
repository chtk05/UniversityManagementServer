const { queryAsync } = require("../utils/auth.js");

const getUser = async (req, res) => {
  try {
    const selectQuery = "SELECT * FROM universityUsers";
    const userResult = await queryAsync(selectQuery);
    return res.status(200).json(userResult);
  } catch (err) {
    return res.status(501).json({ error: "Error getting user details" });
  }
};

module.exports = { getUser };
