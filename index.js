const express = require("express");
require("dotenv").config();
const authRoutes = require("./routes/authRoute.js");
const userRoutes = require("./routes/userRoute.js");
const courseRoutes = require("./routes/courseRoute.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", courseRoutes);

app.listen(process.env.PORT, () => {
  console.log(`App is listening on port ${process.env.PORT}`);
});
