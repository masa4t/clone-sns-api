const fs = require("fs");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");

const prisma = new PrismaClient();
const router = express.Router();
const upload = multer({ dest: "images" }); // アップロード先のディレクトリを修正

router.put("/update/:userId", upload.single("image"), async (req, res) => {
  const { userId } = req.params;
  const { name, bio } = req.body;
  let profileImageUrl;

  if (req.file) {
    const oldPath = req.file.path;
    const newFileName = `${Date.now()}_${req.file.originalname}`;
    const newPath = path.join(__dirname, "../../../images", newFileName); // パスを修正

    try {
      const dir = path.dirname(newPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.renameSync(oldPath, newPath);
      profileImageUrl = `/images/${newFileName}`;
    } catch (error) {
      console.error("Error moving file:", error);
      return res.status(500).json({ error: "Error moving file" });
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        username: name,
        profile: {
          update: {
            bio: bio,
            profileImageUrl: profileImageUrl || undefined,
          },
        },
      },
      include: {
        profile: true, // プロフィール情報を含める
      },
    });
    return res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ユーザー情報の更新に失敗しました。" });
  }
});

module.exports = router;
