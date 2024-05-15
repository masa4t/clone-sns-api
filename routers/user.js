const isAuthenticated = require("../middlewares/isAuthenticated");
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

router.get("/find", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ error: "ユーザーが見つかりません。" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (err) {
    console.error("ユーザーの取得中にエラーが発生しました", err);
    return res
      .status(500)
      .json({ error: "ユーザーの取得中にエラーが発生しました" });
  }
});

router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    console.log(err);
  }
});

//イメージ更新API
// router.put("/:userId", async (req, res) => {
//   const { userId } = req.params;
//   let { profileImageUrl } = req.body;
//   console.log("Received profile image URL:", profileImageUrl); // デバッグステートメント
//   if (!profileImageUrl.startsWith("http")) {
//     profileImageUrl = "/" + profileImageUrl;
//   }
//   try {
//     const updatedProfile = await prisma.profile.update({
//       where: { userId: parseInt(userId) },
//       data: { profileImageUrl },
//     });

//     res.status(200).json(updatedProfile);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to update profile image URL" });
//   }
// });

module.exports = router;
