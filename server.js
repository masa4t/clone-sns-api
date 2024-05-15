const express = require("express");
const app = express();
const authRoutes = require("./routers/auth");
const postsRoutes = require("./routers/posts");
const usersRoutes = require("./routers/user");
const profileRoutes = require("./routers/profile");
require("dotenv").config();
const cors = require("cors");

const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`server is running ON PORT ${PORT}`);
});
