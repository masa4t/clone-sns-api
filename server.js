const express = require("express");
const app = express();
const authRoutes = require("./routers/auth");
const postsRoutes = require("./routers/posts");
const usersRoutes = require("./routers/user");
const profileRoutes = require("./routers/profile");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 10000;
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/public", express.static("public"));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/profile", profileRoutes);

app.listen(PORT, () => {
  console.log(`server is running ON PORT ${PORT}`);
});
